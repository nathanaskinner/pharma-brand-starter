// Demo-only: the preview form goes straight to the thank-you page without sending data.
export function initDemoForms() {
  document.querySelectorAll("[data-demo-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (form.reportValidity()) window.location.href = form.getAttribute("action");
    });
  });
}
