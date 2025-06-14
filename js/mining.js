const mining = {
    data: null,
    currentActivity: null,
    progressInterval: null,

    async init() {
        // Charger les données du JSON
        const response = await fetch('data/mining.json');
        this.data = await response.json();

        // Afficher les ressources au chargement
        this.renderResources();
        this.updateDisplay();
    },

startMining(resource) {
    if (this.currentActivity) return;
    this.currentActivity = resource;

    // Reset toutes les mini progress bars
    this.data.resources.forEach(res => {
        const bar = document.getElementById(`mining-progress-bar-${res.id}`);
        if (bar) bar.style.width = '0%';
    });

    this.startProgress(resource.miningTime, resource);

    setTimeout(() => {
        this.completeMining(resource);
        // Ici SEULEMENT, tu peux rafraîchir la liste si besoin
    }, resource.miningTime);
},

startProgress(duration, resource) {
    const progressBar = document.getElementById(`mining-progress-bar-${resource.id}`);
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

    completeMining(resource) {
        this.currentActivity = null;
        game.addToInventory(resource.id, 1);
        inventory.render();
        // Ajoute l'XP
        this.gainXp(resource.xp);
        this.addToLog(`You mined ${resource.name} (+${resource.xp} XP)`);
        setTimeout(() => {
            const bar = document.getElementById(`mining-progress-bar-${resource.id}`);
            if (bar) bar.style.width = '0%';
            this.renderResources(); // Pour mettre à jour les ressources débloquées si besoin
        }, 500);
    },

    gainXp(amount) {
        const skill = game.player.skills.mining;
        skill.xp += amount;
        // Calcul du seuil pour le prochain niveau (exemple simple)
        let xpForNext = this.getXpForLevel(skill.level + 1);
        while (skill.xp >= xpForNext) {
            skill.xp -= xpForNext;
            skill.level++;
            this.addToLog(`Level up! Mining is now level ${skill.level}`);
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
        const skill = game.player.skills.mining;
        document.getElementById('mining-level').textContent = `Level ${skill.level}`;
        const xpForNext = this.getXpForLevel(skill.level + 1);
        document.getElementById('mining-xp-bar').style.width = `${(skill.xp / xpForNext) * 100}%`;
        document.getElementById('mining-xp-text').textContent = `${skill.xp} / ${xpForNext} XP`;
    },

    addToLog(message) {
        const log = document.getElementById('mining-log');
        if (log) {
            const entry = document.createElement('div');
            entry.textContent = message;
            log.appendChild(entry);
            log.scrollTop = log.scrollHeight;
        }
    },

renderResources() {
    const container = document.getElementById('mining-resources');
    container.innerHTML = '';
    const playerLevel = game.player.skills.mining?.level || 1;

    this.data.resources.forEach(resource => {
        const qty = game.player.inventory[resource.id] || 0;
        const div = document.createElement('div');
        div.className = 'resource-item' + (playerLevel >= resource.levelRequired ? ' available' : ' locked');
        div.innerHTML = `
            <span class="resource-icon">${resource.icon || ''}</span>
            <span class="resource-name">${resource.name} <span class="resource-qty">(x${qty})</span></span>
            <span class="resource-level">Lvl ${resource.levelRequired}</span>
            <div class="mini-progress-bar">
                <div id="mining-progress-bar-${resource.id}" class="mini-progress-fill"></div>
            </div>
        `;
        if (playerLevel >= resource.levelRequired) {
            div.addEventListener('click', () => this.startMining(resource));
        }
        container.appendChild(div);
    });
}
};

// Attend que le jeu soit prêt avant d'initialiser mining
document.addEventListener('game-ready', () => mining.init());