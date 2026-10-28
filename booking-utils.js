'use strict';

// The demonstration has one explicit UTC+7 clock and never describes a real
// clinic's opening hours. No guest fields are accepted by the calendar writer.
(() => {
  const timeZone = 'Etc/GMT-7';
  const topics = Object.freeze({skin:'Skin consultation', facial:'Facial aesthetics', ageing:'Ageing well', unsure:'A first conversation'});
  function clock(date = new Date()) {
    const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US', {timeZone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(date).filter(p => p.type !== 'literal').map(p => [p.type,p.value]));
    return {date:`${parts.year}-${parts.month}-${parts.day}`,minutes:Number(parts.hour)*60+Number(parts.minute)};
  }
  function instant(date, time) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) throw new Error('Invalid demo date or time');
    const value = new Date(`${date}T${time}:00+07:00`);
    if (!Number.isFinite(value.getTime()) || clock(value).date !== date) throw new Error('Invalid demo date');
    return value;
  }
  function dates(start, offset = 0, count = 5) {
    instant(start,'12:00');
    return Array.from({length:count},(_,index) => {
      const date = new Date(start+'T12:00:00Z');
      date.setUTCDate(date.getUTCDate()+offset+index);
      return date.toISOString().slice(0,10);
    });
  }
  function calendar(request, createdAt = new Date(), language = 'en') {
    if (!Object.hasOwn(topics, request.interest) || !/^VL-\d{8}-\d{4}$/.test(request.reference)) throw new Error('Invalid demo request');
    const start = instant(request.date,request.time);
    const stamp = date => date.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');
    // The only fields used are enum topic, validated time and generated ID.
    // Never interpolate a guest name, email, note, organiser or attendee.
    const chinese = language === 'zh';
    const translatedTopics = {skin:'皮肤咨询',facial:'面部美学咨询',ageing:'年龄与肌肤咨询',unsure:'初次交流'};
    const lines = [
      'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Velune//Fictional Portfolio Demo//EN','CALSCALE:GREGORIAN','BEGIN:VEVENT',
      `UID:${request.reference}@velune.concept`,`DTSTAMP:${stamp(createdAt)}`,`DTSTART:${stamp(start)}`,
      `DTEND:${stamp(new Date(start.getTime()+30*60000))}`,
      `SUMMARY:${chinese ? '微澜演示行程 - '+translatedTopics[request.interest] : 'Velune demo - '+topics[request.interest]}`,
      chinese ? 'DESCRIPTION:这是虚构品牌的作品集演示行程，不代表真实预约。' : 'DESCRIPTION:Fictional portfolio itinerary. No real appointment is reserved.',
      'STATUS:TENTATIVE','TRANSP:TRANSPARENT','END:VEVENT','END:VCALENDAR'
    ];
    // RFC 5545 folds at 75 UTF-8 octets, never through a Unicode code point.
    const encoder = new TextEncoder();
    const fold = line => {
      let value = '', count = 0;
      for (const character of line) {
        const size = encoder.encode(character).length;
        if (count+size > 75) {value += '\r\n '; count = 1;}
        value += character; count += size;
      }
      return value;
    };
    return lines.map(fold).join('\r\n')+'\r\n';
  }
  window.VeluneBookingUtils = Object.freeze({clock,instant,dates,calendar});
})();
