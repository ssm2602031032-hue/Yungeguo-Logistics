const copy = {
  zh: {
    intro: '填写货物与目的地信息，评估运输方案。带 * 的项目为必填。',
    preview: '本地预览：资料只会保存在当前浏览器，不会发送给企业。您可以下载记录用于核对。',
    type: '货物类型', typeOptions: [['complete', '整机'], ['battery', '电池'], ['parts', '配件'], ['other', '其他']],
    model: '产品型号', battery: '是否含电池', batteryOptions: [['unknown', '待确认'], ['yes', '含电池'], ['no', '不含电池']],
    batteryInfo: '电池信息', batteryHelp: '如已知，请填写电池类型、额定能量（Wh）、数量及是否装在设备内。运输可行性需结合资料评估。',
    batteryDetails: '电池规格与包装方式', route: '意向航线', routeOptions: [['other', '其他 / 待评估'], ['us', '中美专线'], ['europe', '中欧专线'], ['korea', '中韩专线']],
    origin: '起运城市', destination: '目的地国家 / 城市', quantity: '件数', weight: '总重量（kg）', dimensions: '单件尺寸（长 × 宽 × 高，cm）', date: '计划发货日期',
    name: '联系人', phone: '联系电话', email: '电子邮箱', company: '公司名称（选填）', notes: '补充说明（选填）', contactHelp: '联系电话和电子邮箱至少填写一项。',
    consent: '我已阅读', privacy: '隐私说明', consentEnd: '，同意在本机保存此次询盘内容供预览核对。', submit: '保存本地询盘', download: '下载此次记录', clear: '清除本机询盘记录',
    heading: '运输方案咨询', close: '关闭咨询窗口', nojs: '请启用 JavaScript 使用本地询盘表单，或直接使用页面中的电话 / 邮箱联系。'
  },
  en: {
    intro: 'Share the cargo and destination details to assess a shipment plan. Fields marked * are required.',
    preview: 'Local preview: information is saved in this browser only and is not sent to the company. You can download a copy for review.',
    type: 'Cargo type', typeOptions: [['complete', 'Complete aircraft'], ['battery', 'Batteries'], ['parts', 'Parts'], ['other', 'Other']],
    model: 'Product model', battery: 'Batteries included', batteryOptions: [['unknown', 'To be confirmed'], ['yes', 'Yes'], ['no', 'No']],
    batteryInfo: 'Battery details', batteryHelp: 'If available, include battery type, watt-hour rating, quantity and whether installed in equipment. Acceptance depends on a document review.',
    batteryDetails: 'Battery specifications and packaging', route: 'Preferred route', routeOptions: [['other', 'Other / To be assessed'], ['us', 'China–US'], ['europe', 'China–Europe'], ['korea', 'China–Korea']],
    origin: 'Origin city', destination: 'Destination country / city', quantity: 'Number of packages', weight: 'Total weight (kg)', dimensions: 'Package dimensions (L × W × H, cm)', date: 'Planned shipping date',
    name: 'Contact name', phone: 'Phone number', email: 'Email address', company: 'Company (optional)', notes: 'Additional information (optional)', contactHelp: 'Provide at least a phone number or an email address.',
    consent: 'I have read the', privacy: 'privacy notice', consentEnd: ' and agree to save this inquiry on this device for preview and review.', submit: 'Save local inquiry', download: 'Download this record', clear: 'Clear local inquiry records',
    heading: 'Shipment consultation', close: 'Close consultation', nojs: 'Enable JavaScript to use the local inquiry form, or contact us using the phone or email listed on this page.'
  }
};
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function form({ lang = 'zh', id = 'quote', route = 'other', topic = '' } = {}) {
  const c = copy[lang] || copy.zh;
  const field = (name, label, attrs = '', required = false, full = false) => `<div class="form-field${full ? ' form-field--wide' : ''}"><label for="${id}-${name}">${label}${required ? ' <span aria-hidden="true">*</span>' : ''}</label><input id="${id}-${name}" name="${name}" ${attrs} ${required ? 'required' : ''} aria-describedby="${id}-${name}-error"><span class="field-error" id="${id}-${name}-error" data-error-for="${name}"></span></div>`;
  const select = (name, label, options, value, required = false) => `<div class="form-field"><label for="${id}-${name}">${label}${required ? ' <span aria-hidden="true">*</span>' : ''}</label><select id="${id}-${name}" name="${name}" ${required ? 'required' : ''} aria-describedby="${id}-${name}-error">${options.map(([v,t]) => `<option value="${v}"${v === value ? ' selected' : ''}>${t}</option>`).join('')}</select><span class="field-error" id="${id}-${name}-error" data-error-for="${name}"></span></div>`;
  return `<form class="inquiry-form" data-inquiry-form data-lang="${lang}" novalidate>
    <p class="form-intro">${c.intro}</p><p class="form-notice" data-preview-notice>${c.preview}</p>
    <input type="hidden" name="topic" value="${escape(topic)}">
    <div class="form-grid">
    ${select('type', c.type, c.typeOptions, 'complete', true)}
    ${field('model', c.model, 'autocomplete="off" maxlength="120"', true)}
    ${select('battery', c.battery, c.batteryOptions, 'unknown', true)}
    ${select('route', c.route, c.routeOptions, route)}
    <fieldset class="form-field--wide battery-fields" data-battery-fields hidden disabled><legend>${c.batteryInfo}</legend><p class="field-help">${c.batteryHelp}</p><label for="${id}-batteryDetails">${c.batteryDetails}</label><textarea id="${id}-batteryDetails" name="batteryDetails" maxlength="800" rows="2"></textarea></fieldset>
    ${field('origin', c.origin, 'autocomplete="off" maxlength="120"', true)}
    ${field('destination', c.destination, 'autocomplete="off" maxlength="160"', true)}
    ${field('quantity', c.quantity, 'type="number" inputmode="numeric" min="1" step="1" max="1000000"', true)}
    ${field('weight', c.weight, 'type="number" inputmode="decimal" min="0.01" step="any" max="10000000"')}
    ${field('dimensions', c.dimensions, 'maxlength="100"')}
    ${field('date', c.date, 'type="date"')}
    ${field('name', c.name, 'autocomplete="name" maxlength="100"', true)}
    ${field('company', c.company, 'autocomplete="organization" maxlength="160"')}
    ${field('phone', c.phone, 'type="tel" autocomplete="tel" maxlength="40"')}
    ${field('email', c.email, 'type="email" autocomplete="email" maxlength="200"')}
    <p class="field-help form-field--wide">${c.contactHelp}</p>
    <div class="form-field form-field--wide"><label for="${id}-notes">${c.notes}</label><textarea id="${id}-notes" name="notes" rows="3" maxlength="2000"></textarea></div>
    <div class="form-field form-field--wide"><label class="consent-label" for="${id}-consent"><input id="${id}-consent" name="consent" type="checkbox" required aria-describedby="${id}-consent-error"><span>${c.consent} <a href="${lang === 'en' ? 'en-' : ''}privacy.html" target="_blank" rel="noopener">${c.privacy}</a>${c.consentEnd}</span></label><span class="field-error" id="${id}-consent-error" data-error-for="consent"></span></div>
    </div>
    <p class="form-status" data-form-status role="status" aria-live="polite" tabindex="-1"></p>
    <div class="form-actions"><button class="button button--primary" type="submit" data-submit disabled>${c.submit}</button><button class="button button--secondary" type="button" data-download-record hidden>${c.download}</button><button class="text-button" type="button" data-clear-records>${c.clear}</button></div>
    <noscript><p class="form-notice">${c.nojs}</p></noscript>
  </form>`;
}
function dialog({ lang = 'zh' } = {}) {
  const c = copy[lang] || copy.zh;
  return `<dialog class="quote-dialog" id="quote-dialog" aria-labelledby="quote-dialog-title" aria-describedby="quote-dialog-description"><div class="dialog-inner"><button class="dialog-close" type="button" data-close-dialog aria-label="${c.close}">×</button><h2 id="quote-dialog-title">${c.heading}</h2><p id="quote-dialog-description">${c.intro}</p>${form({lang, id:'dialog-quote'})}</div></dialog>`;
}
module.exports = { form, dialog };
