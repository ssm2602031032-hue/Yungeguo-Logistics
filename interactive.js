(() => {
  'use strict';
  const en = document.documentElement.lang.startsWith('en');
  const strings = en ? {
    required: 'Please complete this field.', email: 'Enter a valid email address.', phone: 'Enter a valid phone number (6–20 digits).', contact: 'Provide a phone number or an email address.', positive: 'Enter a positive number.', integer: 'Enter a whole number of at least 1.', consent: 'Please read and accept the privacy notice.', date: 'Choose today or a future date.', invalid: 'Please check the highlighted fields.', saving: 'Saving on this device…', saved: 'Saved in this browser only. This inquiry has not been sent to the company.', storage: 'The browser could not save this record. Please allow local storage or contact us by phone or email. Your entries have been kept.', send: 'Send inquiry', sending: 'Sending…', sent: 'Your inquiry has been received.', failed: 'Unable to send. Please try again or contact us by phone or email. Your entries have been kept.', timeout: 'The request timed out. Please try again. Your entries have been kept.', cleared: 'Local inquiry records have been cleared from this browser.', clearFailed: 'The browser could not clear local records.', save: 'Save local inquiry', quote: 'Shipment consultation', count: n => `${n} article${n === 1 ? '' : 's'} found`, remoteNotice: 'Your inquiry will be sent to the company for a shipment assessment.', remoteConsent: 'I have read the privacy notice and consent to the processing of this inquiry.'
  } : {
    required: '请填写此项。', email: '请输入有效的电子邮箱。', phone: '请输入有效的电话号码（6–20 位数字）。', contact: '联系电话和电子邮箱至少填写一项。', positive: '请输入大于 0 的数字。', integer: '请输入大于或等于 1 的整数。', consent: '请先阅读并同意隐私说明。', date: '请选择今天或之后的日期。', invalid: '请检查下方标注的项目。', saving: '正在保存到本机…', saved: '已保存在当前浏览器，未发送给企业。您可以下载此次记录用于核对。', storage: '浏览器无法保存记录。请允许本地存储，或使用电话 / 邮箱联系。填写内容已保留。', send: '提交询盘', sending: '正在提交…', sent: '询盘已收到。', failed: '提交未成功，请重试或使用电话 / 邮箱联系。填写内容已保留。', timeout: '提交超时，请重试。填写内容已保留。', cleared: '已清除当前浏览器保存的本地询盘记录。', clearFailed: '浏览器无法清除本地记录。', save: '保存本地询盘', quote: '运输方案咨询', count: n => `找到 ${n} 篇文章`, remoteNotice: '询盘将发送给企业，用于评估运输方案。', remoteConsent: '我已阅读隐私说明，同意处理此次询盘。'
  };
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
  const config = window.YGG_CONFIG || {};
  const remote = config.submissionMode === 'remote' && typeof config.endpoint === 'string' && config.endpoint.length > 0;
  const storeKey = 'ygg.preview.inquiries.v1';
  const activeForms = new Map();
  document.documentElement.classList.add('js');

  const nav = $('#site-nav');
  const menuToggle = $('[data-menu-toggle]');
  const mobileQuery = matchMedia('(max-width: 1099px)');
  const mobile = {get matches(){return mobileQuery.matches || document.documentElement.classList.contains('large-text');},addEventListener:(...args)=>mobileQuery.addEventListener(...args)};
  const disclosures = [];
  function closeDisclosures(except = null) {
    disclosures.forEach(item => {
      if (item !== except) { item.button.setAttribute('aria-expanded', 'false'); item.menu.hidden = true; }
    });
  }
  function setNav(open, focus = false) {
    if (!nav || !menuToggle) return;
    const isOpen = mobile.matches && open;
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    nav.hidden = mobile.matches && !isOpen;
    nav.inert = mobile.matches && !isOpen;
    document.body.classList.toggle('nav-open', isOpen);
    if (!isOpen) closeDisclosures();
    if (isOpen && focus) $('a,button', nav)?.focus();
  }
  menuToggle?.addEventListener('click', () => setNav(menuToggle.getAttribute('aria-expanded') !== 'true'));
  mobile.addEventListener('change', () => setNav(false));
  setNav(false);
  const adaptToTextSize = () => {
    const enlarged = parseFloat(getComputedStyle(document.documentElement).fontSize) > 21;
    if(enlarged !== document.documentElement.classList.contains('large-text')) {
      document.documentElement.classList.toggle('large-text', enlarged); setNav(false);
    }
  };
  adaptToTextSize();
  if('ResizeObserver' in window) new ResizeObserver(adaptToTextSize).observe(document.documentElement);
  $$('[data-route-toggle], [data-language-toggle]').forEach(button => {
    const menu = document.getElementById(button.getAttribute('aria-controls'));
    if (!menu) return;
    const item = { button, menu };
    disclosures.push(item);
    menu.hidden = true;
    button.setAttribute('aria-expanded', 'false');
    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') !== 'true';
      closeDisclosures(item);
      button.setAttribute('aria-expanded', String(open));
      menu.hidden = !open;
    });
  });
  document.addEventListener('click', event => {
    disclosures.forEach(item => {
      if (!item.button.contains(event.target) && !item.menu.contains(event.target)) {
        item.button.setAttribute('aria-expanded', 'false'); item.menu.hidden = true;
      }
    });
    if (mobile.matches && nav && !nav.contains(event.target) && !menuToggle?.contains(event.target)) setNav(false);
  });
  nav?.addEventListener('click', event => { if (event.target.closest('a')) setNav(false); });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    const open = disclosures.find(item => item.button.getAttribute('aria-expanded') === 'true');
    if (open) { closeDisclosures(); open.button.focus(); return; }
    if (mobile.matches && menuToggle?.getAttribute('aria-expanded') === 'true') { setNav(false); menuToggle.focus(); }
  });

  function showStatus(form, message, state) {
    const status = $('[data-form-status]', form);
    if (status) { status.textContent = message; status.dataset.state = state; }
    form.dataset.state = state;
    form.setAttribute('aria-busy', String(state === 'submitting'));
  }
  function setFieldError(form, name, message) {
    const field = form.elements.namedItem(name);
    if (field?.setAttribute) field.setAttribute('aria-invalid', message ? 'true' : 'false');
    const error = $(`[data-error-for="${name}"]`, form);
    if (error) error.textContent = message;
  }
  function validate(form) {
    $$('[data-error-for]', form).forEach(error => setFieldError(form, error.dataset.errorFor, ''));
    const invalid = [];
    const error = (name, message) => { setFieldError(form, name, message); if (!invalid.includes(name)) invalid.push(name); };
    const value = name => String(form.elements.namedItem(name)?.value || '').trim();
    ['model','origin','destination','quantity','name'].forEach(name => { if (!value(name)) error(name, strings.required); });
    if (value('quantity') && (!Number.isInteger(Number(value('quantity'))) || Number(value('quantity')) < 1 || Number(value('quantity')) > 1000000)) error('quantity', strings.integer);
    if (value('weight') && (!Number.isFinite(Number(value('weight'))) || Number(value('weight')) <= 0 || Number(value('weight')) > 10000000)) error('weight', strings.positive);
    if (!value('phone') && !value('email')) error('phone', strings.contact);
    if (value('phone') && (!/^[+\d\s().-]+$/.test(value('phone')) || value('phone').replace(/\D/g, '').length < 6 || value('phone').replace(/\D/g, '').length > 20)) error('phone', strings.phone);
    if (value('email') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value('email'))) error('email', strings.email);
    const today = new Date();
    const localDate = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
    if (value('date') && value('date') < localDate) error('date', strings.date);
    if (!form.elements.namedItem('consent')?.checked) error('consent', strings.consent);
    if (invalid.length) { showStatus(form, strings.invalid, 'error'); form.elements.namedItem(invalid[0])?.focus(); return false; }
    return true;
  }
  function updateBattery(form) {
    const section = $('[data-battery-fields]', form);
    if (!section) return;
    const visible = form.elements.namedItem('battery')?.value === 'yes' || form.elements.namedItem('type')?.value === 'battery';
    section.hidden = !visible; section.disabled = !visible;
  }
  function resetForm(form, clear = true) {
    const state = activeForms.get(form);
    if (!state) return;
    state.controller?.abort(); state.generation += 1; state.controller = null; state.record = null;
    if (clear) form.reset();
    const submit = $('[data-submit]', form);
    if (submit) { submit.disabled = false; submit.textContent = remote ? strings.send : strings.save; }
    const download = $('[data-download-record]', form); if (download) download.hidden = true;
    $$('[data-error-for]', form).forEach(error => setFieldError(form, error.dataset.errorFor, ''));
    showStatus(form, '', 'idle'); updateBattery(form);
  }
  $$('[data-inquiry-form]').forEach(form => {
    const state = { generation: 0, controller: null, record: null };
    activeForms.set(form, state);
    if (remote) {
      const notice = $('[data-preview-notice]', form); if (notice) notice.textContent = strings.remoteNotice;
      const span = $('.consent-label span', form);
      if (span) { const link = $('a', span)?.cloneNode(true); span.textContent = strings.remoteConsent + ' '; if (link) span.append(link); }
      $('[data-clear-records]', form)?.setAttribute('hidden', '');
    }
    resetForm(form);
    form.addEventListener('change', event => {
      if (['battery', 'type'].includes(event.target.name)) updateBattery(form);
      if (event.target.name) setFieldError(form, event.target.name, '');
    });
    form.addEventListener('input', event => { if (event.target.name) setFieldError(form, event.target.name, ''); });
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (form.dataset.state === 'submitting' || !validate(form)) return;
      const submit = $('[data-submit]', form);
      const generation = ++state.generation;
      const record = { ...Object.fromEntries(new FormData(form).entries()), createdAt: new Date().toISOString(), page: location.pathname, language: en ? 'en' : 'zh', delivery: remote ? 'remote' : 'local-only' };
      submit.disabled = true; submit.textContent = remote ? strings.sending : strings.saving;
      showStatus(form, remote ? strings.sending : strings.saving, 'submitting');
      let timer;
      try {
        if (remote) {
          state.controller?.abort(); state.controller = new AbortController();
          timer = setTimeout(() => state.controller?.abort(), 15000);
          const response = await fetch(config.endpoint, {method:'POST', headers:{'Content-Type':'application/json', 'Accept':'application/json'}, body:JSON.stringify(record), signal:state.controller.signal, credentials:'same-origin'});
          const result = await response.json();
          if (!response.ok || result.success !== true) throw new Error('business-failure');
        } else {
          const existing = JSON.parse(localStorage.getItem(storeKey) || '[]');
          localStorage.setItem(storeKey, JSON.stringify([record, ...(Array.isArray(existing) ? existing : [])].slice(0, 20)));
        }
        if (generation !== state.generation) return;
        state.record = record;
        showStatus(form, remote ? strings.sent : strings.saved, 'success');
        $('[data-download-record]', form).hidden = false;
        $('[data-form-status]', form)?.focus();
      } catch (error) {
        if (generation !== state.generation) return;
        showStatus(form, remote ? (error.name === 'AbortError' ? strings.timeout : strings.failed) : strings.storage, 'error');
      } finally {
        clearTimeout(timer);
        if (generation === state.generation) { submit.disabled = false; submit.textContent = remote ? strings.send : strings.save; form.setAttribute('aria-busy', 'false'); state.controller = null; }
      }
    });
    $('[data-download-record]', form)?.addEventListener('click', () => {
      if (!state.record) return;
      const blob = new Blob([JSON.stringify(state.record, null, 2)], {type:'application/json;charset=utf-8'});
      const url = URL.createObjectURL(blob); const anchor = document.createElement('a');
      anchor.href = url; anchor.download = `ygg-inquiry-${state.record.createdAt.slice(0,10)}.json`; anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
    $('[data-clear-records]', form)?.addEventListener('click', () => {
      try { localStorage.removeItem(storeKey); activeForms.forEach((s, f) => {s.record = null; const button = $('[data-download-record]', f); if (button) button.hidden = true;}); showStatus(form, strings.cleared, 'idle'); }
      catch { showStatus(form, strings.clearFailed, 'error'); }
    });
  });

  const dialog = $('#quote-dialog');
  let dialogTrigger = null;
  let downOnBackdrop = false;
  const outsideDialog = event => {
    if (event.target !== dialog) return false;
    const bounds = dialog.getBoundingClientRect();
    return event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
  };
  document.addEventListener('click', event => {
    const trigger = event.target.closest('[data-open-quote]');
    if (!trigger || !dialog) return;
    event.preventDefault(); dialogTrigger = trigger; setNav(false);
    const form = $('[data-inquiry-form]', dialog);
    if (form) {
      resetForm(form);
      const route = trigger.dataset.route || document.body.dataset.route || 'other';
      const topic = trigger.dataset.topic || '';
      if ([...form.elements.route.options].some(option => option.value === route)) form.elements.route.value = route;
      form.elements.topic.value = topic;
      const heading = $('#quote-dialog-title'); if (heading) heading.textContent = topic || strings.quote;
    }
    dialog.showModal();
  });
  $('[data-close-dialog]', dialog || document)?.addEventListener('click', () => dialog?.close());
  dialog?.addEventListener('pointerdown', event => { downOnBackdrop = outsideDialog(event); });
  dialog?.addEventListener('pointerup', event => { if (downOnBackdrop && outsideDialog(event)) dialog.close(); downOnBackdrop = false; });
  dialog?.addEventListener('close', () => {
    const form = $('[data-inquiry-form]', dialog); if (form) resetForm(form, false);
    dialogTrigger?.focus(); dialogTrigger = null;
  });

  $$('[data-news-list]').forEach(list => {
    const root = list.closest('[data-news-root]') || document;
    const search = $('[data-news-search]', root);
    const category = $('[data-news-category]', root);
    const tagButtons = $$('[data-news-tag]', root);
    let tag = '';
    const items = $$('[data-news-item]', list);
    function filter() {
      const term = (search?.value || '').trim().toLocaleLowerCase();
      const type = category?.value || 'all'; let visible = 0;
      items.forEach(item => {
        const match = (!term || item.textContent.toLocaleLowerCase().includes(term)) && (type === 'all' || !type || item.dataset.category === type) && (!tag || (item.dataset.tags || '').split(',').map(x=>x.trim()).includes(tag));
        item.hidden = !match; if (match) visible += 1;
      });
      const empty = $('[data-news-empty]', root); if (empty) empty.hidden = visible !== 0;
      const count = $('[data-news-count]', root); if (count) count.textContent = strings.count(visible);
    }
    search?.addEventListener('input', filter); category?.addEventListener('change', filter);
    tagButtons.forEach(button => button.addEventListener('click', () => {
      tag = tag === button.dataset.newsTag ? '' : button.dataset.newsTag;
      tagButtons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.newsTag === tag))); filter();
    }));
    $$('[data-news-reset]', root).forEach(button => button.addEventListener('click', () => {
      if (search) search.value = ''; if (category) category.value = 'all'; tag = '';
      tagButtons.forEach(b => b.setAttribute('aria-pressed', 'false')); filter(); search?.focus();
    }));
    filter();
  });
  $$('[data-timeline-direction]').forEach(button => button.addEventListener('click', () => {
    const track = document.getElementById(button.getAttribute('aria-controls'));
    track?.scrollBy({left:(button.dataset.timelineDirection === 'previous' ? -1 : 1) * Math.max(track.clientWidth * 0.8, 200), behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
  }));
  const reveal = $$('[data-reveal],.network-map');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {entry.target.classList.add('is-visible'); observer.unobserve(entry.target);}
    }), {threshold:0.06});
    reveal.forEach(el => observer.observe(el));
  } else reveal.forEach(el => el.classList.add('is-visible'));
  $('[data-back-top]')?.addEventListener('click', () => window.scrollTo({top:0, behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}));
})();
