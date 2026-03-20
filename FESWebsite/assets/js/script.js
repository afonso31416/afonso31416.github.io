const menuToggle = document.querySelector(".menu-toggle");
const menuPanel = document.querySelector(".menu-panel");
const btnEn = document.getElementById("btn-en");
const btnPt = document.getElementById("btn-pt");

function applyLanguage(lang) {
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-en][data-pt]").forEach((el) => {
    el.textContent = el.getAttribute(lang === "pt" ? "data-pt" : "data-en");
  });

  if (btnEn && btnPt) {
    btnEn.classList.toggle("active", lang === "en");
    btnPt.classList.toggle("active", lang === "pt");
  }
}

function setLanguage(lang) {
  localStorage.setItem("fes_lang", lang);
  applyLanguage(lang);
}

if (btnEn && btnPt) {
  btnEn.addEventListener("click", () => setLanguage("en"));
  btnPt.addEventListener("click", () => setLanguage("pt"));
}

const preferredLang = localStorage.getItem("fes_lang") || "en";
applyLanguage(preferredLang);

if (menuToggle && menuPanel) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuPanel.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  document.addEventListener("click", (event) => {
    const navRoot = document.querySelector(".nav");
    const clickedInsideNav = navRoot && navRoot.contains(event.target);
    if (!clickedInsideNav && menuPanel.classList.contains("open")) {
      menuPanel.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760 && menuPanel.classList.contains("open")) {
      menuPanel.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
}

const dropdowns = Array.from(document.querySelectorAll(".nav-dropdown"));

if (dropdowns.length > 0) {
  dropdowns.forEach((dropdown) => {
    dropdown.addEventListener("toggle", () => {
      if (!dropdown.open) return;
      dropdowns.forEach((other) => {
        if (other !== dropdown) other.removeAttribute("open");
      });
    });
  });

  document.addEventListener("click", (event) => {
    const clickedInsideAnyDropdown = dropdowns.some((dropdown) =>
      dropdown.contains(event.target)
    );
    if (!clickedInsideAnyDropdown) {
      dropdowns.forEach((dropdown) => dropdown.removeAttribute("open"));
    }
  });

  document.querySelectorAll(".dropdown-menu a").forEach((link) => {
    link.addEventListener("click", () => {
      dropdowns.forEach((dropdown) => dropdown.removeAttribute("open"));
      if (menuPanel && menuPanel.classList.contains("open")) {
        menuPanel.classList.remove("open");
        if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  });
}

const editionSelect = document.getElementById("edition-select");
const editionChips = Array.from(document.querySelectorAll(".edition-chip"));
const pdfFrame = document.getElementById("pdf-frame");

function setEdition(pdfPath) {
  if (!pdfFrame || !pdfPath) return;
  pdfFrame.src = pdfPath;
  if (editionSelect) editionSelect.value = pdfPath;
  editionChips.forEach((chip) => {
    chip.classList.toggle("active", chip.dataset.pdf === pdfPath);
  });
}

if (editionSelect && pdfFrame) {
  editionSelect.addEventListener("change", () => {
    setEdition(editionSelect.value);
  });

  editionChips.forEach((chip) => {
    if (chip.disabled || !chip.dataset.pdf) return;
    chip.addEventListener("click", () => {
      setEdition(chip.dataset.pdf);
    });
  });

  setEdition(editionSelect.value);
}

const subscribeForm = document.getElementById("subscribe-form");
const newsletterEmail = document.getElementById("newsletter-email");
const subscribeStatus = document.getElementById("subscribe-status");

if (subscribeForm && newsletterEmail) {
  subscribeForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = newsletterEmail.value.trim().toLowerCase();
    if (!email) return;

    const key = "fes_newsletter_subscribers";
    const saved = JSON.parse(localStorage.getItem(key) || "[]");
    const exists = saved.some((entry) => entry.email === email);

    if (!exists) {
      saved.push({ email, created_at: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(saved));
    }

    const currentLang = document.documentElement.lang === "pt" ? "pt" : "en";
    if (subscribeStatus) {
      subscribeStatus.textContent =
        currentLang === "pt"
          ? exists
            ? "Este email ja esta subscrito."
            : "Subscricao guardada com sucesso."
          : exists
          ? "This email is already subscribed."
          : "Subscription saved successfully.";
    }

    subscribeForm.reset();
  });
}

const revealGroups = [
  ".hero h1, .hero .subtitle, .hero .lead, .hero .hero-actions .btn, .hero .hero-card",
  "section .section-title",
  ".grid-2 .card, .stats .stat, .timeline .item, .people .person",
  ".newsletter-subscribe, .cta",
];

let previousScrollY = window.scrollY;
let scrollDirection = "down";
let ticking = false;

revealGroups.forEach((selector) => {
  const items = Array.from(document.querySelectorAll(selector));
  items.forEach((item, index) => {
    item.classList.add("reveal");
    item.style.setProperty("--reveal-delay", `${Math.min(index * 80, 320)}ms`);
  });
});

function updateRevealState() {
  const viewportTop = 0;
  const viewportBottom = window.innerHeight;
  const revealStart = viewportBottom * 0.9;
  const revealEnd = viewportBottom * 0.1;

  document.querySelectorAll(".reveal").forEach((el) => {
    const rect = el.getBoundingClientRect();
    const isVisible = rect.top < revealStart && rect.bottom > revealEnd;

    if (isVisible) {
      const fromClass =
        scrollDirection === "down" ? "reveal-from-down" : "reveal-from-up";
      if (!el.classList.contains(fromClass)) {
        el.classList.remove("reveal-from-down", "reveal-from-up", "revealed");
        el.classList.add(fromClass);
        requestAnimationFrame(() => el.classList.add("revealed"));
      } else {
        el.classList.add("revealed");
      }
    } else {
      const fullyOutOfView = rect.bottom <= viewportTop || rect.top >= viewportBottom;
      if (fullyOutOfView) {
        el.classList.remove("revealed");
      }
    }
  });

  ticking = false;
}

window.addEventListener(
  "scroll",
  () => {
    const currentY = window.scrollY;
    if (Math.abs(currentY - previousScrollY) > 1) {
      scrollDirection = currentY > previousScrollY ? "down" : "up";
      previousScrollY = currentY;
    }

    if (!ticking) {
      window.requestAnimationFrame(updateRevealState);
      ticking = true;
    }
  },
  { passive: true }
);

window.addEventListener("resize", () => {
  if (!ticking) {
    window.requestAnimationFrame(updateRevealState);
    ticking = true;
  }
});

updateRevealState();
