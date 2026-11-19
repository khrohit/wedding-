window.addEventListener("load", () => {
  document.getElementById("loader").classList.add("hide");
});

// Change this date to your wedding date (month is 0-based in JavaScript).
const weddingDate = new Date("December 20, 2026 18:00:00").getTime();
function updateCountdown() {
  const distance = weddingDate - Date.now();
  const values = distance > 0 ? {
    days: Math.floor(distance / 86400000),
    hours: Math.floor((distance % 86400000) / 3600000),
    minutes: Math.floor((distance % 3600000) / 60000),
    seconds: Math.floor((distance % 60000) / 1000)
  } : { days: 0, hours: 0, minutes: 0, seconds: 0 };
  Object.entries(values).forEach(([key, value]) => {
    document.getElementById(key).textContent = String(value).padStart(2, "0");
  });
}
updateCountdown();
setInterval(updateCountdown, 1000);

// Reveal sections as they enter the viewport.
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

// Mobile navigation.
const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
menuButton.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
});
navLinks.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  navLinks.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
}));

// Demo RSVP only: connect this form to your backend/API to save responses.
document.getElementById("rsvpForm").addEventListener("submit", event => {
  event.preventDefault();
  const name = new FormData(event.currentTarget).get("name");
  document.getElementById("formNote").textContent =
    `Thank you, ${name}! Your demo RSVP has been received on this page.`;
  event.currentTarget.reset();
});
