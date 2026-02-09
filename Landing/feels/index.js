const envelope = document.getElementById("envelope");
const flap = document.getElementById("flap");
const letter = document.querySelector(".letter");

// Prevent clicks inside the letter from closing/opening
letter.addEventListener("click", (e) => {
  e.stopPropagation();
});

envelope.addEventListener("click", () => {
  const opening = !envelope.classList.contains("open");

  if (opening) {
    flap.classList.add("behind");
    envelope.classList.add("open");
  } else {
    // CLOSE instantly hide letter
    letter.style.transition = "none";
    envelope.classList.remove("open");

    letter.offsetHeight; // force reflow

    letter.style.transition = "transform 0.8s ease";

    setTimeout(() => {
      flap.classList.remove("behind");
    }, 800);
  }
});