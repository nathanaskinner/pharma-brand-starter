// Vimeo "facade": the player (and its cookies) loads only when the visitor clicks play.
// dnt=1 turns off Vimeo's tracking and analytics cookies.
export function initVideos() {
  document.querySelectorAll("[data-vimeo-id]").forEach((el) => {
    const button = el.querySelector(".video__play");
    if (!button) return;
    button.addEventListener("click", () => {
      const id = encodeURIComponent(el.dataset.vimeoId);
      const iframe = document.createElement("iframe");
      iframe.src = `https://player.vimeo.com/video/${id}?dnt=1&autoplay=1&title=0&byline=0&portrait=0`;
      iframe.allow = "autoplay; fullscreen; picture-in-picture";
      iframe.allowFullscreen = true;
      iframe.title = el.dataset.videoTitle || "Video player";
      button.replaceWith(iframe);
    }, { once: true });
  });
}
