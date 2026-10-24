// ===============================
// 1. MOBILE NAVIGATION MENU
// ===============================

const menuToggle = document.querySelector("#menu-toggle");
const navLinks = document.querySelector("#nav-links");
const navItems = document.querySelectorAll(".nav-link");

function closeMenu() {
  navLinks.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
}

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation menu" : "Open navigation menu"
  );
});

navItems.forEach((link) => {
  link.addEventListener("click", () => {
    closeMenu();
  });
});

// Close the menu when clicking outside it.
document.addEventListener("click", (event) => {
  const clickedInsideMenu = navLinks.contains(event.target);
  const clickedToggle = menuToggle.contains(event.target);

  if (!clickedInsideMenu && !clickedToggle) {
    closeMenu();
  }
});

// Close the mobile menu when returning to desktop width.
window.addEventListener("resize", () => {
  if (window.innerWidth > 800) {
    closeMenu();
  }
});


// ===============================
// 2. DARK MODE
// ===============================

const themeToggle = document.querySelector("#theme-toggle");
const THEME_KEY = "asal-portfolio-theme";

// localStorage can throw (private browsing, blocked storage),
// so reads and writes are wrapped in try/catch.
function getSavedTheme() {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch (error) {
    return null;
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    // Ignore: the theme still works for this visit.
  }
}

// Restore the previously selected theme.
if (getSavedTheme() === "dark") {
  document.body.classList.add("dark-theme");
}

function updateThemeButton() {
  const isDark = document.body.classList.contains("dark-theme");

  themeToggle.textContent = isDark ? "☀" : "☾";
  themeToggle.setAttribute(
    "aria-label",
    isDark ? "Switch to light mode" : "Switch to dark mode"
  );
}

updateThemeButton();

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");

  const isDark = document.body.classList.contains("dark-theme");

  saveTheme(isDark ? "dark" : "light");
  updateThemeButton();
});


// ===============================
// 3. TYPING EFFECT
// ===============================

const typingText = document.querySelector("#typing-text");

const phrases = [
  "Web Developer",
  "Lifelong Learner",
  "Future Programmer",
  "Youth Empowerment Advocate"
];

let phraseIndex = 0;
let characterIndex = 0;
let isDeleting = false;

function typeEffect() {
  const currentPhrase = phrases[phraseIndex];

  if (isDeleting) {
    characterIndex--;
  } else {
    characterIndex++;
  }

  typingText.textContent = currentPhrase.substring(0, characterIndex);

  let delay = isDeleting ? 45 : 85;

  if (!isDeleting && characterIndex === currentPhrase.length) {
    isDeleting = true;
    delay = 1400;
  } else if (isDeleting && characterIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    delay = 400;
  }

  window.setTimeout(typeEffect, delay);
}

// Respect reduced-motion preferences.
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (reducedMotion.matches) {
  typingText.textContent = phrases[0];
} else {
  typeEffect();
}


// ===============================
// 4. SCROLL REVEAL ANIMATIONS
// ===============================

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && !reducedMotion.matches) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach((element) => {
    element.classList.add("show");
  });
}


// ===============================
// 5. ACTIVE NAVIGATION LINK
// ===============================

const sections = document.querySelectorAll("main section[id]");

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;

          navItems.forEach((link) => {
            const isActive = link.getAttribute("href") === `#${sectionId}`;

            link.classList.toggle("active", isActive);
          });
        }
      });
    },
    {
      rootMargin: "-25% 0px -60% 0px"
    }
  );

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });
}


// ===============================
// 6. BACK-TO-TOP BUTTON
// ===============================

const backToTop = document.querySelector("#back-to-top");

function updateBackToTop() {
  if (window.scrollY > 400) {
    backToTop.classList.add("visible");
  } else {
    backToTop.classList.remove("visible");
  }
}

window.addEventListener("scroll", updateBackToTop, {
  passive: true
});

updateBackToTop();

backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: reducedMotion.matches ? "auto" : "smooth"
  });
});


// ===============================
// 7. AUTOMATIC FOOTER YEAR
// ===============================

const currentYear = document.querySelector("#current-year");

currentYear.textContent = new Date().getFullYear();


// ===============================
// 8. CONTACT FORM
// ===============================

const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    return;
  }

  const name = document.querySelector("#name").value.trim();
  const email = document.querySelector("#email").value.trim();
  const message = document.querySelector("#message").value.trim();

  if (!name || !email || !message) {
    formStatus.textContent = "Please complete all fields.";
    return;
  }

  const subject = encodeURIComponent(`Portfolio message from ${name}`);

  const body = encodeURIComponent(
    `Hello Asal,\n\n${message}\n\nFrom: ${name}\nEmail: ${email}`
  );

  const emailLink =
    `mailto:asalakkhaja@gmail.com?subject=${subject}&body=${body}`;

  formStatus.textContent =
    "Your email app should open with your message prepared.";

  window.location.href = emailLink;
});