'use strict';

const landPath = require('../assets/vector/world-land.cjs');
const esc = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const safeId = value => String(value || 'visual').replace(/[^a-zA-Z0-9_-]/g, '-');

const paths = {
  'arrow-right':'M4 12h16m-6-6 6 6-6 6',
  'arrow-left':'M20 12H4m6-6-6 6 6 6',
  'arrow-up-right':'M6 18 18 6M6 6h12v12',
  'chevron-down':'m6 9 6 6 6-6',
  'chevron-right':'m9 6 6 6-6 6',
  'chevron-left':'m15 6-6 6 6 6',
  'chevron-up':'m6 15 6-6 6 6',
  menu:'M4 6h16M4 12h16M4 18h16',
  x:'m6 6 12 12M6 18 18 6',
  plus:'M12 5v14M5 12h14',
  minus:'M5 12h14',
  check:'m5 12 4 4L19 6',
  'check-circle':'M22 11.1V12a10 10 0 1 1-5.9-9.1M22 4 12 14l-3-3',
  shield:'M12 3 3.5 6.5v5.2c0 5.2 8.5 9.3 8.5 9.3s8.5-4.1 8.5-9.3V6.5L12 3zm-4 8 3 3 5-5',
  plane:'m22 2-7 20-4-9-9-4 20-7ZM11 13 22 2',
  airplane:'M22 12 14 9V4a2 2 0 0 0-4 0v5l-8 3v2l8-1v6l-3 2v1l5-1 5 1v-1l-3-2v-6l8 1v-2Z',
  ship:'M3 13 12 9l9 4-2 6H5l-2-6ZM6 11V6h12v5M10 6V3h4v3M2 21q2-2 4 0t4 0 4 0 4 0 4 0',
  train:'M7 3h10a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3ZM4 11h16M9 3v8m6-8v8M7 16h1m8 0h1M8 20l-2 2m10-2 2 2',
  truck:'M1 5h13v12H1V5Zm13 4h5l4 5v3h-9M5 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm14 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z',
  drone:'M9 9h6v6H9V9ZM9 9 5 5m10 4 4-4m-4 10 4 4M9 15l-4 4M6 4a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm16 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM6 20a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm16 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM11 12h2',
  battery:'M3 6h15v12H3a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Zm15 4h3v4h-3M7 10v4m-2-2h4m3 0h3',
  package:'m12 3 9 5v9l-9 5-9-5V8l9-5Zm0 10 9-5m-9 5L3 8m9 5v9M7.5 5.5l9 5',
  box:'M3 7h18v14H3V7Zm-1-5h20v5H2V2Zm7 9h6',
  globe:'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0ZM2 12h20M12 2a20 20 0 0 1 0 20 20 20 0 0 1 0-20Z',
  'map-pin':'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Zm-5 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
  phone:'M22 16.9V20a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 3.1 5.2 2 2 0 0 1 5.1 3H8l2 5-2 2a16 16 0 0 0 6 6l2-2 6 2.9Z',
  mail:'M3 4h18v16H3V4Zm0 2 9 7 9-7',
  clock:'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0ZM12 6v6l4 2',
  search:'M19 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-2 6 5 6',
  headphones:'M3 14v-3a9 9 0 0 1 18 0v3M3 12H1v7h5v-7H3Zm18 0h2v7h-5v-7h3Zm0 7v2h-7',
  download:'M12 3v12m-5-5 5 5 5-5M3 15v6h18v-6',
  document:'M14 2H4v20h16V8l-6-6Zm0 0v6h6M8 12h8m-8 4h8',
  clipboard:'M8 3H4v19h16V3h-4M8 1h8v5H8V1Zm0 10h8m-8 5h8',
  send:'m22 2-7 20-4-9-9-4 20-7ZM11 13 22 2',
  users:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.9M13 6a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm4-3.9a4 4 0 0 1 0 7.8',
  building:'M4 22V3h12v19M16 9h5v13M1 22h23M8 7h4m-4 4h4m-4 4h4m-4 7v-3h4v3',
  briefcase:'M8 6V3h8v3M2 6h20v15H2V6Zm0 6q10 6 20 0M10 12h4v4h-4v-4Z',
  calendar:'M3 5h18v17H3V5Zm4-3v6m10-6v6M3 11h18M7 15h2m3 0h2m3 0h1m-11 4h2m3 0h2',
  bolt:'m13 2-9 12h7l-1 8 10-13h-8l1-7Z',
  wind:'M2 8h13a3 3 0 1 0-3-3M2 12h17a3 3 0 1 1-3 3M2 16h6a3 3 0 1 1-3 3',
  route:'M6 7a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm12 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM9 4h7a4 4 0 0 1 0 8H8a4 4 0 0 0 0 8h7',
  settings:'M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8ZM9 2h6l1 4 4 1 2 5-3 3 1 4-5 3-3-3-4 1-4-4 1-4-3-3 2-5 4-1 1-4Z',
  leaf:'M20 3C7 1 1 7 4 15c3 8 17 7 16-12ZM4 21 15 10',
  weight:'M3 21 6 7h12l3 14H3ZM15 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
  lock:'M5 10h14v12H5V10Zm3 0V6a4 4 0 0 1 8 0v4m-4 5v3',
  'external-link':'M14 3h7v7M10 14 21 3M10 3H3v18h18v-7',
  info:'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0ZM12 11v6m0-10v.1',
  star:'M12 3 14.9 8.9 21.5 9.9 16.7 14.6 17.8 21.2 12 18.1 6.2 21.2 7.3 14.6 2.5 9.9 9.1 8.9 12 3Z',
  refresh:'M20 7a9 9 0 1 0 1 8M20 2v6h-6',
  eye:'M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12Zm14 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
  link:'m10 13 4-4m-6 6-2 2a4 4 0 0 1-6-6l5-5a4 4 0 0 1 6 0m2 3 2-2a4 4 0 0 1 6 6l-5 5a4 4 0 0 1-6 0',
  layers:'m12 2 10 6-10 6L2 8l10-6Zm-10 11 10 6 10-6M2 18l10 6 10-6',
  warehouse:'m2 9 10-6 10 6v13H2V9Zm4 13V12h12v10M6 16h12m-12 3h12',
  camera:'M3 6h5l2-3h4l2 3h5v15H3V6Zm13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
  compass:'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Zm-6-4-3 5-5 3 3-5 5-3Z'
};
const aliases = {'file-text':'document','file-check':'document','shield-check':'shield','check-circle-2':'check-circle', 'circle-check':'check-circle','map':'globe','map-pinned':'map-pin','pin':'map-pin', 'navigation':'route','navigation-2':'route','plane-takeoff':'airplane','plane-landing':'airplane','air':'airplane','sea':'ship','rail':'train','file':'document','battery-charging':'battery','package-check':'package','boxes':'package','building-2':'building','headset':'headphones','message-circle':'mail','message-square':'mail','circle-help':'info','help-circle':'info','arrow-up':'arrow-up-right','timer':'clock','zap':'bolt','sprout':'leaf','clipboard-check':'clipboard','tool':'settings','wrench':'settings','ruler':'weight','refresh-cw':'refresh','target':'compass','award':'shield','handshake':'users','heart-handshake':'users','book-open':'document','sparkles':'star','checkCheck':'check','checkCircle':'check-circle','arrowRight':'arrow-right','mapPin':'map-pin'};

function icon(name) {
  const extra={'train-front':'train','file-check-2':'document','scan-line':'eye','radio':'compass','arrow-up':'chevron-up','plane':'airplane'};
  const d = paths[extra[name] || aliases[name] || name] || paths.package;
  return `<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="${d}"/></svg>`;
}

const location = (lon, lat) => ({x:(lon+180)*1000/360, y:55+(80-lat)*2.6});
const locations = {origin:location(114.06,22.54), us:location(-118.24,34.05), europe:location(8.68,50.11), korea:location(126.98,37.57)};
function map(id, region='world', lang='zh') {
  const uid=safeId(id), en=lang==='en', prefix=en?'en-':'', isEurope=['eu','europe','china-europe'].includes(region), isUS=['us','china-us'].includes(region), isKorea=['kr','korea','china-korea'].includes(region);
  const active=isEurope?'europe':isUS?'us':isKorea?'korea':'world';
  const labels=en?{origin:'China · Shenzhen',us:'United States',europe:'Europe',korea:'South Korea'}:{origin:'中国 · 深圳',us:'美国',europe:'欧洲',korea:'韩国'};
  const metadata=[{key:'us',page:'china-us',sub:en?'China–US freight':'中美专线',curve:'M816.8 204.4 C700 36 373 29 171.6 174.5',color:'#0b5bd3',tx:165,ty:207,lw:en?138:102},{key:'europe',page:'china-europe',sub:en?'China–Europe freight':'中欧专线',curve:'M816.8 204.4 C718 65 607 53 524.1 132.7',color:'#f08a28',tx:496,ty:87,lw:en?120:88},{key:'korea',page:'china-korea',sub:en?'China–Korea freight':'中韩专线',curve:'M816.8 204.4 C812 171 829 147 852.7 165.3',color:'#15978c',tx:870,ty:143,lw:en?116:80}];
  const nav=metadata.map(m=>`<a class="network-link${active===m.key?' is-active':''}" href="${prefix}${m.page}.html"><span class="network-key" style="--route-color:${m.color}"></span><span>${m.sub}</span>${icon('arrow-up-right')}</a>`).join('');
  const routes=metadata.map((m,i)=>{
    const p=locations[m.key], muted=active!=='world'&&active!==m.key;
    return `<g class="network-route${muted?' is-muted':''}" style="--route-color:${m.color}"><path class="network-route-halo" d="${m.curve}"/><path id="${uid}-${m.key}" class="network-route-line" d="${m.curve}"/><path class="network-route-trail" d="${m.curve}" style="animation-delay:-${i*1.6}s"/><circle class="network-route-marker" r="3.5"><animateMotion dur="${7+i}s" repeatCount="indefinite" begin="-${i*2}s" path="${m.curve}"/></circle><circle class="network-point-ring" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="11"/><circle class="network-point" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="4.5"/><a href="${prefix}${m.page}.html" aria-label="${esc(m.sub)}"><rect class="network-label-hit" x="${m.tx-8}" y="${m.ty-21}" width="${m.lw}" height="33" rx="6"/><text class="network-label" x="${m.tx}" y="${m.ty}">${labels[m.key]}</text></a></g>`;
  }).join('');
  let graticule='';
  for(let lon=-120;lon<=120;lon+=60){const x=location(lon,0).x;graticule+=`<path d="M${x} 42V408"/>`;}
  for(let lat=-30;lat<=60;lat+=30){const y=location(0,lat).y;graticule+=`<path d="M32 ${y}H968"/>`;}
  const origin=locations.origin;
  return `<div class="network-map" data-network-region="${active}"><div class="network-mobile-summary">${en?'From Shenzhen, China · International freight':'中国深圳出发 · 连接全球目的地'}</div><div class="network-canvas"><svg class="network-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 450" role="img" aria-labelledby="${uid}-title ${uid}-desc"><title id="${uid}-title">${en?'International freight route network':'国际货运航线网络'}</title><desc id="${uid}-desc">${en?'Illustrated connections from Shenzhen, China to the United States, Europe and South Korea. Choose a route below to view its services.':'从中国深圳连接美国、欧洲和韩国的国际货运航线示意。可通过地图下方的航线链接查看服务内容。'}</desc><defs><linearGradient id="${uid}-ocean" x2="0" y2="1"><stop stop-color="#f5f9fe"/><stop offset="1" stop-color="#eaf2fc"/></linearGradient><linearGradient id="${uid}-land" x2="0" y2="1"><stop stop-color="#ffffff"/><stop offset="1" stop-color="#dce8f5"/></linearGradient><filter id="${uid}-shadow" x="-5%" y="-5%" width="110%" height="115%"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#5d7fa6" flood-opacity=".14"/></filter></defs><rect width="1000" height="450" rx="18" fill="url(#${uid}-ocean)"/><g class="network-graticule">${graticule}</g><path class="network-land" d="${landPath}" fill="url(#${uid}-land)" filter="url(#${uid}-shadow)"/>${routes}<g class="network-origin"><circle class="network-origin-pulse" cx="${origin.x.toFixed(1)}" cy="${origin.y.toFixed(1)}" r="13"/><circle cx="${origin.x.toFixed(1)}" cy="${origin.y.toFixed(1)}" r="7" fill="#0b2f5b" stroke="#fff" stroke-width="3"/><rect x="710" y="224" width="${en?167:129}" height="34" rx="7" fill="#0b2f5b"/><text x="722" y="246" fill="white" font-size="16" font-weight="650">${labels.origin}</text></g><text x="30" y="427" class="network-note">${en?'Route illustration · Actual routing depends on shipment details':'航线示意 · 具体运输路径以实际方案为准'}</text></svg></div><div class="network-links" aria-label="${en?'Explore freight routes':'选择航线'}">${nav}</div></div>`;
}

const propeller=(x,y,angle=0,size=1)=>`<g transform="translate(${x} ${y}) rotate(${angle}) scale(${size})"><ellipse cy="1" rx="69" ry="8" fill="#b9cfdf" opacity=".23"/><path d="M-4-1C-24-17-59-14-68-5c16 9 48 15 68 8C25 21 56 16 68 7 45-7 21-12 4-2Z" fill="#172e45"/><ellipse rx="10" ry="6" fill="#334f64"/><ellipse cy="-2" rx="5" ry="3" fill="#8ba8bb"/></g>`;
const quad=(id,fpv=false)=>`<g transform="translate(357 233) rotate(-8)"><ellipse cy="89" rx="194" ry="28" fill="#1d4767" opacity=".12"/><path d="M-40-22-157-66l-15 16 122 69M38-21l114-45 14 16L48 22M-41 13-157 83l13 17 112-52M40 17l111 63-12 21L28 49" fill="url(#${id}-metal)" stroke="#526b7e" stroke-width="3"/><path d="m-154-67 7 27m306-26-8 24m-4 118-7 26m-282-25 6 23" fill="none" stroke="#233c50" stroke-width="10" stroke-linecap="round"/>${propeller(-158,-68,-12,.9)}${propeller(156,-67,17,.9)}${propeller(-151,83,-20,.94)}${propeller(150,83,12,.94)}<path d="M-43-47q45-24 85 0l16 86q-10 25-60 26-45-3-55-26Z" fill="url(#${id}-body)" stroke="#7690a3" stroke-width="2"/><path d="M-30-38q30-13 57 0l7 58h-71Z" fill="${fpv?'#223d52':'#dce7eb'}"/><path d="M-21-25h40m-38 8h37m-35 8h33" stroke="${fpv?'#496778':'#b3c7d0'}" stroke-width="4" stroke-linecap="round"/><path d="M-38 53v24m74-24v24" stroke="#334e63" stroke-width="6"/><rect x="-25" y="43" width="48" height="32" rx="10" fill="#34536a"/><circle cx="0" cy="58" r="15" fill="#0c263d" stroke="#7598b2" stroke-width="3"/><circle cx="0" cy="58" r="9" fill="#245f81"/><circle cx="-3" cy="54" r="3.5" fill="#a6e2f7"/><path d="M-44 5v12m88-12v12" stroke="#42ccba" stroke-width="5" stroke-linecap="round"/>${fpv?'<path d="m14-44 13-34 11 2-5 35" stroke="#e18d3d" stroke-width="5"/><rect x="-27" y="-60" width="45" height="26" rx="5" fill="#0c263d"/><circle cx="-5" cy="-47" r="9" fill="#315e79" stroke="#708fa3" stroke-width="3"/>':''}</g>`;

function illustration(type='drone', id='illustration', lang='zh') {
  const uid=safeId(id), en=lang==='en';
  const labels={drone:en?'Export drone cargo':'无人机整机货物',fpv:en?'FPV drone cargo':'穿越机货物',agriculture:en?'Agricultural drone cargo':'农业无人机货物',battery:en?'Battery transport evaluation':'电池运输评估',parts:en?'Drone components':'无人机配件',packaging:en?'Protective export packaging':'出口防护包装',air:en?'Air freight':'国际空运',sea:en?'Ocean freight':'国际海运',rail:en?'Rail freight':'国际铁路运输',documents:en?'Export documents':'出口单证核对'};
  const aliases={hero:'drone',home:'drone',cargo:'drone',aircraft:'drone','drone-export':'drone',industrial:'drone',camera:'drone',agricultural:'agriculture',accessories:'parts',package:'packaging',clearance:'documents',customs:'documents',about:'packaging',services:'packaging',contact:'documents',news:'documents',europe:'rail',us:'air',korea:'sea',warehouse:'packaging'};type=aliases[type]||type;
  let body='';
  if(type==='drone'||type==='fpv')body=quad(uid,type==='fpv');
  else if(type==='agriculture')body=`<g transform="translate(355 219)"><ellipse cy="142" rx="175" ry="23" fill="#123b58" opacity=".1"/><path d="m-45-20-127-44m212 44 130-44m-211 74-121 74m205-74 123 74M-30-30-45-95m77 65 48-70" stroke="#233f52" stroke-width="16" stroke-linecap="round"/>${propeller(-173,-67,-15,.74)}${propeller(169,-67,13,.74)}${propeller(-163,85,-16,.74)}${propeller(165,85,13,.74)}${propeller(-79,-100,-7,.7)}${propeller(82,-100,8,.7)}<path d="M-62-28h121l-12 106q-45 27-94 0Z" fill="url(#${uid}-body)" stroke="#8da7b6" stroke-width="2"/><path d="M-50-34q48-25 99 0l10 24H-63Z" fill="#12655e"/><rect x="-21" y="-49" width="42" height="18" rx="5" fill="#123b50"/><path d="M-52 61-75 126h-30m154-65 25 65h31" stroke="#233f52" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M-30 15h60v35h-60Z" fill="#dbe8e9"/><path d="M-116 92h231" stroke="#16736c" stroke-width="6"/><path d="M-107 92v14m53-14v14m53-14v14m53-14v14m53-14v14" stroke="#223d51" stroke-width="5"/></g>`;
  else if(type==='battery')body=`<g transform="translate(207 101)"><ellipse cx="155" cy="239" rx="169" ry="27" fill="#1d4767" opacity=".11"/><path d="m15 43 171-31 100 68-176 40Z" fill="#40566c"/><path d="m15 43 95 77v150L15 190Z" fill="#243c52"/><path d="m110 120 176-40v150l-176 40Z" fill="url(#${uid}-dark)"/><path d="m33 52 76 59m-76-39 76 60m-76-40 76 60" stroke="#4a657b" stroke-width="6"/><path d="m147 144 102-24v66l-102 24Z" fill="#edf4f7"/><path d="m192 132-17 37 20-5-8 33 33-50-22 5 9-27Z" fill="#eea042"/><path d="M63 32V7q0-31 39-25h31m-25 6h37" fill="none" stroke="#20364a" stroke-width="12" stroke-linecap="round"/><path d="M139-15h33v25h-33Z" fill="#ed9941"/><path d="m140 225 100-22" stroke="#42776f" stroke-width="7"/><circle cx="244" cy="91" r="5" fill="#66dec4"/></g>`;
  else if(type==='parts')body=`<g transform="translate(183 107)"><ellipse cx="177" cy="238" rx="203" ry="30" fill="#1d4767" opacity=".1"/><g transform="translate(78 96)"><ellipse cy="47" rx="64" ry="21" fill="#19364c"/><path d="M-64 1v46q64 43 128 0V1" fill="url(#${uid}-dark)"/><ellipse rx="64" ry="24" fill="#627e90"/><ellipse rx="42" ry="17" fill="#bdccd2"/><ellipse rx="28" ry="12" fill="#374f65"/><path d="M0-3v-46" stroke="#e3edf0" stroke-width="15" stroke-linecap="round"/><path d="m-46 51-20 59m112-59 20 59" stroke="#dda341" stroke-width="5"/></g><g transform="translate(235 160) rotate(-20)"><path d="M-6-4q-100-66-137-20 47 34 137 28 92 52 134 20-49-44-127-29Z" fill="#2e4a60"/><ellipse rx="15" ry="11" fill="#557386"/><circle r="5" fill="#dce9ed"/></g><g transform="translate(209 2)"><rect width="97" height="63" rx="8" fill="#19394c"/><rect x="9" y="9" width="79" height="45" rx="4" fill="#2a736b"/><rect x="33" y="21" width="32" height="22" rx="3" fill="#163748"/><path d="M17 17h12m43 0h7M17 26h12m43 0h7m-62 9h12m43 0h7m-62 10h12m43 0h7" stroke="#dcb676" stroke-width="3"/></g><g transform="translate(288 90)"><rect width="72" height="58" rx="12" fill="#345366"/><circle cx="36" cy="29" r="24" fill="#112b40" stroke="#6f8fa1" stroke-width="4"/><circle cx="36" cy="29" r="16" fill="#226886"/><circle cx="29" cy="21" r="6" fill="#a9dfed"/></g></g>`;
  else if(type==='packaging')body=`<g transform="translate(166 117)"><ellipse cx="186" cy="246" rx="204" ry="29" fill="#1d4767" opacity=".1"/><path d="m20 64 158-63 186 59-157 76Z" fill="#6f543c"/><path d="m20 64 187 72v139L20 199Z" fill="#c8a477"/><path d="m207 136 157-76v139l-157 76Z" fill="#ad845c"/><path d="m20 64-52-48 159-61 51 46Zm158-63 53-43 184 61-51 41Z" fill="#d9b98c"/><path d="m20 64 187 72-38 48L-16 110Zm187 72 157-76 58 45-158 79Z" fill="#e4c699"/><path d="m48 62 130-45 143 44-121 59Z" fill="#304957"/><path d="m82 64 95-31 110 32-88 39Z" fill="#536d7b"/><g transform="translate(191 66) scale(.48 .35)"><path d="m-18-10-144-48m181 48 142-48m-179 68-143 51m177-51 143 51" stroke="#becdd4" stroke-width="22"/><ellipse rx="43" ry="58" fill="#d4e0e5"/>${propeller(-157,-59,-10,.7)}${propeller(158,-58,10,.7)}${propeller(-157,69,-10,.7)}${propeller(158,69,10,.7)}</g><path d="m56 149 100 38v59L56 208Z" fill="#f7f3e9"/><path d="m68 174 75 28m-75-14 55 21m-55-7 63 24" stroke="#577085" stroke-width="5"/><path d="m281 186 39-18v28l-39 18Z" fill="#dcc5a1"/></g>`;
  else if(type==='documents')body=`<g transform="translate(201 79)"><ellipse cx="163" cy="294" rx="179" ry="26" fill="#1d4767" opacity=".1"/><rect x="53" y="10" width="232" height="300" rx="17" transform="rotate(9 169 160)" fill="#bacddf"/><rect width="236" height="304" rx="16" fill="white" stroke="#bfd1e1" stroke-width="2"/><path d="M33 40h98M33 64h151" stroke="#0b5bd3" stroke-width="9" stroke-linecap="round"/><path d="M33 106h170m-170 23h148m-148 23h170m-170 23h155m-155 23h170m-170 23h99" stroke="#d4e1ec" stroke-width="8" stroke-linecap="round"/><rect x="33" y="251" width="81" height="23" rx="4" fill="#e7f1fa"/><circle cx="231" cy="230" r="66" fill="#e5f4f0" stroke="#b9dfd4" stroke-width="3"/><circle cx="231" cy="230" r="47" fill="#167869"/><path d="m208 230 15 16 31-34" fill="none" stroke="white" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></g>`;
  else if(type==='air')body=`<g><path d="M80 325q201-240 545-132" stroke="#bfd4e7" stroke-width="2" stroke-dasharray="8 8" fill="none"/><g transform="translate(355 244) rotate(-17)"><ellipse cy="78" rx="222" ry="23" fill="#1d4767" opacity=".07"/><path d="M-242 14 52 4 159-21q37-6 79 19 11 7 0 16-47 29-97 27l-319-2Z" fill="url(#${uid}-body)" stroke="#8da9bd" stroke-width="2"/><path d="m-103 13-101-87 44-1 151 83m-59 24-119 109 55 1L62 35" fill="#d7e4ee" stroke="#829fb5" stroke-width="2"/><path d="m-206 14-36-67 33-1 65 67" fill="#0b5bd3"/><path d="m-237 35-42 28 54 2 55-28" fill="#0b5bd3"/><path d="M151-3h40l18 10h-64Z" fill="#183c57"/><path d="M-136 19H91" stroke="#0b5bd3" stroke-width="4"/><path d="M-104 8h9m13 0h9m13 0h9m13 0h9m13 0h9m13 0h9m13 0h9m13 0h9m13 0h9" stroke="#486a85" stroke-width="5" stroke-linecap="round"/><path d="m-20 65 50-9 13 15-62 10Z" fill="#a8bdce" stroke="#708da4" stroke-width="2"/></g></g>`;
  else if(type==='sea')body=`<g transform="translate(102 76)"><path d="M-26 307q36-20 73 0t73 0 73 0 73 0 73 0 73 0 73 0" fill="none" stroke="#c5ddeb" stroke-width="15"/><path d="m-9 225 443-6-40 91H58Z" fill="#163c59"/><path d="m8 249 411-5-12 27H26Z" fill="#0b5bd3"/><rect x="319" y="123" width="91" height="98" rx="3" fill="#e7eff4"/><rect x="332" y="146" width="63" height="19" fill="#7598b2"/><path d="M365 122V62m-27 33h52M351 69h27" stroke="#67859b" stroke-width="5"/><rect x="8" y="141" width="96" height="78" fill="#da9350"/><rect x="109" y="141" width="97" height="78" fill="#28798b"/><rect x="211" y="141" width="100" height="78" fill="#91adc2"/><rect x="60" y="62" width="98" height="74" fill="#75a7b0"/><rect x="163" y="62" width="98" height="74" fill="#d8a46d"/><path d="M24 150v60m17-60v60m17-60v60m17-60v60m17-60v60m34-60v60m17-60v60m17-60v60m17-60v60m17-60v60m34-60v60m17-60v60m17-60v60m17-60v60m17-60v60M75 72v55m17-55v55m17-55v55m17-55v55m17-55v55m36-55v55m17-55v55m17-55v55m17-55v55m17-55v55" stroke="#ffffff" stroke-opacity=".22" stroke-width="3"/><path d="M-45 326q42-18 84 0t84 0 84 0 84 0 84 0 84 0" fill="none" stroke="#82b9d2" stroke-width="7"/></g>`;
  else if(type==='rail')body=`<g transform="translate(86 115)"><path d="M-19 241h582M-19 263h582m-565-27-7 34m38-34-7 34m38-34-7 34m38-34-7 34m38-34-7 34m38-34-7 34m38-34-7 34m38-34-7 34m38-34-7 34m38-34-7 34m38-34-7 34m38-34-7 34m38-34-7 34m38-34-7 34m38-34-7 34m38-34-7 34m38-34-7 34m38-34-7 34" stroke="#95afc3" stroke-width="5"/><path d="M-1 79h130v133H-1Zm138 0h130v133H137Z" fill="#80a8bc"/><path d="M15 89v108m18-108v108m18-108v108m18-108v108m18-108v108m18-108v108m48-108v108m18-108v108m18-108v108m18-108v108m18-108v108m18-108v108" stroke="#d3e1e9" stroke-width="3"/><path d="M283 51h152l61 98v63H283Z" fill="#0b5bd3"/><path d="M338 62h89l44 70H338Z" fill="#eaf2f8"/><path d="M351 72h68l30 48h-98Z" fill="#2c5470"/><path d="M291 149h180m-180 26h194" stroke="#f0a04c" stroke-width="10"/><rect x="288" y="91" width="34" height="42" rx="4" fill="#244b6e"/><path d="M293 55V14h79v41" stroke="#63839b" stroke-width="6" fill="none"/><path d="M282 23h97" stroke="#63839b" stroke-width="6"/><g fill="#18384f" stroke="#65859a" stroke-width="5"><circle cx="29" cy="214" r="20"/><circle cx="101" cy="214" r="20"/><circle cx="166" cy="214" r="20"/><circle cx="238" cy="214" r="20"/><circle cx="316" cy="214" r="23"/><circle cx="377" cy="214" r="23"/><circle cx="448" cy="214" r="23"/></g></g>`;
  else body=quad(uid);
  return `<svg class="cargo-illustration cargo-illustration--${esc(type)}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 460" role="img" aria-labelledby="${uid}-title"><title id="${uid}-title">${labels[type]||labels.drone} · ${en?'vector illustration':'矢量示意'}</title><defs><linearGradient id="${uid}-body" x1="0" x2=".8" y2="1"><stop stop-color="#f9fcfd"/><stop offset=".52" stop-color="#d1dfe6"/><stop offset="1" stop-color="#9bb0bf"/></linearGradient><linearGradient id="${uid}-metal" x1="0" x2="1" y2="1"><stop stop-color="#d5e2e8"/><stop offset="1" stop-color="#6f8b9e"/></linearGradient><linearGradient id="${uid}-dark" x1="0" x2="1" y2="1"><stop stop-color="#496478"/><stop offset="1" stop-color="#142e44"/></linearGradient><radialGradient id="${uid}-glow"><stop stop-color="#e4f0fb"/><stop offset="1" stop-color="#f4f8fc" stop-opacity="0"/></radialGradient></defs><ellipse cx="369" cy="218" rx="315" ry="207" fill="url(#${uid}-glow)"/><g class="illustration-orbit" fill="none" stroke="#d9e6f1"><ellipse cx="360" cy="265" rx="278" ry="132"/><path d="M86 315h70m410-209h51"/><circle cx="97" cy="232" r="5" fill="#d9e6f1"/><circle cx="591" cy="169" r="5" fill="#d9e6f1"/></g><g class="illustration-object">${body}</g></svg>`;
}

const css = `
.icon{display:inline-block;flex:none;width:24px;height:24px;padding:0;vertical-align:middle}
.network-map{isolation:isolate;width:100%;min-width:0;border:1px solid #dce7f2;border-radius:18px;background:#f2f7fd;overflow:hidden}
.network-canvas{position:relative;min-width:0}
.network-mobile-summary{display:none}
.network-svg{display:block;width:100%;height:auto;overflow:visible}
.network-graticule{stroke:#cbdceb;stroke-width:.6;opacity:.5;fill:none}
.network-land{stroke:#becddd;stroke-width:.65;stroke-linejoin:round}
.network-route{--route-color:#0b5bd3;transition:opacity .25s}
.network-route.is-muted{opacity:.3}
.network-route-halo{stroke:#fff;stroke-width:5;opacity:.8;fill:none}
.network-route-line{stroke:var(--route-color);stroke-width:1.8;fill:none;opacity:.8}
.network-route-trail,.network-route-marker{display:none}
.network-map.is-visible .network-route-line{stroke-dasharray:1000;animation:route-draw 2.6s ease-out both}
.network-point-ring{fill:var(--route-color);opacity:.1}
.network-point{fill:var(--route-color);stroke:#fff;stroke-width:2}
.network-label{font-size:16px;font-weight:650;fill:#163b5e;pointer-events:none}
.network-label-hit{fill:#fff;fill-opacity:.86;stroke:#d5e1ec;stroke-width:.7}
.network-route a:hover .network-label-hit,.network-route a:focus .network-label-hit{stroke:var(--route-color);stroke-width:2}
.network-route a:focus{outline:none}
.network-origin-pulse{fill:none;stroke:#0b5bd3;stroke-width:1.5;transform-box:fill-box;transform-origin:center;opacity:.3}
.network-map.is-visible .network-origin-pulse{animation:origin-pulse 3s ease-out both}
.network-note{font-size:12px;fill:#5a7189}
.network-links{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;background:#dce7f2;border-top:1px solid #dce7f2}
.network-link{min-height:64px;display:flex;align-items:center;gap:10px;padding:16px 24px;background:#fff;color:#143858;text-decoration:none;font-size:15px;font-weight:600;transition:background .2s,color .2s}
.network-link:hover,.network-link.is-active{background:#eaf2fd;color:#0b5bd3}
.network-link:focus-visible{outline:3px solid #0b5bd3;outline-offset:-4px}
.network-link .icon{width:18px;height:18px;margin-left:auto}
.network-key{width:9px;height:9px;border-radius:50%;background:var(--route-color);flex:none}
.cargo-illustration{display:block;width:100%;height:auto;overflow:visible}
.illustration-object{transform-box:fill-box;transform-origin:center;animation:cargo-float 6s ease-in-out 1}
@keyframes route-draw{from{stroke-dashoffset:1000}to{stroke-dashoffset:0}}
@keyframes origin-pulse{0%{opacity:.65;transform:scale(.75)}75%,100%{opacity:0;transform:scale(2)}}
@keyframes cargo-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
@media(max-width:700px){.network-map{border-radius:12px}.network-mobile-summary{display:block;padding:16px 18px 0;font-size:14px;line-height:1.5;font-weight:600;color:#163b5e}.network-svg{min-width:0}.network-route-trail{stroke-width:2}.network-route a,.network-origin rect,.network-origin text{display:none}.network-links{grid-template-columns:1fr}.network-link{min-height:54px;padding:14px 18px;font-size:15px}.network-note{display:none}.network-route-marker{display:none}.network-canvas{padding:10px 0}.illustration-object{animation:none}}
@media(prefers-reduced-motion:reduce){.network-route-trail,.network-origin-pulse,.illustration-object{animation:none}.network-route-marker{display:none}.network-route,.network-link{transition:none}}
`;

module.exports={icon,map,illustration,css};
