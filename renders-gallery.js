(() => {
    const owner = "memelemon";
    const repo = "memelemon.github.io";
    const branch = "main";
    const folder = "assets/renders/artworks";
    const field = document.querySelector("#renders-field");
    const status = document.querySelector("#render-status");
    const lightbox = document.querySelector("#render-lightbox");
    const lightboxImage = document.querySelector("#lightbox-image");
    const counter = document.querySelector("#lightbox-counter");
    const title = document.querySelector("#lightbox-title");
    const closeButton = document.querySelector("#lightbox-close");
    const prevButton = document.querySelector("#lightbox-prev");
    const nextButton = document.querySelector("#lightbox-next");
    let works = [];
    let activeIndex = 0;
    let lastFocus = null;

    const niceName = (filename) => filename.replace(/\\.webp$/i, "").replace(/[-_]/g, " ");
    const imageUrl = (filename) => `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${folder}/${encodeURIComponent(filename).replace(/%2F/g, "/")}`;

    function openAt(index) {
        if (!works.length) return;
        activeIndex = (index + works.length) % works.length;
        const work = works[activeIndex];
        lightboxImage.classList.remove("is-visible");
        lightboxImage.src = work.url;
        lightboxImage.alt = niceName(work.name);
        title.textContent = niceName(work.name);
        counter.textContent = String(activeIndex + 1).padStart(2, "0") + " / " + String(works.length).padStart(2, "0");
        lightbox.classList.add("is-open");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.classList.add("lightbox-open");
        closeButton.focus();
        lastFocus = document.activeElement === closeButton ? lastFocus : document.activeElement;
        lightboxImage.onload = () => lightboxImage.classList.add("is-visible");
        if (lightboxImage.complete) lightboxImage.classList.add("is-visible");
    }
    function close() {
        lightbox.classList.remove("is-open");
        lightbox.setAttribute("aria-hidden", "true");
        document.body.classList.remove("lightbox-open");
        if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
    }
    function render() {
        field.replaceChildren();
        works.forEach((work, index) => {
            const button = document.createElement("button");
            button.className = "render-item";
            button.type = "button";
            button.setAttribute("aria-label", "Open " + niceName(work.name));
            const img = document.createElement("img");
            img.src = work.url;
            img.alt = niceName(work.name);
            img.loading = index < 3 ? "eager" : "lazy";
            img.decoding = "async";
            const seed = index * 37 + work.name.length * 13;
            button.style.setProperty("--drift", (7 + seed % 10) + "px");
            button.style.setProperty("--tilt", ((seed % 7) - 3) * .32 + "deg");
            button.style.setProperty("--speed", (7 + seed % 8) + "s");
            button.style.setProperty("--delay", "-" + (seed % 9) + "s");
            button.append(img);
            button.addEventListener("click", () => openAt(index));
            field.append(button);
        });
        status.textContent = works.length + (works.length === 1 ? " WORK" : " WORKS");
    }

    async function loadWorks() {
        try {
            const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${folder}?ref=${branch}`, {
                headers: { "Accept": "application/vnd.github+json" },
                cache: "no-cache"
            });
            if (!response.ok) throw new Error("Could not load the artwork directory");
            const files = await response.json();
            works = files
                .filter(file => file.type === "file" && /\\.webp$/i.test(file.name))
                .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))
                .map(file => ({ name: file.name, url: imageUrl(file.name) }));
            if (!works.length) {
                status.textContent = "NO WORKS IN THIS COLLECTION YET.";
                return;
            }
            render();
        } catch (error) {
            status.textContent = "THE COLLECTION COULD NOT BE LOADED. PLEASE REFRESH THE PAGE.";
            console.error(error);
        }
    }

    closeButton.addEventListener("click", close);
    prevButton.addEventListener("click", () => openAt(activeIndex - 1));
    nextButton.addEventListener("click", () => openAt(activeIndex + 1));
    lightbox.addEventListener("click", event => { if (event.target === lightbox) close(); });
    document.addEventListener("keydown", event => {
        if (!lightbox.classList.contains("is-open")) return;
        if (event.key === "Escape") close();
        if (event.key === "ArrowLeft") openAt(activeIndex - 1);
        if (event.key === "ArrowRight") openAt(activeIndex + 1);
    });
    loadWorks();
})();