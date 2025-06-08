// État du jeu
let xp = 0;
let level = 1;
let xpToNext = 10;
let xpPerClick = 1;
let xpPerSec = 0;

// Coûts des upgrades
let costClick = 50;
let costIdle = 20;

// Éléments DOM
const xpEl       = document.getElementById('xp');
const lvlEl      = document.getElementById('level');
const nextXpEl   = document.getElementById('nextXp');
const clickBtn   = document.getElementById('clickXp');
const clickCost  = document.getElementById('clickCost');
const idleCost   = document.getElementById('idleCost');
const clickUpg   = document.getElementById('clickUpgrade');
const idleUpg    = document.getElementById('idleUpgrade');

// Mise à jour de l’affichage
function render() {
  xpEl.textContent     = xp;
  lvlEl.textContent    = level;
  nextXpEl.textContent = xpToNext;
  clickCost.textContent= costClick;
  idleCost.textContent = costIdle;
  
  clickBtn.textContent = `Clique (+${xpPerClick} XP)`;
  idleUpg.disabled     = xp < costIdle;
  clickUpg.disabled    = xp < costClick;
}

// Gain d’XP, check niveau
function gainXp(amount) {
  xp += amount;
  while (xp >= xpToNext) {
    xp -= xpToNext;
    level++;
    xpToNext = Math.floor(xpToNext * 1.5);
  }
  render();
}

// Événements
clickBtn.addEventListener('click', () => gainXp(xpPerClick));

clickUpg.addEventListener('click', () => {
  if (xp >= costClick) {
    xp -= costClick;
    xpPerClick++;
    costClick = Math.floor(costClick * 1.7);
    render();
  }
});

idleUpg.addEventListener('click', () => {
  if (xp >= costIdle) {
    xp -= costIdle;
    xpPerSec++;
    costIdle = Math.floor(costIdle * 1.5);
    render();
  }
});

// Boucle idle
setInterval(() => {
  if (xpPerSec > 0) gainXp(xpPerSec);
}, 1000);

// Init
render();
