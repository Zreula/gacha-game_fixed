const herbalism = {
    data: null,
    currentActivity: null,
    progressInterval: null,

    async init() {
        // Charger les données du JSON
        const response = await fetch('data/herbalism.json');
        this.data = await response.json();

        // Afficher les ressources au chargement
        this.renderResources();
        this.updateDisplay();

    },

startGathering(resource) {
    if (this.currentActivity) return;
    this.currentActivity = resource;

    // Reset toutes les mini progress bars
    this.data.resources.forEach(res => {
        const bar = document.getElementById(`herbalism-progress-bar-${res.id}`);
        if (bar) bar.style.width = '0%';
    });

    this.startProgress(resource.gatherTime, resource);

    setTimeout(() => {
        this.completeGathering(resource);
    }, resource.gatherTime);
},

startProgress(duration, resource) {
    const progressBar = document.getElementById(`herbalism-progress-bar-${resource.id}`);
    let startTime = Date.now();
    clearInterval(this.progressInterval);
    this.progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        let progress = (elapsed / duration) * 100;
        if (progress >= 100) {
            progress = 100;
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
        if (progressBar) progressBar.style.width = `${progress}%`;
    }, 100);
},
    completeGathering(resource) {
        this.currentActivity = null;
        game.addToInventory(resource.id, 1);
        inventory.render();
        this.gainXp(resource.xp);
        this.addToLog(`You gathered ${resource.name} (+${resource.xp} XP)`);
        setTimeout(() => {
        const bar = document.getElementById(`herbalism-progress-bar-${resource.id}`);
        if (bar) bar.style.width = '0%';
        this.renderResources(); // Pour mettre à jour les ressources débloquées si besoin
    }, 500);
    },

    gainXp(amount) {
        const skill = game.player.skills.herbalism;
        skill.xp += amount;
        // Calcul du seuil pour le prochain niveau (exemple simple)
        let xpForNext = this.getXpForLevel(skill.level + 1);
        while (skill.xp >= xpForNext) {
            skill.xp -= xpForNext;
            skill.level++;
            this.addToLog(`Level up! Herbalism is now level ${skill.level}`);
            xpForNext = this.getXpForLevel(skill.level + 1);
        }
        this.updateDisplay();
        game.saveGame();
        game.updateDisplay();
    },

    getXpForLevel(level) {
        // Exemple de formule d'XP (tu peux l'ajuster)
        return 100 + (level - 1) * 50;
    },

    updateDisplay() {
        const skill = game.player.skills.herbalism;
        document.getElementById('herbalism-level').textContent = `Level ${skill.level}`;
        const xpForNext = this.getXpForLevel(skill.level + 1);
        document.getElementById('herbalism-xp-bar').style.width = `${(skill.xp / xpForNext) * 100}%`;
        document.getElementById('herbalism-xp-text').textContent = `${skill.xp} / ${xpForNext} XP`;
    },

    addToLog(message) {
        const log = document.getElementById('herbalism-log');
        if (log) {
            const entry = document.createElement('div');
            entry.textContent = message;
            log.appendChild(entry);
            log.scrollTop = log.scrollHeight;
        }
    },

renderResources() {
    const container = document.getElementById('herbalism-resources');
    container.innerHTML = '';
    const playerLevel = game.player.skills.herbalism?.level || 1;
    
    this.data.resources.forEach(resource => {
        const qty = game.player.inventory[resource.id] || 0;
        const div = document.createElement('div');
        div.className = 'resource-item' + (playerLevel >= resource.levelRequired ? ' available' : ' locked');
        div.innerHTML = `
            <span class="resource-icon">${resource.icon || ''}</span>
            <span class="resource-name">${resource.name} <span class="resource-qty">(x${qty})</span></span>
            <span class="resource-level">Lvl ${resource.levelRequired}</span>
            <div class="mini-progress-bar">
                <div id="herbalism-progress-bar-${resource.id}" class="mini-progress-fill"></div>
            </div>
        `;
        if (playerLevel >= resource.levelRequired) {
            div.addEventListener('click', () => this.startGathering(resource));
        }
        container.appendChild(div);
    });
}
};

// Attend que le jeu soit prêt avant d'initialiser herbalism
document.addEventListener('game-ready', () => herbalism.init());