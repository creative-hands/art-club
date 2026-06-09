const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const form = document.querySelector("#registration-form");
const formNote = document.querySelector("#form-note");
const currentFile = window.location.pathname.split("/").pop() || "index.html";

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

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const data = new FormData(form);
  const subject = `Art class registration request for ${data.get("studentName")}`;
  const body = [
    "Hello Creative Hands Art Club,",
    "",
    "I would like to register or request details for an art class.",
    "",
    `Student name: ${data.get("studentName")}`,
    `Parent/adult contact: ${data.get("guardianName")}`,
    `Email: ${data.get("email")}`,
    `Phone: ${data.get("phone") || "Not provided"}`,
    `Age group: ${data.get("ageGroup")}`,
    `Class interest: ${data.get("classType")}`,
    `Preferred day: ${data.get("preferredDay")}`,
    `Notes: ${data.get("message") || "None"}`,
    "",
    "Thank you."
  ].join("\n");

  const mailto = new URL("mailto:hello@creativehands.art");
  mailto.searchParams.set("subject", subject);
  mailto.searchParams.set("body", body);

  formNote.textContent = "Opening your email app with the registration details.";
  window.location.href = mailto.toString();
});
