(() => {
    const cards = [...document.querySelectorAll(".render-item")];
    const lightbox = document.querySelector("#render-lightbox");
    const lightboxImage = document.querySelector("#lightbox-image");
    const counter = document.querySelector("#lightbox-counter");
    const title = document.querySelector("#lightbox-title");
    const closeButton = document.querySelector("#lightbox-close");
    const prevButton = document.querySelector("#lightbox-prev");
    const nextButton = document.querySelector("#lightbox-next");

    if (!cards.length || !lightbox || !lightboxImage) return;

    const works = cards.map(card => ({
        url: card.dataset.image,
        name: card.dataset.title || card.querySelector("img")?.alt || "Artwork"
    }));

    let activeIndex = 0;
    let lastFocus = null;

    function openAt(index) {
        const wasClosed = !lightbox.classList.contains("is-open");
        if (wasClosed) lastFocus = document.activeElement;

        activeIndex = (index + works.length) % works.length;
        const work = works[activeIndex];

        lightboxImage.classList.remove("is-visible");
        lightboxImage.onload = () => lightboxImage.classList.add("is-visible");
        lightboxImage.src = work.url;
        lightboxImage.alt = work.name;
        title.textContent = work.name;
        counter.textContent =
            String(activeIndex + 1).padStart(2, "0") + " / " +
            String(works.length).padStart(2, "0");

        lightbox.classList.add("is-open");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.classList.add("lightbox-open");
        if (wasClosed) closeButton.focus();

        if (lightboxImage.complete && lightboxImage.naturalWidth > 0) {
            lightboxImage.classList.add("is-visible");
        }
    }

    function close() {
        lightbox.classList.remove("is-open");
        lightbox.setAttribute("aria-hidden", "true");
        document.body.classList.remove("lightbox-open");
        if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
    }

    cards.forEach((card, index) => {
        card.addEventListener("click", () => openAt(index));
    });

    closeButton.addEventListener("click", close);
    prevButton.addEventListener("click", () => openAt(activeIndex - 1));
    nextButton.addEventListener("click", () => openAt(activeIndex + 1));

    lightbox.addEventListener("click", event => {
        if (event.target === lightbox) close();
    });

    document.addEventListener("keydown", event => {
        if (!lightbox.classList.contains("is-open")) return;
        if (event.key === "Escape") close();
        if (event.key === "ArrowLeft") openAt(activeIndex - 1);
        if (event.key === "ArrowRight") openAt(activeIndex + 1);
    });
})();
