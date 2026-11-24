const CACHE = 'studia-v3';
const CORE = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './lesson-methods.js',
  './sync-config.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
  './lessons/ag-angles-01.js',
  './lessons/ag-basis-01.js',
  './lessons/ag-coords-01.js',
  './lessons/ag-det-01.js',
  './lessons/ag-detprop-01.js',
  './lessons/ag-ellipse-01.js',
  './lessons/ag-hyperbola-01.js',
  './lessons/ag-line-01.js',
  './lessons/ag-linindep-01.js',
  './lessons/ag-matrix-01.js',
  './lessons/ag-mixed-01.js',
  './lessons/ag-normline-01.js',
  './lessons/ag-parabola-01.js',
  './lessons/ag-plane-01.js',
  './lessons/ag-quadform-01.js',
  './lessons/ag-quadrics-01.js',
  './lessons/ag-scalar-01.js',
  './lessons/ag-spaceline-01.js',
  './lessons/ag-surfaces-01.js',
  './lessons/ag-vec-01.js',
  './lessons/ag-vector-01.js',
  './lessons/calc-asym-01.js',
  './lessons/calc-bigo-01.js',
  './lessons/calc-bounds-01.js',
  './lessons/calc-cauchyfun-01.js',
  './lessons/calc-cauchyseq-01.js',
  './lessons/calc-complex-01.js',
  './lessons/calc-cont-01.js',
  './lessons/calc-conttheor-01.js',
  './lessons/calc-convex-01.js',
  './lessons/calc-deriv-01.js',
  './lessons/calc-derivprop-01.js',
  './lessons/calc-derivtable-01.js',
  './lessons/calc-diff-01.js',
  './lessons/calc-extr-01.js',
  './lessons/calc-fermatpoly-01.js',
  './lessons/calc-flim-01.js',
  './lessons/calc-flim-02.js',
  './lessons/calc-flim-03.js',
  './lessons/calc-inv-01.js',
  './lessons/calc-lhopital-01.js',
  './lessons/calc-monoe-01.js',
  './lessons/calc-nested-01.js',
  './lessons/calc-paramderiv-01.js',
  './lessons/calc-remark-01.js',
  './lessons/calc-seqinf-01.js',
  './lessons/calc-seqlim-01.js',
  './lessons/calc-seqlim-02.js',
  './lessons/calc-sets-01.js',
  './lessons/calc-smallbig-01.js',
  './lessons/calc-subseq-01.js',
  './lessons/calc-taylor-01.js',
  './lessons/calc-taylorderiv-01.js',
  './lessons/calc-theor-01.js',
  './lessons/calc-unicont-01.js',
  './lessons/dm-bool-01.js',
  './lessons/dm-minim-01.js',
  './lessons/dm-nf-01.js',
  './lessons/dm-nnf-01.js',
  './lessons/dm-post-01.js',
  './lessons/dm-pred-01.js',
  './lessons/dm-proof-01.js',
  './lessons/dm-rel-01.js',
  './lessons/dm-releuclid-01.js',
  './lessons/dm-relprop-01.js',
  './lessons/dm-semproof-01.js',
  './lessons/dm-sets-01.js',
  './lessons/dm-zhegalkin-01.js',
  './lessons/algo-asym-01.js',
  './lessons/algo-ds-01.js',
  './lessons/algo-dp-01.js',
  './lessons/algo-knapsack-01.js',
  './lessons/algo-seq-01.js',
  './lessons/algo-binsearch-01.js',
  './lessons/algo-sort-01.js',
  './lessons/algo-rmq-01.js',
  './lessons/algo-heap-bst-01.js',
  './lessons/algo-hash-01.js',
  './lessons/algo-comb-01.js',
  './lessons/prog-basics-01.js',
  './lessons/prog-pointers-01.js',
  './lessons/prog-classes-01.js',
  './lessons/prog-templates-01.js',
  './lessons/prog-stl-01.js',
  './lessons/prog-strings-io-01.js',
  './lessons/prog-memory-raii-01.js',
  './lessons/prog-move-01.js',
  './lessons/prog-modern-01.js',
  './lessons/prog-oop-01.js',
  './lessons/la-extra.js',
  './lessons/prob-extra.js',
  './lessons/dm-graphs-extra.js',
  './lessons/algo-graphs-extra.js',
  './lessons/calc-integral-extra.js',
  './lessons/prog-extra.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(CORE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put('./index.html', copy));
          return response;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response && response.status === 200) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    })
  );
});
