'use strict';

// Text nodes are captured once, before app.js creates dynamic content. Switching
// language never replaces form elements, user input, dialog state or focus.
(() => {
  const translations = new Map([
    ['Vélune | Beauty at Your Own Pace', '微澜 Vélune | 美有千种，自有你的节奏'],
    ['Skip to content', '跳至正文'],
    ['AESTHETIC ATELIER', '微澜 · 美学咨询'],
    ['Home', '首页'], ['Consultations', '咨询方向'], ['About Vélune', '关于微澜'], ['Visit & FAQ', '到访与常见问题'],
    ['Fictional brand concept', '虚构品牌案例'], ['Book a consultation', '预约咨询'],
    ['BEAUTY · CONFIDENCE · A BRIGHTER YOU', '美 · 自信 · 更明亮的自己'],
    ['Your beauty,', '美有千种，'], ['your own rhythm.', '自有你的节奏。'],
    ['A thoughtful approach to aesthetic consultation.', '让每一次美学咨询，都从你的感受出发。'],
    ['A little clarity. A personal conversation. Your next step.', '多一份了解，多一份从容，找到适合自己的下一步。'],
    ['Explore consultations', '了解咨询方向'], ['International outlook', '面向国际客户'], ['A personal welcome', '用心迎接每一位来访者'],
    ['An imagined city retreat', '一处想象中的城市空间'], ['An entirely fictional setting', '完全虚构的地点'],
    ['Your consultation, your pace.', '你的咨询，依照你的节奏。'], ['Space to ask questions.', '留出提问的空间，'], ['Time to feel understood.', '也留出被理解的时间。'],
    ['Illustrative concept interior', '概念空间示意'], ['Pause motion', '暂停动效'], ['Resume motion', '开启动效'], ['Motion follows your device preference', '动效遵循设备的减少动态效果设置'],
    ['A starting point,', '发现你的'], ['just for you.', '美学咨询起点。'],
    ['Explore a direction that feels right. We’ll take the next step together.', '选择你想了解的方向，让下一步更清晰。'],
    ['Skin & everyday care', '肌肤与日常护理'], ['Skin consultation', '皮肤咨询'],
    ['A conversation about your skin, your routine and what you’d like to understand better.', '从肤质、日常护理到你的疑问，展开一场关于肌肤的交流。'],
    ['Explore this consultation', '了解这一方向'], ['Balance & individuality', '协调与个人特点'], ['Facial aesthetics', '面部美学咨询'],
    ['Explore your aesthetic preferences with a focus on balance and what makes you, you.', '围绕面部协调与审美偏好，理解属于你自己的美。'],
    ['Confidence at every stage', '每个阶段，都有自己的从容'], ['Ageing well', '年龄与肌肤咨询'],
    ['Make room for questions about changing skin and your personal approach to feeling well.', '聊聊随年龄变化的肌肤，以及你对状态与日常护理的期待。'],
    ['Illustrative consultation categories and portraits.', '咨询分类与人物图片均为演示内容。'], ['Not sure where to start?', '还不确定从哪里开始？'],
    ['A more personal', '理解你的期待，'], ['kind of', '让咨询'], ['consultation.', '更贴近你。'],
    ['Thoughtful conversations. Individual perspectives.', '认真倾听每个问题，尊重每一种期待。'],
    ['At Vélune, we believe a good consultation begins with listening. With space to share your questions and preferences, the experience can start with what matters to you.', '在微澜，我们希望好的咨询从倾听开始。让你的疑问与偏好有空间被表达，也让体验从你真正关心的事情出发。'],
    ['This concept brings that idea to life: an imagined light-filled atelier, a clear introduction to your options and an unhurried first conversation.', '这份概念展示呈现了我们对体验的设想：一处想象中的明亮美学空间，清晰易懂的咨询介绍，以及一场从容展开的初次交流。'],
    ['Discover the experience', '了解到访体验'], ['A glimpse of the envisioned experience · Concept imagery', '关于未来空间的想象 · 概念图片'],
    ['A welcome at every step', '每一步，都有细致接待'], ['Illustrative team roles and portraits', '以下接待角色与人物均为演示'],
    ['Consultation guidance', '咨询引导'], ['A friendly first conversation about your interests and questions.', '从一次友善的交流开始，了解你的意向与疑问。'],
    ['Personal client care', '客户接待'], ['A clear introduction to each step of your planned visit.', '清楚介绍到访流程，让每一步都更安心。'],
    ['International liaison', '国际沟通协助'], ['Thoughtful coordination for a more comfortable conversation.', '用心协调沟通，让交流更舒适顺畅。'],
    ['Your visit,', '初次到访，'], ['made clearer.', '心中更有把握。'],
    ['A little preparation for a more comfortable first conversation.', '提前了解一点，让初次交流更从容。'],
    ['Imagine your first visit', '想象你的初次到访'], ['The Vélune Atelier · Fictional', '微澜美学空间 · 虚构'], ['Try the booking demo', '体验预约演示'],
    ['A simple next step', '简单清晰的下一步'], ['Share your interests, suggest a time,', '选择咨询方向与意向时间，'], ['then explore the demo outcome.', '查看虚拟预约的完成状态。'],
    ['A conversation that feels comfortable', '用你熟悉的语言交流'], ['Select your preferred language', '在预约演示中选择'], ['in the demonstration booking.', '你偏好的沟通语言。'],
    ['Before your first visit', '到访前，你可能想了解'],
    ['Does a booking request confirm my appointment?', '提交申请后，预约就确认了吗？'],
    ['A request is a preferred time, rather than a confirmed appointment. In this demo, no request is sent to the clinic. A real appointment would require a separate confirmation.', '申请仅表达你的意向时间，并不代表预约已确认。本演示不会向机构发送任何申请，正式预约需要另行确认。'],
    ['Can I book if I’m unsure what to choose?', '还不确定咨询方向，也可以体验预约吗？'],
    ['Of course. Choose “Help me find a starting point” in the booking form, or try our short interest guide. It simply helps organise your questions.', '可以。在预约中选择“帮我找到咨询起点”，或使用简短的意向引导。它只帮助整理你的问题。'],
    ['Are the services and availability real?', '这里的咨询服务和时段是真实的吗？'],
    ['The consultation categories, team portraits, interior imagery and available times are illustrative. They demonstrate the experience and do not describe confirmed clinical services or real availability.', '咨询分类、接待人物、空间图片与可选时段均为演示内容，用于展示体验，不代表已确认的实际服务或真实可预约时间。'],
    ['What should I share in this demo?', '体验演示时应该填写哪些信息？'],
    ['Please use the sample details provided. Keep medical information, photographs, identity documents and real contact details out of this demonstration.', '请使用页面提供的虚拟资料，不要填写医疗信息、上传照片或证件，也不要提供真实联系方式。'],
    ['Can I choose a language for my consultation?', '可以选择咨询的沟通语言吗？'],
    ['Try an English or Mandarin preference. This fictional brand has no real reception team or language service.', '可体验英语或普通话偏好的选择；虚构品牌没有真实接待团队或语言服务。'],
    ['Let’s begin', '让我们从'], ['with a conversation.', '一次交流开始。'],
    ['Choose a direction and a time that suits you. Try the complete booking experience.', '选择咨询方向与意向时间，体验完整的预约流程。'],
    ['Your consultation request', '你的咨询预约申请'], ['Interactive demo', '交互演示'], ['Your interests', '咨询意向'], ['Preferred time', '意向时段'], ['Your details', '联系资料'],
    ['What would you like to explore?', '你想先了解哪一个方向？'],
    ['A starting point is all you need. You can always change your selection.', '先选一个感兴趣的起点，之后仍可调整。'],
    ['Consultation interest', '咨询意向'], ['Skin, routine and everyday care', '肌肤、日常习惯与护理'], ['Balance, preferences and individuality', '协调、审美偏好与个人特点'],
    ['Changing skin and personal goals', '肌肤变化与个人期待'], ['Help me find a starting point', '帮我找到咨询起点'], ['I’d like to ask a few questions first', '我想先聊聊自己的问题'],
    ['A time to make it personal.', '选一个适合交流的时间。'],
    ['Demo timezone: UTC+7. All times and availability are fictional.', '演示时区为 UTC+7，所有时段和可用情况均为虚构。'],
    ['Preferred date', '意向日期'], ['10:30 AM', '10:30'], ['11:30 AM', '11:30'], ['2:00 PM', '14:00'], ['3:00 PM', '15:00'], ['4:00 PM', '16:00'], ['5:00 PM', '17:00'],
    ['Choosing a time expresses a preference. It does not reserve an appointment.', '选择时段仅表达意向，不会占用实际预约名额。'],
    ['A few details to finish.', '再补充一点资料。'], ['Use demo details', '填入虚拟资料'], ['Please use fictional details for this demonstration.', '本演示请使用虚拟资料。'],
    ['Your name', '称呼'], ['Preferred language', '沟通语言'], ['English', '英语'], ['Mandarin', '普通话'], ['Email address', '电子邮箱'],
    ['Anything you’d like to ask?', '还有想了解的内容吗？'], ['Optional', '选填'],
    ['I understand this is a demonstration. My request will not be sent to the clinic.', '我已了解这是演示体验，申请不会发送给机构。'],
    ['Back', '上一步'], ['Continue', '下一步'], ['Submit demo request', '提交演示申请'], ['Completing your demo…', '正在完成演示…'],
    ['No request is sent. Your details are not saved.', '不会发送申请，也不会保存你的资料。'],
    ['DEMO REQUEST COMPLETE', '演示申请已完成'], ['Your next step,', '下一步，'], ['beautifully considered.', '已有清晰的起点。'],
    ['You’ve completed the booking experience.', '你已完成这次预约体验。'], ['This demonstration has not contacted the clinic.', '本演示没有联系机构。'],
    ['Demo reference', '演示编号'], ['Pending confirmation', '待确认 · 演示'], ['Try another booking', '重新体验预约'], ['Edit these details', '返回修改资料'],
    ['A little more clarity.', '多一份清晰，'], ['A little more you.', '更贴近自己。'],
    ['Your consultation begins with your own questions, preferences and pace.', '从你的疑问、偏好与节奏，开启这场咨询。'],
    ['Consultation', '咨询方向'], ['Your choice, your starting point', '从你的选择开始'], ['Preferred visit', '意向到访时间'], ['Choose a date and time', '请选择日期与时段'], ['Location', '地点'], ['Name', '称呼'], ['Language', '沟通语言'], ['choose a time', '请选择时段'],
    ['Vélune is a fictional brand. This portfolio demo does not represent an operating clinic.', '微澜为虚构品牌，本作品集演示不代表真实营业的机构。'],
    ['Independent portfolio concept. Vélune is fictional; all services, people, locations and availability are illustrative.', '独立作品集概念。微澜为虚构品牌，服务、人物、地点与预约时段均为演示。'],
    ['Beauty, in your own rhythm.', '美有千种，自有你的节奏。'],
    ['A personal starting point', '属于你的咨询起点'], ['What you can explore', '可以聊些什么'],
    ['Illustrative consultation only. This page does not offer a diagnosis or recommend a treatment.', '咨询内容仅供演示，页面不提供诊断或治疗建议。'],
    ['Choose this consultation', '选择这一咨询方向'], ['Find your', '找到你的'], ['starting point.', '咨询起点。'], ['What would you most like to talk about?', '你现在最想聊些什么？'],
    ['My skin and everyday routine', '我的肌肤与日常护理'], ['Facial balance and my preferences', '面部协调与审美偏好'], ['Changing skin as I get older', '随年龄变化的肌肤'], ['I’d simply like to ask questions', '我只是想先问一些问题'],
    ['This guide organises your interests. It does not assess your skin or recommend treatments.', '此引导仅整理咨询意向，不评估肤质或推荐治疗。'],
    ['Vélune home', '微澜 Vélune 首页'], ['Main navigation', '主导航'], ['Open navigation', '展开导航'], ['Close navigation', '收起导航'], ['Mobile navigation', '手机导航'], ['Switch to Chinese', '切换至英文'],
    ['Illustrative light-filled reception with a white marble desk, plants and blue lounge chairs', '概念接待空间：白色大理石前台、绿植与蓝色休息椅'],
    ['Illustrative beauty portrait of a woman gently resting her fingertips on her cheek', '演示美学人物肖像：手指轻触面颊'],
    ['Illustrative three-quarter beauty portrait', '演示美学人物的侧面肖像'], ['Illustrative side-profile beauty portrait', '演示美学人物的轮廓肖像'],
    ['Concept view of the marble reception and calm lounge', '大理石前台与休息区的概念图片'], ['Detail of the illustrative sunlit seating area', '阳光休息区的概念细节'],
    ['Fictional consultation coordinator portrait', '虚拟咨询引导角色肖像'], ['Fictional client care coordinator portrait', '虚拟客户接待角色肖像'], ['Fictional international liaison portrait', '虚拟国际沟通角色肖像'],
    ['Illustrative bright lounge with city views', '概念休息区与城市景观'], ['Booking steps', '预约步骤'], ['e.g. Alex Morgan', '例如：林悦（虚拟）'], ['e.g. guest@example.com', '例如：guest@example.com'],
    ['Use fictional preferences only. Please don’t include medical or personal information.', '请只填写虚拟意向，不要包含医疗信息或个人隐私。'],
    ['Concept reception detail', '概念接待区细节'], ['Footer navigation', '页脚导航'], ['Close consultation details', '关闭咨询详情'], ['Illustrative beauty portrait', '演示美学人物肖像'], ['Close interest guide', '关闭意向引导'],
    ['A personal conversation about your skin, everyday habits and the questions you’d like to explore.', '围绕你的肌肤、日常习惯和想了解的问题，展开一次个人交流。'],
    ['Your current routine and personal preferences', '目前的日常护理与个人偏好'], ['The questions you want to bring to a consultation', '你希望在咨询中了解的问题'], ['What a thoughtful first conversation could look like', '初次交流可以如何展开'],
    ['A starting point for discussing your aesthetic preferences, with individuality at the centre of the conversation.', '以个人特点为起点，一起聊聊你的审美偏好。'],
    ['Your preferences around facial balance and appearance', '你对面部协调与外观的偏好'], ['Your expectations and questions', '你的期待与疑问'], ['A clear introduction to the consultation process', '清晰了解咨询的基本流程'],
    ['Space to ask questions about changing skin, your own priorities and feeling comfortable at every stage.', '为肌肤变化、个人关注与不同阶段的感受，留出交流的空间。'],
    ['The changes you would like to discuss', '你想聊聊的肌肤变化'], ['Your routine and personal goals', '你的日常习惯与个人期待'], ['Questions to explore in a future consultation', '希望在后续咨询中了解的问题'],
    ['Please choose a consultation or select help finding a starting point.', '请选择咨询方向，或选择“帮我找到咨询起点”。'],
    ['Please choose a preferred date.', '请选择意向日期。'], ['Please choose today or a future date in the demo timezone.', '请选择演示时区的今天或未来日期。'], ['Please choose an available demonstration time.', '请选择一个可用的演示时段。'],
    ['Please enter a fictional name with at least two characters.', '请输入至少两个字的虚拟称呼。'], ['Please enter a valid demonstration email address.', '请输入格式有效的演示邮箱。'], ['Please confirm that you understand this is a demonstration.', '请确认你已了解这是演示体验。'],
    ['Fictional demonstration details filled in.', '已填入虚拟演示资料。'], ['Demo booking complete. No request was sent to the clinic.', '演示预约已完成，没有向机构发送申请。'],
    ['Vélune is a fictional aesthetic brand created as a personal portfolio concept. Explore the bilingual website and interactive booking demo.', '微澜 Vélune 是为个人作品集设计的虚构美学品牌，展示双语网站与完整预约交互。'],
    ["A fictional aesthetic atelier. An independent bilingual brand and booking experience.", "虚构美学空间，独立设计的双语品牌与预约交互体验。"],
    ["AESTHETICS, AT YOUR PACE", "美学，依照你的节奏"],
    ["A personal conversation about skin, aesthetics and feeling like yourself. Space to ask. Freedom to choose.", "从肌肤、审美到自我感受，展开一次属于你的交流。留出提问的空间，也保留选择的从容。"],
    ["30-minute concept session", "30 分钟概念交流"],
    ["View the conversation room", "查看交流空间大图"],
    ["Illustrative private conversation room with teal chairs and filtered daylight", "概念交流空间：深青座椅与柔和日光"],
    ["View the reception", "查看接待空间大图"],
    ["Care, before anything else.", "用心，先于一切。"],
    ["The principles behind this concept", "这个概念品牌的三个原则"],
    ["Listen before suggesting", "先倾听，再交流"],
    ["Begin with the questions you bring, rather than an expectation of how you should look.", "从你想了解的问题开始，尊重你对自己的感受与期待。"],
    ["Keep the conversation clear", "让信息清楚易懂"],
    ["Make room for plain explanations, thoughtful questions and a pace that feels comfortable.", "以易懂的说明和从容的节奏，为每一次提问留出空间。"],
    ["Leave room to choose", "把选择留给自己"],
    ["A first conversation is a starting point. You decide what, if anything, comes next.", "初次交流只是一个起点。是否继续、如何继续，都依照你的意愿。"],
    ["From curiosity to clarity.", "从好奇，到心中有数。"],
    ["A first conversation, thoughtfully imagined.", "对一场初次交流的细致设想。"],
    ["Share what matters", "说说你关心的事"],
    ["Choose a consultation direction, or let the interest guide help you find a starting point.", "选择咨询方向，也可以通过意向引导找到一个适合交流的起点。"],
    ["Choose your moment", "选一个从容的时刻"],
    ["Explore illustrative dates and times, then choose your preferred conversation language.", "体验演示日期与时段的选择，再选用你熟悉的沟通语言。"],
    ["Take a clear next step", "带走清晰的下一步"],
    ["Review your request and download a demo itinerary. No appointment is made.", "核对你的选择，下载演示行程。整个过程不会产生真实预约。"],
    ["An imagined atelier. An entirely fictional setting.", "想象中的美学空间，地点完全虚构。"],
    ["Vélune is an independent fictional brand. The consultation categories, spaces, portraits and times are illustrative, with no real clinic or appointment availability.", "微澜是独立设计的虚构品牌，咨询分类、空间、人物与时段均为示意，不对应真实机构或实际可预约时间。"],
    ["Find a moment", "选一个交流时间"],
    ["Previous dates", "前一组日期"],
    ["Next dates", "后一组日期"],
    ["Suggested demonstration dates", "快捷演示日期"],
    ["Review your request", "核对预约意向"],
    ["Change direction or time", "修改方向或时间"],
    ["Download demo itinerary", "下载演示行程"],
    ["The calendar file contains the demo time and topic only. No contact details.", "日历文件仅包含演示时间与主题，不包含联系方式。"],
    ["About this concept", "关于这个案例"],
    ["Back to the beginning", "回到页面开头"],
    ["Close space gallery", "关闭空间图库"],
    ["Room for a conversation", "为交流留出的空间"],
    ["Generated concept imagery. An imagined space, not a real location.", "生成的概念影像，仅为空间设想，不对应真实地点。"],
    ["Previous space", "上一张空间图"],
    ["Next space", "下一张空间图"],
    ["Close concept information", "关闭案例说明"],
    ["An independent brand concept.", "一个独立的品牌概念。"],
    ["Vélune is a fictional aesthetic atelier created for a personal portfolio. It brings together a bilingual brand experience, considered motion and a complete booking interaction.", "微澜是为个人作品集创作的虚构美学品牌，呈现完整的双语品牌体验、滚动展示与预约交互。"],
    ["What you can experience", "你可以体验什么"],
    ["Explore consultation directions, view the imagined spaces and try a three-step request with sample details. Switch languages at any point without losing your choices.", "了解咨询方向、浏览想象中的空间，并用虚拟资料完成三步预约。在任何步骤切换语言，都可以保留已有选择。"],
    ["Your demo, your privacy", "演示体验与资料说明"],
    ["No request is sent and no contact information is stored. Refreshing clears your entries. The optional calendar download contains the fictional topic and time only.", "不会发送申请或保存联系信息，刷新页面即清空输入。可选的日历下载仅包含虚构主题和演示时间。"],
    ["All services, locations, portraits and availability are illustrative. This concept offers no diagnosis, treatment recommendation or medical credentials.", "服务、地点、人物与时段均为示意。此案例不提供诊断、治疗建议或任何医疗资质背书。"],
    ["Today", "今天"],
    ["Your request at a glance", "你的预约意向一览"],
    ["Demo itinerary prepared. No appointment has been reserved.", "演示行程已生成，没有预留真实预约。"],
    ["Please finish the demonstration before downloading an itinerary.", "请先完成预约演示，再下载行程。"],
    ["The reception", "接待空间"],
    ["A brighter welcome", "明亮而从容的迎接"],
    ["Fictional demonstration format", "虚构的交流形式"],
    ["A conversation, never a commitment.", "一次交流，一个自由的起点。"],
    ["A short introduction, your questions and space to reflect. All timings are illustrative.", "简短介绍、交流你的问题、留出思考时间。所有时长均为演示设定。"],
    ["About this consultation", "关于这次交流"],
    ["No demonstration times remain today. Please choose another day.", "今天的演示时段已结束，请选择其他日期。"],
    ["Illustrative light-filled aesthetic atelier", "明亮的概念美学空间"],
    ["A FICTIONAL AESTHETIC ATELIER", "一个虚构的美学空间"],
    ["Bring your questions about skin, appearance and change. Begin with a conversation, at your own pace.", "关于肌肤、外貌与变化，你的疑问都值得被听见。从一次从容的交谈开始。"],
    ["Three ways to begin. Choose the questions you want to make space for.", "三个交谈起点。选择此刻最想了解的方向。"],
    ["Talk through your everyday routine, how your skin feels and the habits you want to understand.", "从日常护理、肌肤感受与生活习惯聊起，梳理你想进一步了解的问题。"],
    ["Look at the features you value, the references you like and what feels true to your own appearance.", "聊聊你欣赏的面部特点与审美参考，理解什么样的表达更贴近自己。"],
    ["Discuss the changes you have noticed, what matters to you now and the questions you want to ask.", "从你留意到的变化聊起，整理当下在意的事，以及希望进一步提出的问题。"],
    ["Your questions set the direction.", "让你的问题，决定交谈的方向。"],
    ["There is no single way to feel like yourself. A first conversation can begin with your routine, a photo you connect with, or a change you are still finding words for.", "找到自己的状态，没有统一答案。第一次交谈，可以从日常习惯、一张喜欢的照片，或尚不知如何描述的变化开始。"],
    ["Vélune imagines a place for that pause: two chairs, softened daylight and time to put your thoughts in order. You choose what to explore, and what can wait.", "微澜为这份停顿构想了一个空间：两把椅子、柔和的日光，以及整理思绪的时间。想聊什么、哪些可以留待以后，都由你决定。"],
    ["Start with what you use each day, how your skin feels and the questions behind your current routine.", "从每天使用的护理用品、肌肤感受，以及现有护理习惯背后的疑问聊起。"],
    ["Bring a reference you like, describe the features you value and talk about how you want to express yourself.", "带来喜欢的审美参考，聊聊你欣赏的面部特点，以及希望怎样表达自己。"],
    ["Describe the changes you have noticed and how they fit with your routine, priorities and expectations.", "聊聊你留意到的变化，以及这些变化与日常习惯、当下重点和个人期待的关系。"],
    ["Your morning and evening routine", "早晚护理习惯"],
    ["How your skin feels during an ordinary day", "一天中不同时间的肌肤感受"],
    ["The products, habits and questions you want to discuss", "想进一步讨论的用品、习惯与疑问"],
    ["The features you appreciate about yourself", "你欣赏自己的哪些特点"],
    ["What draws you to a particular visual reference", "一张审美参考中吸引你的地方"],
    ["Your expectations, uncertainties and personal boundaries", "个人期待、尚未想清的事与边界"],
    ["The changes you have noticed over time", "你随时间留意到的变化"],
    ["What feeling comfortable means to you now", "当下怎样的状态让你感到自在"],
    ["Which questions matter now, and which can wait", "哪些问题是当下重点，哪些可以留待以后"],
    ["A clearer outline of your routine and a short list of questions to bring to a qualified professional.", "更清楚地梳理自己的护理习惯，并整理希望向专业人士提出的问题。"],
    ["A more precise way to describe your preferences, without choosing a procedure or a fixed ideal.", "更准确地表达个人审美偏好，不预设项目，也不设定统一的理想标准。"],
    ["A personal set of priorities to reflect on, without pressure to act or a promise of results.", "整理值得继续思考的个人重点，不附带行动压力或效果承诺。"],
    ["A softer arrival", "柔和的抵达"],
    ["Illustrative sunlit salon with a curved plaster wall and deep teal chairs", "示意：弧形灰泥墙与深青座椅构成的日光会客空间"],
    ["What you can take away", "交谈后，可以带走的理解"],
    ["View the arrival salon", "查看抵达会客空间"],
    ["Illustrative sunlit atelier with deep teal chairs", "示意：日光与深青座椅构成的美学空间"],
  ]);
  const normalise = text => text.trim().replace(/\s+/g, ' ');
  let language = new URLSearchParams(location.search).get('lang') === 'zh' ? 'zh' : 'en';
  const subscribers = new Set();
  const t = text => language === 'zh' ? translations.get(text) ?? text : text;
  const walker = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      return node.parentElement.closest('script,style,textarea,[data-no-translate]') || !normalise(node.data)
        ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
    }
  });
  const nodes = [];
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const key = normalise(node.data);
    if (translations.has(key)) nodes.push({ node, original: node.data, key });
  }
  const attributes = [];
  for (const element of document.querySelectorAll('[alt],[aria-label],[placeholder],meta[name=description],meta[property="og:title"],meta[property="og:description"]')) {
    for (const name of ['alt', 'aria-label', 'placeholder', 'content']) {
      const original = element.getAttribute(name);
      if (original && translations.has(original)) attributes.push({ element, name, original });
    }
  }
  const toggle = document.querySelector('#language-toggle');
  function render() {
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
    for (const {node, original, key} of nodes) if (node.isConnected) node.data = language === 'en' ? original : original.replace(original.trim(), t(key));
    for (const {element, name, original} of attributes) element.setAttribute(name, t(original));
    toggle.querySelector('span').textContent = language === 'zh' ? 'EN' : '中文';
    toggle.setAttribute('aria-label', language === 'zh' ? 'Switch to English' : '切换至中文');
    toggle.setAttribute('lang', language === 'zh' ? 'en' : 'zh-CN');
    for (const subscriber of subscribers) subscriber(language);
  }
  function setLanguage(next) {
    if (!['en', 'zh'].includes(next) || next === language) return;
    language = next;
    const url = new URL(location.href);
    if (next === 'zh') url.searchParams.set('lang', 'zh'); else url.searchParams.delete('lang');
    // file: previews keep language state in memory; HTTP also updates the URL.
    if (location.protocol !== 'file:') history.replaceState(null, '', url);
    render();
    if (window.VeluneMotion?.enabled && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelector('main').animate([{opacity: .65}, {opacity: 1}], {duration: 240, easing: 'ease-out'});
    }
  }
  window.VeluneI18n = { t, get language() { return language; }, setLanguage, subscribe(fn) { subscribers.add(fn); }, translations };
  toggle.addEventListener('click', () => setLanguage(language === 'en' ? 'zh' : 'en'));
  render();
})();
