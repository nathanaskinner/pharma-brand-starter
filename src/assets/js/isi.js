// Hide the sticky ISI tray once the full ISI section is on screen (it would duplicate it).
export function initIsiTray() {
  const tray = document.querySelector("[data-isi-tray]");
  const full = document.getElementById("isi");
  if (!tray || !full || !("IntersectionObserver" in window)) return;
  new IntersectionObserver(([entry]) => {
    tray.classList.toggle("is-hidden", entry.isIntersecting);
  }, { rootMargin: "0px 0px -20% 0px" }).observe(full);
}
