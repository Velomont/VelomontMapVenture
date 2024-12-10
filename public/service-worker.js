// public/service-worker.js

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Add any fetch event handling if needed
});

// Function to update cache
async function updateCache() {
  const BBOXES = [
    '-73.103027,42.585444,-72.736359,43.323180',
    '-73.347473,43.148092,-72.957458,43.643032',
    '-73.107147,43.517684,-72.570190,44.241264',
    '-73.046722,44.229457,-72.397156,44.692088',
    '-72.438354,44.320901,-71.827240,45.018214'
  ];

  for (const bbox of BBOXES) {
    const cacheKey = `trailforksData_${bbox}`;
    localStorage.removeItem(cacheKey);
  }

  // Notify the main thread to refetch data
  self.clients.matchAll().then(clients => {
    clients.forEach(client => client.postMessage({ type: 'REFETCH_TRAILFORKS_DATA' }));
  });
}

// Schedule cache update
function scheduleNextUpdate() {
  const now = new Date();
  const nextUpdate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 2, 0, 0, 0);
  const timeUntilNextUpdate = nextUpdate - now;

  setTimeout(() => {
    updateCache();
    scheduleNextUpdate();
  }, timeUntilNextUpdate);
}

scheduleNextUpdate();