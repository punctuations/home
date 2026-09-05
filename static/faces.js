(() => {
  const images = document.querySelectorAll(".face img");
  if (!images.length) return;

  images.forEach((image) => {
    const reveal = () => image.classList.add("is-loaded");

    if (image.complete) {
      reveal();
      return;
    }

    image.addEventListener("load", reveal, { once: true });
    image.addEventListener("error", reveal, { once: true });
  });
})();
