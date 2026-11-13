// Discussion guide: builds a printable list from the visitor's answers.
// Answers never leave the browser.
export function initQuiz() {
  document.querySelectorAll("[data-quiz]").forEach((form) => {
    const result = form.parentElement.querySelector("[data-quiz-result]");
    const list = result?.querySelector("[data-quiz-list]");
    if (!result || !list) return;
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      list.replaceChildren();
      const checked = form.querySelectorAll("input:checked");
      if (!checked.length) {
        const li = document.createElement("li");
        li.textContent = "Ask your healthcare provider whether Fictiva may be right for you.";
        list.append(li);
      }
      checked.forEach((input) => {
        const li = document.createElement("li");
        li.textContent = `${input.dataset.question} ${input.value}`;
        list.append(li);
      });
      result.hidden = false;
      result.focus();
    });
    result.querySelector("[data-quiz-print]")?.addEventListener("click", () => window.print());
  });
}
