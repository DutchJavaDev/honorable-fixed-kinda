if ('serviceWorker' in navigator) {
  const register = async () => {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });

      reg.addEventListener('updatefound', () => {
        const incoming = reg.installing;
        incoming?.addEventListener('statechange', () => {
          if (incoming.state === 'installed' && navigator.serviceWorker.controller) {
            alert('Refresh the page, this version is outdated');
          }
        });
      });
    } catch (err) {
      console.error('[SW] registration failed:', err);
    }
  };

  if (document.readyState === 'complete') register();
  else window.addEventListener('load', register, { once: true });
}
