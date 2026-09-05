(() => {
  const picker = document.querySelector(".shells");
  const recipes = document.querySelectorAll(".recipe[data-shell]");
  if (!picker || !recipes.length) return;

  const buttons = picker.querySelectorAll(".shell");
  const known = new Set(Array.from(buttons, (button) => button.dataset.shell));
  const storageKey = "shell";

  const onWindows = () => {
    const hinted = navigator.userAgentData && navigator.userAgentData.platform;
    if (hinted) return hinted === "Windows";
    return /Win/i.test(navigator.platform || navigator.userAgent);
  };

  const show = (wanted) => {
    recipes.forEach((recipe) => {
      recipe.hidden = recipe.dataset.shell !== wanted;
    });
    buttons.forEach((button) => {
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.shell === wanted),
      );
    });
  };

  let remembered = null;
  try {
    remembered = localStorage.getItem(storageKey);
  } catch {}

  show(
    known.has(remembered)
      ? remembered
      : onWindows()
        ? "powershell"
        : "posix",
  );
  picker.hidden = false;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      show(button.dataset.shell);
      try {
        localStorage.setItem(storageKey, button.dataset.shell);
      } catch {}
    });
  });
})();
