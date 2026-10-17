/* Cook Together: display only moderator-approved food photos from the public bucket.
   No Supabase credentials are embedded. This uses the app's existing client. */
(function () {
  'use strict';
  const PHOTO_PATH = /^\/storage\/v1\/object\/public\/parent-recipe-public\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(?:jpg|jpeg|png|webp)$/i;
  let cached = null;
  let inflight = null;
  let queued = false;

  function approvedUrl(value, client) {
    if (typeof value !== 'string' || typeof client?.supabaseUrl !== 'string') return null;
    try {
      const photo = new URL(value);
      const project = new URL(client.supabaseUrl);
      if (photo.protocol !== 'https:' || photo.origin !== project.origin ||
          photo.search || photo.hash || !PHOTO_PATH.test(photo.pathname)) return null;
      return photo.href;
    } catch {
      return null;
    }
  }

  function addPhotos(feed, client) {
    if (!cached) return;
    feed.querySelectorAll('.pk-card').forEach(card => {
      if (card.querySelector('.pk-card-photo')) return;
      const recipeId = card.querySelector('[data-love]')?.getAttribute('data-love');
      const src = approvedUrl(cached.get(recipeId), client);
      if (!src) return;
      const img = document.createElement('img');
      img.className = 'pk-card-photo';
      img.src = src;
      img.alt = 'Approved photo of ' + (card.querySelector('h3')?.textContent || 'this recipe');
      img.loading = 'lazy';
      img.decoding = 'async';
      img.referrerPolicy = 'no-referrer';
      img.addEventListener('error', () => img.remove(), { once: true });
      card.prepend(img);
    });
  }

  async function refresh() {
    if (!location.hash.startsWith('#/parent-kitchen')) return;
    const feed = document.getElementById('pk-feed');
    if (!feed || !feed.querySelector('.pk-card')) return;
    const client = window.__dwSupabaseClient;
    if (!client) return;
    if (cached) { addPhotos(feed, client); return; }
    if (inflight) return;
    try {
      inflight = client.from('community_recipes')
        .select('id,photo_url')
        .eq('status', 'published')
        .not('photo_url', 'is', null)
        .limit(60);
      const { data, error } = await inflight;
      if (error) throw error;
      cached = new Map((data || []).map(row => [row.id, row.photo_url]));
      if (location.hash.startsWith('#/parent-kitchen')) addPhotos(feed, client);
    } catch (err) {
      console.warn('Cook Together photos unavailable:', err?.message || err);
    } finally {
      inflight = null;
    }
  }

  function schedule() {
    if (queued) return;
    queued = true;
    Promise.resolve().then(() => { queued = false; refresh(); });
  }

  function start() {
    const observer = new MutationObserver(schedule);
    observer.observe(document.getElementById('main') || document.body,
      { childList: true, subtree: true });
    window.addEventListener('hashchange', () => { cached = null; schedule(); });
    schedule();
  }

  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
