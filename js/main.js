// Initialisation du jeu
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('game-container');
  // Exemple de boucle idle : compteur d'expérience
  let exp = 0;
  const expDisplay = document.createElement('div');
  expDisplay.textContent = `Expérience : ${exp}`;
  container.appendChild(expDisplay);
  setInterval(() => {
    exp++;
    expDisplay.textContent = `Expérience : ${exp}`;
  }, 1000);
});