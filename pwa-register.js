(function () {
  const emit = (name, detail) => window.dispatchEvent(new CustomEvent(name, { detail }));

  if (!('serviceWorker' in navigator)) {
    emit('pwa-error', { reason: 'unsupported' });
    return;
  }

  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('./sw.js');
      if (registration.waiting) {
        emit('pwa-update-ready', { worker: registration.waiting });
      }
      registration.addEventListener('updatefound', () => {
        const worker = registration.installing;
        worker?.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) {
            emit('pwa-update-ready', { worker });
          }
        });
      });
      emit('pwa-ready', { registration });
    }
    catch (error) {
      emit('pwa-error', { reason: 'registration', message: error.message });
    }
  });
})();
