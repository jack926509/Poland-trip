(function () {
  const state = window.PolskaPwaState = {
    status: 'loading',
    registration: null,
    waitingWorker: null,
    error: null,
    updateError: null,
  };
  let updateApproved = false;
  let reloaded = false;
  const watchedWorkers = new WeakSet();
  const emit = (name, detail) => {
    if (name === 'pwa-ready') {
      state.status = 'ready';
      state.registration = detail.registration;
    }
    else if (name === 'pwa-update-ready') {
      state.waitingWorker = detail.worker;
      state.updateError = null;
    }
    else if (name === 'pwa-update-error') {
      state.waitingWorker = null;
      state.updateError = detail;
    }
    else if (name === 'pwa-error') {
      state.status = 'error';
      state.error = detail;
    }
    window.dispatchEvent(new CustomEvent(name, { detail }));
  };

  if (!('serviceWorker' in navigator)) {
    emit('pwa-error', { reason: 'unsupported' });
    return;
  }

  state.applyUpdate = () => {
    if (!state.waitingWorker) return false;
    updateApproved = true;
    state.waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    return true;
  };
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!updateApproved || reloaded) return;
    reloaded = true;
    window.location.reload();
  });

  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('./sw.js');
      state.registration = registration;
      const watchWorker = (worker) => {
        if (!worker || watchedWorkers.has(worker)) return;
        watchedWorkers.add(worker);
        worker.addEventListener('statechange', () => {
          if (worker.state === 'redundant') {
            if (registration.active || navigator.serviceWorker.controller) {
              emit('pwa-update-error', { reason: 'worker-redundant' });
            }
            else {
              emit('pwa-error', { reason: 'worker-redundant' });
            }
          }
          else if (worker.state === 'installed' && navigator.serviceWorker.controller) {
            emit('pwa-update-ready', { worker });
          }
        });
      };
      if (registration.waiting) {
        emit('pwa-update-ready', { worker: registration.waiting });
      }
      watchWorker(registration.installing);
      registration.addEventListener('updatefound', () => {
        watchWorker(registration.installing);
      });
      const readyRegistration = await navigator.serviceWorker.ready;
      if (!readyRegistration.active || (readyRegistration.active.state && readyRegistration.active.state !== 'activated')) {
        emit('pwa-error', { reason: 'worker-not-active' });
        return;
      }
      emit('pwa-ready', { registration: readyRegistration });
    }
    catch (error) {
      emit('pwa-error', { reason: 'registration', message: error.message });
    }
  });
})();
