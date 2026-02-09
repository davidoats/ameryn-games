const games = document.querySelectorAll(".game");
const menu = document.getElementById("menu");

let selectedGame = null;

function selectGame(game) {
  games.forEach(g => g.classList.remove("selected"));
  game.classList.add("selected");
  selectedGame = game.dataset.game;
  menu.classList.add("active");
}

games.forEach(game => {
  game.addEventListener("click", () => selectGame(game));
});

selectGame(games[0]);

document.getElementById("manual").onclick = () => {
  alert("Manual for " + selectedGame);
};

document.getElementById("open").onclick = () => {
  document.location.href = `https://davidoats.github.io/ameryn-games/${selectedGame}/`
};

document.getElementById("mail").onclick = () => {
  document.location.href = 'https://davidoats.github.io/ameryn-games/Landing/'
};