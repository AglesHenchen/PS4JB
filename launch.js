/* Enter through this page so jb.js receives the required same-folder referrer. */
var cacheEl = document.getElementById("cache");
var gone = false;
var failed = false;
var timer = null;
var appCache = (function () {
  try { return window.applicationCache || null; } catch (e) { return null; }
})();
function go() {
  if (gone || failed) return;
  gone = true;
  clearTimeout(timer);
  cacheEl.textContent = "Starting Jailbreak";
  location.href = "jb.html?afterglow=run&mode=goldhen";
}
function fail(message) {
  if (gone) return;
  failed = true;
  clearTimeout(timer);
  document.body.className = "cache-error";
  cacheEl.textContent = message;
}
function ready() {
  if (gone || failed) return;
  clearTimeout(timer);
  go();
}
function updated() {
  if (gone || failed) return;
  try {
    appCache.swapCache();
    gone = true;
    clearTimeout(timer);
    location.reload();
  } catch (e) {
    fail("Offline update failed. Reopen this page to try again.");
  }
}
function cacheError() {
  // A failed update can still leave a complete, usable offline cache.
  if (appCache && appCache.status === appCache.IDLE) ready();
  else fail("Could not save offline. Check your connection and reload this page.");
}
if (!appCache) {
  fail("Offline saving is unavailable in this browser. Open this page on your PS4.");
} else {
  appCache.addEventListener("cached", ready, false);
  appCache.addEventListener("noupdate", ready, false);
  appCache.addEventListener("updateready", updated, false);
  appCache.addEventListener("error", cacheError, false);
  appCache.addEventListener("obsolete", cacheError, false);
  // Cover a cache event that completed before this script was attached.
  timer = setTimeout(function () {
    if (appCache.status === appCache.IDLE) ready();
    else if (appCache.status === appCache.UPDATEREADY) updated();
  }, 1500);
}
