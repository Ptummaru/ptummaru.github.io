/* GSA02 QA/QC – service worker: ให้แอปเปิดได้แม้ไม่มีเน็ต
   เมื่อแก้ไขแอป ให้เปลี่ยนเลข VERSION เพื่อให้ทุกเครื่องโหลดเวอร์ชันใหม่ */
const VERSION = 'gsa02-qaqc-v2';
const CORE = [
  './', './index.html', './manifest.json',
  './icon-192.png', './icon-512.png', './maskable-192.png', './maskable-512.png'
];
const CDN = [
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(VERSION);
    await c.addAll(CORE);
    // ตัวอ่าน PDF และฟอนต์: เก็บไว้ถ้าโหลดได้ ไม่ทำให้การติดตั้งล้มเหลว
    await Promise.all(CDN.map(u => c.add(new Request(u, { mode: 'no-cors' })).catch(() => {})));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== VERSION) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // หน้าแอป: ใช้เวอร์ชันล่าสุดจากเน็ตก่อน ถ้าไม่มีเน็ตใช้ที่เก็บไว้
  if (req.mode === 'navigate' || (url.origin === location.origin && url.pathname.endsWith('.html'))) {
    e.respondWith((async () => {
      try {
        const res = await fetch(req);
        (await caches.open(VERSION)).put('./index.html', res.clone());
        return res;
      } catch (_) {
        return (await caches.match('./index.html')) || Response.error();
      }
    })());
    return;
  }
  // ไฟล์อื่น (ไอคอน, ตัวอ่าน PDF, ฟอนต์): ใช้ที่เก็บไว้ก่อน แล้วค่อยเก็บของใหม่
  e.respondWith((async () => {
    const hit = await caches.match(req);
    if (hit) return hit;
    try {
      const res = await fetch(req);
      if (res && (res.ok || res.type === 'opaque') &&
          (url.origin === location.origin || /cdnjs\.cloudflare\.com|fonts\.(googleapis|gstatic)\.com/.test(url.host))) {
        (await caches.open(VERSION)).put(req, res.clone());
      }
      return res;
    } catch (_) {
      return hit || Response.error();
    }
  })());
});
