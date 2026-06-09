const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const googleFormButton = document.querySelector("#google-form-button");
const formNote = document.querySelector("#form-note");
const currentFile = window.location.pathname.split("/").pop() || "index.html";
const GOOGLE_FORM_URL = "";

document.querySelectorAll(".nav-links a").forEach((link) => {
  const linkFile = new URL(link.href).pathname.split("/").pop() || "index.html";

  if (linkFile === currentFile) {
    link.setAttribute("aria-current", "page");
  }
});

menuToggle?.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    navLinks.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  }
});

googleFormButton?.addEventListener("click", () => {
  if (!GOOGLE_FORM_URL) {
    formNote.textContent = "The registration form link is being connected. Please use the Contact page for now.";
    return;
  }

  window.open(GOOGLE_FORM_URL, "_blank", "noopener,noreferrer");
});
