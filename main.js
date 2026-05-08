// 平滑捲動已用 CSS 處理，這裡加入 nav active 高亮
// 預先建立 section ↔ link 對應，避免 scroll 中重複 querySelector
const sections = Array.from(document.querySelectorAll('section[id]'));
const navLinks = document.querySelectorAll('.nav-links a');
const sectionLinkMap = sections.map(s => ({
  section: s,
  link: document.querySelector(`.nav-links a[href="#${s.id}"]`)
})).filter(x => x.link);
let lastActiveLink = null;

function updateNav(){
  const scrollY = window.scrollY + 100;
  for (const {section, link} of sectionLinkMap) {
    const top = section.offsetTop;
    if (scrollY >= top && scrollY < top + section.offsetHeight) {
      if (lastActiveLink !== link) {
        if (lastActiveLink) lastActiveLink.style.color = '';
        link.style.color = 'var(--amber)';
        lastActiveLink = link;
      }
      return;
    }
  }
}

// 漢堡選單：開關 + 點選後關閉 + ESC 關閉
const navToggle = document.querySelector('.nav-toggle');
const navLinksEl = document.getElementById('primary-nav');
const navOverlay = document.querySelector('.nav-overlay');
function setNavOpen(open){
  navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  navLinksEl.classList.toggle('open', open);
  navOverlay.classList.toggle('open', open);
  document.body.classList.toggle('nav-open', open);
}
navToggle.addEventListener('click', () => {
  setNavOpen(navToggle.getAttribute('aria-expanded') !== 'true');
});
navOverlay.addEventListener('click', () => setNavOpen(false));
navLinksEl.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => setNavOpen(false));
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
    setNavOpen(false);
  }
});

// 閱讀進度條 + 回到頂部按鈕
const progressBar = document.querySelector('.reading-progress');
const backToTop = document.querySelector('.back-to-top');
function updateProgress(){
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
  progressBar.style.width = (ratio * 100) + '%';
  backToTop.classList.toggle('show', scrollTop > window.innerHeight * 0.6);
}
updateProgress();

// rAF 節流：把兩個 scroll handler 合併為單一 frame 任務，避免手機滑動掉幀
let scrollRafId = null;
function onScroll(){
  if (scrollRafId !== null) return;
  scrollRafId = requestAnimationFrame(() => {
    updateNav();
    updateProgress();
    scrollRafId = null;
  });
}
window.addEventListener('scroll', onScroll, {passive:true});
backToTop.addEventListener('click', () => {
  window.scrollTo({top:0, behavior:'smooth'});
});

// reveal on scroll
const obs = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.style.animationPlayState = 'running';
      obs.unobserve(e.target);
    }
  });
},{threshold:0.1});
document.querySelectorAll('.reveal').forEach(el=>{
  el.style.animationPlayState = 'paused';
  obs.observe(el);
});

// Service Worker 註冊（離線可看 — 適合在波蘭當地無 Wi-Fi 時使用）
// 內容更新時跳出「新版本可用」banner，讓使用者主動切換
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('sw.js');

      function showUpdateBanner(worker) {
        if (document.getElementById('sw-update-banner')) return;
        const banner = document.createElement('div');
        banner.id = 'sw-update-banner';
        banner.innerHTML = `
          <span class="sw-update-text">📖 指南有新內容可用</span>
          <button type="button" data-action="reload" class="sw-update-btn">立即更新</button>
          <button type="button" data-action="dismiss" class="sw-update-close" aria-label="關閉">×</button>
        `;
        document.body.appendChild(banner);
        banner.querySelector('[data-action="reload"]').addEventListener('click', () => {
          worker.postMessage({type: 'SKIP_WAITING'});
        });
        banner.querySelector('[data-action="dismiss"]').addEventListener('click', () => {
          banner.remove();
        });
      }

      if (reg.waiting) showUpdateBanner(reg.waiting);

      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (!newWorker) return;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            showUpdateBanner(newWorker);
          }
        });
      });

      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        refreshing = true;
        window.location.reload();
      });
    } catch (e) {
      // 註冊失敗無感降級——使用者仍能正常瀏覽
    }
  });
}
