const crafting = {
    data: null,
    currentActivity: null,
    progressInterval: null,
    boundHandleStartCraft: null,

    async init() {
        // Charger les données du JSON
        const response = await fetch('data/crafting.json');
        this.data = await response.json();

        // Afficher les ressources au chargement
        this.renderResources();
        this.updateDisplay();

    },

    handleStartCraft() {
    // Ici, choisis la ressource à crafter (exemple : la première disponible)
    const resource = this.data.resources[0]; // À adapter selon ta logique
    this.startCrafting(resource);
},

    canCraft(resource) {
        for (const [itemId, needed] of Object.entries(resource.resourcesRequired || {})) {
            const owned = game.player.inventory[itemId] || 0;
            if (owned < needed) {
                // Cherche le nom dans les données
                const allResources = [
                    ...(game.data.mining?.resources || []),
                    ...(game.data.herbalism?.resources || []),
                    ...(game.data.crafting?.resources || []),
                    ...(game.data.smithing?.items || [])
                ];
                const res = allResources.find(r => r.id === itemId);
                return { ok: false, owned, needed, resourceName: res?.name || itemId };
            }
        }
        return { ok: true };
    },

startCrafting(resource) {
    if (this.currentActivity) return;
    const canCraftResult = this.canCraft(resource);
    if (!canCraftResult.ok) {
        this.addToLog(`You don't have enough resources to craft ${resource.name}. Missing: ${canCraftResult.owned}/${canCraftResult.needed} ${canCraftResult.resourceName}`);
        return;
    }
    // Retirer les ressources requises
    for (const [item, qty] of Object.entries(resource.resourcesRequired || {})) {
        if (game.player.inventory[item]) {
            game.player.inventory[item] -= qty;
            if (game.player.inventory[item] < 0) game.player.inventory[item] = 0;
        }
    }
    this.currentActivity = resource;

    // Reset toutes les mini progress bars
    this.data.resources.forEach(res => {
        const bar = document.getElementById(`crafting-progress-bar-${res.id}`);
        if (bar) bar.style.width = '0%';
    });

    this.startProgress(resource.craftingTime, resource);

    setTimeout(() => {
        this.completeCrafting(resource);
    }, resource.craftingTime);

    if (typeof inventory !== 'undefined') {
        inventory.render(); // Met à jour l'inventaire
    }
},

startProgress(duration, resource) {
    const progressBar = document.getElementById(`crafting-progress-bar-${resource.id}`);
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

    completeCrafting(resource) {
        this.currentActivity = null;
        game.addToInventory(resource.id, 1);
        inventory.render();
        // Ajoute l'XP
        this.gainXp(resource.xp);
        this.addToLog(`You crafted ${resource.name} (+${resource.xp} XP)`);
        setTimeout(() => {
            const bar = document.getElementById(`crafting-progress-bar-${resource.id}`);
            if (bar) bar.style.width = '0%';
            this.renderResources(); // Pour mettre à jour les ressources débloquées si besoin
        }, 500);
    },

    gainXp(amount) {
        const skill = game.player.skills.crafting;
        skill.xp += amount;
        // Calcul du seuil pour le prochain niveau (exemple simple)
        let xpForNext = this.getXpForLevel(skill.level + 1);
        while (skill.xp >= xpForNext) {
            skill.xp -= xpForNext;
            skill.level++;
            this.addToLog(`Level up! Crafting is now level ${skill.level}`);
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
        const skill = game.player.skills.crafting;
        document.getElementById('crafting-level').textContent = `Level ${skill.level}`;
        const xpForNext = this.getXpForLevel(skill.level + 1);
        document.getElementById('crafting-xp-bar').style.width = `${(skill.xp / xpForNext) * 100}%`;
        document.getElementById('crafting-xp-text').textContent = `${skill.xp} / ${xpForNext} XP`;
    },

    addToLog(message) {
        const log = document.getElementById('crafting-log');
        if (log) {
            const entry = document.createElement('div');
            entry.textContent = message;
            log.appendChild(entry);
            log.scrollTop = log.scrollHeight;
        }
    },

renderResources() {
    const container = document.getElementById('crafting-resources');
    container.innerHTML = '';
    const playerLevel = game.player.skills.crafting?.level || 1;
    this.data.resources.forEach(resource => {
        const qty = game.player.inventory[resource.id] || 0;
        const div = document.createElement('div');
        div.className = 'resource-item' + (playerLevel >= resource.levelRequired ? ' available' : ' locked');
        div.innerHTML = `
            <span class="resource-icon">${resource.icon || ''}</span>
            <span class="resource-name">${resource.name} <span class="resource-qty">(x${qty})</span></span>
            <span class="resource-level">Lvl ${resource.levelRequired}</span>
            <div class="mini-progress-bar">
                <div id="crafting-progress-bar-${resource.id}" class="mini-progress-fill"></div>
            </div>
        `;
        if (playerLevel >= resource.levelRequired) {
            div.addEventListener('click', () => this.startCrafting(resource));
        }
        container.appendChild(div);
    });
}
};

// Attend que le jeu soit prêt avant d'initialiser crafting
document.addEventListener('game-ready', () => crafting.init());