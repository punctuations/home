(() => {
  const button = document.querySelector(".copy");
  if (!button || !navigator.clipboard) return;

  const command = () => {
    const recipe = document.querySelector(".recipe[data-shell]:not([hidden])");
    if (!recipe) return "";

    const clone = recipe.cloneNode(true);
    clone.querySelectorAll('[role="tooltip"]').forEach((note) => note.remove());
    return clone.textContent.trim();
  };

  let revert;

  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(command());
    } catch {
      return;
    }

    button.classList.add("is-copied");
    button.setAttribute("aria-label", "Copied");

    clearTimeout(revert);
    revert = setTimeout(() => {
      button.classList.remove("is-copied");
      button.setAttribute("aria-label", "Copy command");
    }, 1600);
  });

  button.hidden = false;
})();
