const scenarios={
 a:{title:'情境 A｜父親把財產贈與兒子',subtitle:'時間若落在死亡前 2 年內，兒子屬第 15 條列舉對象之一，因此需進一步依規定判斷。',facts:[['受贈人','兒子'],['時間','死亡前 2 年內'],['財產','一般財產'],['可能涉及','贈與稅＋第 15 條遺產問題'],['判斷關鍵','受贈人身分與時間條件'],['提醒','併入遺產總額不等於一定有遺產稅應納']]},
 b:{title:'情境 B｜公公把財產贈與媳婦',subtitle:'若死亡時媳婦仍是第 15 條所稱各順序繼承人的配偶，受贈人身分是重要判斷條件。',facts:[['受贈人','媳婦'],['時間','死亡前 2 年內'],['財產','一般財產'],['可能涉及','第 15 條適用判斷'],['判斷關鍵','死亡時相關配偶身分是否存在'],['提醒','不能只用「親戚」兩字簡化法律身分']]},
 c:{title:'情境 C｜贈與媳婦，但死亡前已離婚',subtitle:'依本網站引用的財政部函釋及南區國稅局案例，死亡時若相關配偶／親屬關係已消滅，該案例不適用第 15 條併入遺產。',facts:[['受贈人','原媳婦'],['時間','贈與在死亡前 2 年內'],['身分變化','死亡前已離婚'],['官方案例結果','免依第 15 條併入遺產'],['判斷關鍵','死亡時身分'],['提醒','這是引用官方案例，不代表可忽略其他稅務問題']]},
 d:{title:'情境 D｜父母把保單要保人變更為子女',subtitle:'官方案例把此類無償變更視為財產權益移轉；若原要保人在變更後 2 年內死亡，再檢查第 15 條。',facts:[['受贈人','子女'],['事件','變更保單要保人'],['贈與階段','核對移轉權益、贈與時價及適用估價規定'],['死亡階段','案例採死亡日之保單價值；不直接套用通用公式'],['可能涉及','贈與稅＋第 15 條遺產問題'],['判斷關鍵','先看適用條件，再確認相應日期價值']]}
};
const panel = document.querySelector('#scenarioPanel');
const tabs = [...document.querySelectorAll('[data-scenario]')];
const scenarioStatus = document.querySelector('#scenarioStatus');
const sourceLinks = {
  a: 'https://law-out.mof.gov.tw/LawContent.aspx?id=FL006067',
  b: 'https://law-out.mof.gov.tw/LawContent.aspx?id=GL010097&media=print',
  c: 'https://www.ntbsa.gov.tw/singlehtml/5e0e49a811b74b50b5a6486d38374285?cntId=caaa44775e094082bdd10c5d07227abc',
  d: 'https://www.ntbsa.gov.tw/singlehtml/5e0e49a811b74b50b5a6486d38374285?cntId=f35b81b15203410394d9ea17634bb785'
};
function renderScenario(key) {
  const s = scenarios[key];
  tabs.forEach(tab => {
    const selected = tab.dataset.scenario === key;
    tab.id = `scenario-tab-${tab.dataset.scenario}`;
    tab.setAttribute('aria-controls', 'scenarioPanel');
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  panel.setAttribute('aria-labelledby', `scenario-tab-${key}`);
  panel.innerHTML = `<div class="scenario-title"><h3>${s.title}</h3><p>${s.subtitle}</p></div>${s.facts.map(([k,v]) => `<div class="scenario-fact${k === '判斷關鍵' ? ' is-key' : ''}"><span>${k === '判斷關鍵' ? '◎ ' : ''}${k}</span><strong>${v}</strong></div>`).join('')}<a class="scenario-source" href="${sourceLinks[key]}" target="_blank" rel="noopener">核對本情境官方依據 ↗</a>`;
  scenarioStatus.textContent = `目前選擇：${key.toUpperCase()}｜${s.title.split('｜')[1]}（教育情境）`;
  updateScroll();
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => renderScenario(tab.dataset.scenario));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) {
      event.preventDefault();
      tabs[next].focus();
      renderScenario(tabs[next].dataset.scenario);
    }
  });
});

const menuBtn = document.querySelector('#menuBtn');
const mobileMenu = document.querySelector('#mobileMenu');
function setMenu(open, returnFocus = false) {
  mobileMenu.hidden = !open;
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.setAttribute('aria-label', open ? '關閉選單' : '開啟選單');
  if (returnFocus) menuBtn.focus();
}
menuBtn.addEventListener('click', () => setMenu(mobileMenu.hidden));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !mobileMenu.hidden) setMenu(false, true);
});
document.addEventListener('click', event => {
  if (!mobileMenu.hidden && !event.target.closest('.site-header')) setMenu(false);
});
document.querySelector('.site-header').addEventListener('focusout', event => {
  if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) setMenu(false);
});
const desktopQuery = matchMedia('(min-width:1025px)');
desktopQuery.addEventListener('change', event => {
  if (event.matches) {
    const needsFocus = mobileMenu.contains(document.activeElement) || document.activeElement === menuBtn;
    setMenu(false);
    if (needsFocus) document.querySelector('.brand').focus();
  }
});

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', event => {
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    setMenu(false);
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({preventScroll:true});
    target.scrollIntoView({behavior:reduceMotion.matches ? 'instant' : 'smooth', block:'start'});
    try { history.pushState(null, '', `#${id}`); } catch { /* file preview may limit history */ }
  });
});

const proToggle = document.querySelector('#proToggle');
const proContent = document.querySelector('#proContent');
proToggle?.addEventListener('click', () => {
  const open = proContent.hidden;
  proContent.hidden = !open;
  proToggle.setAttribute('aria-expanded', String(open));
  proToggle.textContent = open ? '收合業務員專區 −' : '展開業務員專區 ＋';
});
document.querySelectorAll('.flow-node').forEach(details => {
  details.addEventListener('toggle', () => {
    details.querySelector('small').textContent = details.open ? '收合說明 −' : '展開說明 ＋';
  });
});
const checks = [...document.querySelectorAll('#checklist input')];
function updateChecklist() {
  const n = checks.filter(input => input.checked).length;
  document.querySelector('#checklistStatus').textContent = `已整理 ${n} / ${checks.length} 項${n === checks.length ? (document.body.dataset.audience === 'advisor' ? '，請整理待補資料與轉介問題' : '，可帶資料進一步確認') : ''}`;
}
checks.forEach(input => input.addEventListener('change', updateChecklist));
document.querySelector('#resetChecklist').addEventListener('click', () => {
  checks.forEach(input => input.checked = false);
  updateChecklist();
});

const backTop = document.querySelector('#backTop');
const progress = document.querySelector('#progressBar');
function updateScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = `${max > 0 ? Math.min(100, Math.max(0, scrollY / max * 100)) : 0}%`;
  const show = scrollY > 700;
  // Retain an actively focused control until focus is transferred by its action.
  if (show || document.activeElement !== backTop) backTop.hidden = !show;
  backTop.classList.toggle('show', show);
}
let scrollFrame = 0;
addEventListener('scroll', () => {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(() => { updateScroll(); scrollFrame = 0; });
}, {passive:true});
addEventListener('resize', updateScroll);
new ResizeObserver(updateScroll).observe(document.body);
backTop.addEventListener('click', () => {
  document.querySelector('.brand').focus({preventScroll:true});
  scrollTo({top:0, behavior:reduceMotion.matches ? 'instant' : 'smooth'});
});

const shareBtn = document.querySelector('#shareBtn');
shareBtn.addEventListener('click', async () => {
  const status = document.querySelector('#shareStatus');
  if (location.protocol === 'file:') {
    status.textContent = '目前是本機檔案，請部署網站後再分享網址。';
    shareBtn.textContent = '本機預覽';
  } else {
    try {
      const data = {title:document.title, url:location.href};
      if (navigator.share) await navigator.share(data);
      else {
        await navigator.clipboard.writeText(location.href);
        status.textContent = '已複製本頁連結';
        shareBtn.textContent = '已複製';
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        status.textContent = '無法自動分享，請複製瀏覽器網址。';
        shareBtn.textContent = '請複製網址';
      }
    }
  }
  setTimeout(() => shareBtn.textContent = '分享', 2500);
});
const navLinks = [...document.querySelectorAll('.desktop-nav a,.mobile-section-nav a')];
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) navLinks.forEach(link => {
      const active = link.hash === `#${entry.target.id}`;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  });
}, {rootMargin:'-25% 0px -60% 0px'});
document.querySelectorAll('main section[id]').forEach(section => io.observe(section));
renderScenario('a');
updateChecklist();
updateScroll();
