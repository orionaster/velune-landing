'use strict';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const { t } = window.VeluneI18n;
const isChinese = () => window.VeluneI18n.language === 'zh';
const bookingUtils = window.VeluneBookingUtils;
const services = {
  skin: { name: 'Skin consultation', panel: 'panel-one', description: 'Start with what you use each day, how your skin feels and the questions behind your current routine.', outcome: "A clearer outline of your routine and a short list of questions to bring to a qualified professional.", topics: ['Your morning and evening routine', 'How your skin feels during an ordinary day', 'The products, habits and questions you want to discuss'] },
  facial: { name: 'Facial aesthetics', panel: 'panel-two', description: 'Bring a reference you like, describe the features you value and talk about how you want to express yourself.', outcome: "A more precise way to describe your preferences, without choosing a procedure or a fixed ideal.", topics: ['The features you appreciate about yourself', 'What draws you to a particular visual reference', 'Your expectations, uncertainties and personal boundaries'] },
  ageing: { name: 'Ageing well', panel: 'panel-three', description: 'Describe the changes you have noticed and how they fit with your routine, priorities and expectations.', outcome: "A personal set of priorities to reflect on, without pressure to act or a promise of results.", topics: ['The changes you have noticed over time', 'What feeling comfortable means to you now', 'Which questions matter now, and which can wait'] },
  unsure: { name: 'Help me find a starting point' }
};

const navToggle = $('.menu-toggle');
const mobileNav = $('#mobile-nav');
function closeNav() { mobileNav.hidden = true; navToggle.setAttribute('aria-expanded', 'false'); navToggle.setAttribute('aria-label', t('Open navigation')); }
navToggle.addEventListener('click', () => { const open = navToggle.getAttribute('aria-expanded') !== 'true'; mobileNav.hidden = !open; navToggle.setAttribute('aria-expanded', String(open)); navToggle.setAttribute('aria-label', t(open ? 'Close navigation' : 'Open navigation')); });
$$('a', mobileNav).forEach(link => link.addEventListener('click', closeNav));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeNav(); });
const desktopMedia = window.matchMedia('(min-width: 961px)');
desktopMedia.addEventListener('change', event => { if (event.matches) closeNav(); });
const navObserver = new IntersectionObserver(entries => { for (const entry of entries) { if (entry.isIntersecting) { $$('.desktop-nav a').forEach(link => link.classList.toggle('is-active', link.hash === '#' + entry.target.id)); } } }, { rootMargin: '-20% 0px -55% 0px', threshold: 0 });
$$('main > section[id]').forEach(section => navObserver.observe(section));

let lastDialogOpener = null;
const serviceDialog = $('#service-dialog');
const interestDialog = $('#interest-dialog');
let activeService = 'skin';
function openDialog(dialog, opener) { lastDialogOpener = opener || document.activeElement; dialog.showModal(); }
$$('.dialog-close').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
$$('dialog').forEach(dialog => {
  dialog.addEventListener('click', event => { if (event.target === dialog) { const bounds = dialog.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close(); } });
  dialog.addEventListener('close', () => { if (lastDialogOpener?.isConnected) lastDialogOpener.focus({ preventScroll: true }); });
});
function renderService() {
  const service = services[activeService];
  $('#service-dialog-title').textContent = t(service.name);
  $('#service-dialog-description').textContent = t(service.description);
  $('#service-dialog-outcome').textContent = t(service.outcome);
  $('#service-dialog-photo').className = 'dialog-photo panel-photo ' + service.panel;
  $('#service-dialog-topics').replaceChildren(...service.topics.map(topic => { const li = document.createElement('li'); li.textContent = t(topic); return li; }));
}
$$('[data-service-detail]').forEach(button => button.addEventListener('click', () => {
  activeService = button.dataset.serviceDetail;
  renderService();
  openDialog(serviceDialog, button);
}));
$('#open-interest').addEventListener('click', event => openDialog(interestDialog, event.currentTarget));

const form = $('#booking-form');
const steps = $$('.booking-step');
const stepItems = $$('.stepper li');
const dateInput = $('#appointment-date');
const nextButton = $('#booking-next');
const backButton = $('#booking-back');
const submitButton = $('#booking-submit');
const successPanel = $('#booking-success');
let currentStep = 0;
let submitting = false;
let submissionTimer = null;
let submittedRequest = null;
let dateOffset = 0;
let quickDateSignature = '';
const errorMessages = new Map();
const demoNow = () => bookingUtils.clock();
function formatDate(date) { return new Intl.DateTimeFormat(isChinese() ? 'zh-CN' : 'en-GB', { timeZone: 'Etc/GMT-7', day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(date + 'T12:00:00+07:00')); }
function formatTime(time) { if (isChinese()) return time; const [hours, minutes] = time.split(':').map(Number); return `${hours % 12 || 12}:${String(minutes).padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`; }
function selectedInterest() { return $('input[name=interest]:checked', form)?.value || ''; }
function selectedTime() { return $('input[name=time]:checked', form)?.value || ''; }
function announce(text) { $('#live-announcement').textContent = text; }
function setError(id, text) { errorMessages.set(id, text); $('#' + id + '-error').textContent = t(text); const input = { date: dateInput, name: $('#guest-name'), email: $('#guest-email'), consent: $('#demo-consent') }[id]; if (input) { input.setAttribute('aria-invalid', String(Boolean(text))); } }
function clearErrors() { errorMessages.clear(); $$('.field-error', form).forEach(error => { error.textContent = ''; }); $$('[aria-invalid]', form).forEach(input => input.removeAttribute('aria-invalid')); }
function updateTimeOptions() {
  const now = demoNow();
  dateInput.min = now.date;
  $$('input[name=time]', form).forEach(input => {
    const [hours, minutes] = input.value.split(':').map(Number);
    input.disabled = dateInput.value === now.date && hours * 60 + minutes <= now.minutes;
    if (input.disabled) input.checked = false;
  });
  updateSummary();
  renderQuickDates();
  const noTimes = dateInput.value && !$$('input[name=time]:not(:disabled)',form).length;
  $('#time-availability').hidden = !noTimes;
  $('#time-availability').textContent = noTimes ? t('No demonstration times remain today. Please choose another day.') : '';
}
function renderQuickDates() {
  const today = demoNow().date;
  const locale = isChinese() ? 'zh-CN' : 'en-GB';
  $('#dates-prev').disabled = dateOffset === 0;
  const list = bookingUtils.dates(today,dateOffset);
  const signature = locale+list.join(',');
  if (signature === quickDateSignature) {
    $$('#quick-dates button').forEach(button=>button.setAttribute('aria-pressed',String(dateInput.value === button.dataset.date)));
    return;
  }
  quickDateSignature = signature;
  $('#quick-dates').replaceChildren(...list.map(date => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.date = date;
    button.setAttribute('aria-pressed',String(dateInput.value === date));
    button.setAttribute('aria-label',formatDate(date));
    const weekday = document.createElement('span');
    weekday.textContent = date === today ? t('Today') : new Intl.DateTimeFormat(locale,{weekday:'short',timeZone:'UTC'}).format(new Date(date+'T12:00:00Z'));
    const day = document.createElement('strong'); day.textContent = String(Number(date.slice(-2)));
    const month = document.createElement('small'); month.textContent = new Intl.DateTimeFormat(locale,{month:'short',timeZone:'UTC'}).format(new Date(date+'T12:00:00Z'));
    button.append(weekday,day,month);
    button.addEventListener('click',() => {dateInput.value = date; setError('date',''); setError('time',''); updateTimeOptions();});
    return button;
  }));
}
$('#dates-prev').addEventListener('click',() => {dateOffset = Math.max(0,dateOffset-5); renderQuickDates();});
$('#dates-next').addEventListener('click',() => {dateOffset += 5; renderQuickDates();});
function updateSummary() {
  $('#summary-interest').textContent = t(services[selectedInterest()]?.name || 'Your choice, your starting point');
  const date = dateInput.value;
  const time = selectedTime();
  $('#summary-time').textContent = date && time ? `${formatDate(date)}, ${formatTime(time)} (UTC+7)` : date ? `${formatDate(date)} · ${t('choose a time')}` : t('Choose a date and time');
  $('#request-review-content').replaceChildren(
    summaryRow('Consultation',t(services[selectedInterest()]?.name || 'Your choice, your starting point')),
    summaryRow('Preferred visit',date && time ? `${formatDate(date)}, ${formatTime(time)} (UTC+7)` : t('Choose a date and time')),
    summaryRow('Language',t($('#guest-language').value))
  );
}
$('#review-edit-time').addEventListener('click',() => showStep(0));
$('#guest-language').addEventListener('change',updateSummary);
function showStep(index, focus = true) {
  const direction = index >= currentStep ? 1 : -1;
  currentStep = index;
  steps.forEach((step, i) => { step.hidden = i !== index; });
  stepItems.forEach((item, i) => { item.classList.toggle('active', i === index); item.classList.toggle('complete', i < index); if (i === index) item.setAttribute('aria-current', 'step'); else item.removeAttribute('aria-current'); });
  backButton.hidden = index === 0;
  nextButton.hidden = index === 2;
  submitButton.hidden = index !== 2;
  if (index === 1) updateTimeOptions();
  updateSummary();
  if (focus) window.VeluneMotion.step(steps[index], direction);
  $('.stepper').style.setProperty('--step-progress', `${index * 50}%`);
  if (focus) { $('h3', steps[index]).focus({preventScroll: true}); window.VeluneMotion.scrollTo($('.booking-panel'), {focus: $('h3', steps[index]), gap: 14}); }
  announce(isChinese() ? `第 ${index + 1} 步，共 3 步：${t(['Your interests', 'Preferred time', 'Your details'][index])}` : `Step ${index + 1} of 3: ${['Your interests', 'Preferred time', 'Your details'][index]}`);
}
function validateStep(index) {
  clearErrors();
  if (index === 0 && !selectedInterest()) { setError('interest', 'Please choose a consultation or select help finding a starting point.'); $('input[name=interest]', form).focus(); return false; }
  if (index === 1) {
    updateTimeOptions();
    if (!dateInput.value || dateInput.validity.badInput) { setError('date', 'Please choose a preferred date.'); dateInput.focus(); return false; }
    if (dateInput.value < demoNow().date) { setError('date', 'Please choose today or a future date in the demo timezone.'); dateInput.focus(); return false; }
    if (!selectedTime()) { setError('time', 'Please choose an available demonstration time.'); $('input[name=time]:not(:disabled)', form)?.focus(); return false; }
  }
  if (index === 2) {
    const name = $('#guest-name');
    const email = $('#guest-email');
    if (name.value.trim().length < 2) { setError('name', 'Please enter a fictional name with at least two characters.'); name.focus(); return false; }
    if (!email.value.trim() || !email.validity.valid) { setError('email', 'Please enter a valid demonstration email address.'); email.focus(); return false; }
    if (!$('#demo-consent').checked) { setError('consent', 'Please confirm that you understand this is a demonstration.'); $('#demo-consent').focus(); return false; }
  }
  return true;
}
nextButton.addEventListener('click', () => { if (validateStep(currentStep)) showStep(currentStep + 1); });
backButton.addEventListener('click', () => { if (!submitting) { clearErrors(); showStep(Math.max(0, currentStep - 1)); } });
dateInput.addEventListener('change', () => { setError('date', ''); setError('time', ''); updateTimeOptions(); });
$$('input[name=interest]', form).forEach(input => input.addEventListener('change', () => { setError('interest', ''); updateSummary(); }));
$$('input[name=time]', form).forEach(input => input.addEventListener('change', () => { setError('time', ''); updateSummary(); }));
$('#guest-name').addEventListener('input', () => setError('name', ''));
$('#guest-email').addEventListener('input', () => setError('email', ''));
$('#demo-consent').addEventListener('change', () => setError('consent', ''));
$('#guest-note').addEventListener('input', event => { $('#note-count').textContent = event.target.value.length; });
$('#fill-demo').addEventListener('click', () => { $('#guest-name').value = isChinese() ? '林悦（虚拟）' : 'Alex Morgan'; $('#guest-email').value = 'guest@example.com'; $('#guest-language').value = isChinese() ? 'Mandarin' : 'English'; $('#guest-note').value = isChinese() ? '我想了解一下初次咨询的流程。（虚拟资料）' : 'I’d like to learn more about the consultation experience.'; $('#note-count').textContent = $('#guest-note').value.length; clearErrors(); updateSummary(); announce(t('Fictional demonstration details filled in.')); });

function beginBooking(interest) {
  if (submitting) return;
  if (successPanel.hidden === false) { successPanel.hidden = true; form.hidden = false; $('.stepper').hidden = false; }
  if (services[interest]) $(`input[name=interest][value="${interest}"]`, form).checked = true;
  clearErrors(); showStep(0, false);
  $('h3', steps[0]).focus({preventScroll: true});
  window.VeluneMotion.scrollTo($('#booking'), {focus: $('h3', steps[0])});
}
$('#service-dialog-book').addEventListener('click', () => { lastDialogOpener = null; serviceDialog.close(); beginBooking(activeService); });
$$('[data-guide]').forEach(button => button.addEventListener('click', () => { lastDialogOpener = null; interestDialog.close(); beginBooking(button.dataset.guide); announce(isChinese() ? `已选择${t(services[button.dataset.guide].name)}，请继续选择时间。` : `Selected ${services[button.dataset.guide].name}. Continue to choose a time.`); }));
function summaryRow(label, value) { const div = document.createElement('div'); const span = document.createElement('span'); span.textContent = t(label); const strong = document.createElement('strong'); strong.textContent = value; div.append(span, strong); return div; }
function renderSuccess() {
  if (!submittedRequest) return;
  const request = submittedRequest;
  if (!$('#calendar-feedback').hidden) $('#calendar-feedback').textContent = t('Demo itinerary prepared. No appointment has been reserved.');
  $('#success-reference').textContent = request.reference;
  $('#success-summary').replaceChildren(
    summaryRow('Consultation', t(services[request.interest].name)),
    summaryRow('Preferred time', `${formatDate(request.date)}, ${formatTime(request.time)} (UTC+7)`),
    summaryRow('Name', request.name), summaryRow('Language', t(request.language))
  );
}
function renderSubmitButton() {
  submitButton.replaceChildren(document.createTextNode(t(submitting ? 'Completing your demo…' : 'Submit demo request')));
  if (!submitting) {
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.classList.add('icon'); icon.setAttribute('aria-hidden', 'true');
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', '#arrow-right'); icon.append(use); submitButton.append(icon);
  }
}
form.addEventListener('submit', event => {
  event.preventDefault();
  if (submitting) return;
  if (currentStep < 2) { if (validateStep(currentStep)) showStep(currentStep + 1); return; }
  for (let index = 0; index < 3; index++) { if (!validateStep(index)) { if (index !== currentStep) showStep(index); return; } }
  submittedRequest = Object.freeze({ interest: selectedInterest(), date: dateInput.value, time: selectedTime(), name: $('#guest-name').value.trim(), language: $('#guest-language').value, reference: `VL-${dateInput.value.replaceAll('-', '')}-${String(Math.floor(Math.random() * 9000) + 1000)}` });
  $('#calendar-feedback').hidden = true;
  submitting = true; submitButton.disabled = true; backButton.disabled = true; renderSubmitButton(); form.setAttribute('aria-busy', 'true');
  const controls = $$('input,select,textarea,button',form).map(control => ({control,disabled:control.disabled}));
  controls.forEach(({control}) => {control.disabled = true;});
  // The delay demonstrates submitting feedback. There is no network call or storage.
  submissionTimer = window.setTimeout(() => {
    renderSuccess();
    form.hidden = true; $('.stepper').hidden = true; successPanel.hidden = false; $('#success-title').focus({preventScroll: true}); window.VeluneMotion.scrollTo($('.booking-panel'), {focus: $('#success-title'), gap: 14});
    window.VeluneMotion.success(successPanel);
    announce(t('Demo booking complete. No request was sent to the clinic.'));
    controls.forEach(({control,disabled}) => {control.disabled = disabled;});
    submitting = false; submissionTimer = null; submitButton.disabled = false; backButton.disabled = false; form.removeAttribute('aria-busy'); renderSubmitButton();
  }, 650);
});
$('#start-again').addEventListener('click', () => { submittedRequest = null; dateOffset = 0; form.reset(); clearErrors(); $('#note-count').textContent = '0'; successPanel.hidden = true; form.hidden = false; $('.stepper').hidden = false; showStep(0); updateTimeOptions(); });
$('#edit-request').addEventListener('click', () => { successPanel.hidden = true; form.hidden = false; $('.stepper').hidden = false; showStep(2); });
document.addEventListener('visibilitychange', () => { if (!document.hidden) updateTimeOptions(); });
$('#footer-year').textContent = new Date().getFullYear();
updateTimeOptions();

window.VeluneI18n.subscribe(() => {
  renderService(); updateSummary(); renderSuccess(); renderSubmitButton(); renderQuickDates(); renderSpace();
  if (!$('#time-availability').hidden) $('#time-availability').textContent = t('No demonstration times remain today. Please choose another day.');
  for (const [id, message] of errorMessages) $('#' + id + '-error').textContent = t(message);
  navToggle.setAttribute('aria-label', t(navToggle.getAttribute('aria-expanded') === 'true' ? 'Close navigation' : 'Open navigation'));
  announce(isChinese() ? '已切换至中文，填写资料保持不变。' : 'Switched to English. Your entered details are unchanged.');
});
renderService();

// Native, keyboard-accessible space gallery and concept notes share the same
// close / return-focus behaviour as the consultation dialogs.
const spaceDialog = $('#space-dialog');
const spaces = [
  {key:'conversation',src:'assets/conversation-room.webp',title:'Room for a conversation',alt:'Illustrative private conversation room with teal chairs and filtered daylight'},
  {key:'reception',src:'assets/atelier-salon.webp',title:'A softer arrival',alt:'Illustrative sunlit salon with a curved plaster wall and deep teal chairs'}
];
let spaceIndex = 0;
function renderSpace() {
  const space = spaces[spaceIndex];
  $('#space-image').src = space.src;
  $('#space-image').alt = t(space.alt);
  $('#space-title').textContent = t(space.title);
}
$$('[data-space]').forEach(button => button.addEventListener('click',() => {spaceIndex = spaces.findIndex(space=>space.key === button.dataset.space); renderSpace(); openDialog(spaceDialog,button);}));
function moveSpace(direction) {spaceIndex = (spaceIndex+direction+spaces.length)%spaces.length; renderSpace();}
$('#space-prev').addEventListener('click',()=>moveSpace(-1));
$('#space-next').addEventListener('click',()=>moveSpace(1));
spaceDialog.addEventListener('keydown',event => {if(event.key === 'ArrowRight') {event.preventDefault(); moveSpace(1);} if(event.key === 'ArrowLeft') {event.preventDefault(); moveSpace(-1);}});
$$('[data-open-concept]').forEach(button => button.addEventListener('click',()=>openDialog($('#concept-dialog'),button)));
$('#download-itinerary').addEventListener('click',() => {
  if (!submittedRequest) {announce(t('Please finish the demonstration before downloading an itinerary.')); return;}
  const file = new Blob([bookingUtils.calendar(submittedRequest,new Date(),isChinese() ? 'zh' : 'en')],{type:'text/calendar;charset=utf-8'});
  const url = URL.createObjectURL(file);
  const link = document.createElement('a'); link.href = url; link.download = `velune-demo-${submittedRequest.reference}.ics`;
  document.body.append(link); link.click(); link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
  $('#calendar-feedback').hidden = false;
  $('#calendar-feedback').textContent = t('Demo itinerary prepared. No appointment has been reserved.');
  announce(t('Demo itinerary prepared. No appointment has been reserved.'));
});
