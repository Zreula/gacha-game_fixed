const game = {
    player: {
        level: 1,
        skills: {
            mining: {
                level: 1,
                xp: 0
            },
            herbalism: {
                level: 1,
                xp: 0
            },
            crafting: {
                level: 1,
                xp: 0
            },
            smithing: {
                level: 1,
                xp: 0
            }
        },
        inventory: {}
    },
    
    data: {},
    
    async init() {
        await this.loadData();
        this.loadGame();
        this.updateDisplay();
        // Ne déclenche PAS ici l'événement game-ready
    },
    
    async loadData() {
        try {
            const miningRes = await fetch('data/mining.json');
            this.data.mining = await miningRes.json();
            const herbalismRes = await fetch('data/herbalism.json');
            this.data.herbalism = await herbalismRes.json();
            const craftingRes = await fetch('data/crafting.json');
            this.data.crafting = await craftingRes.json();
            const smithingRes = await fetch('data/smithing.json');
            this.data.smithing = await smithingRes.json();
        } catch (error) {
            console.error('Error loading data:', error);
        }
    },
    
    saveGame() {
    localStorage.setItem('infernalWow', JSON.stringify(this.player));
    },
    
    loadGame() {
        const saved = localStorage.getItem('infernalWow');
        if (saved) {
            const savedPlayer = JSON.parse(saved);
            // Fusionne chaque skill individuellement pour garder les nouveaux skills
            for (const skill in this.player.skills) {
                if (savedPlayer.skills && savedPlayer.skills[skill]) {
                    this.player.skills[skill] = { ...this.player.skills[skill], ...savedPlayer.skills[skill] };
                }
            }
            // Fusionne le reste du joueur (hors skills)
            this.player = { ...this.player, ...savedPlayer, skills: this.player.skills };
        }
    },

    addToInventory(item, amount = 1) {
        if (!this.player.inventory[item]) {
            this.player.inventory[item] = 0;
        }
        this.player.inventory[item] += amount;
        this.saveGame();
    },

    getGlobalLevel() {
        let total = 0;
        for (const skill of Object.values(this.player.skills)) {
            total += skill.level || 0;
        }
        // Ajoute ici d'autres niveaux si tu veux (ex: this.player.level)
        return total;
    },

    updateDisplay() {
    // ...autres updates...
    const globalLevelEl = document.getElementById('player-global-level');
    if (globalLevelEl) globalLevelEl.textContent = `Global Level: ${this.getGlobalLevel()}`;
    this.updateSidebarLevels();
    },

    updateSidebarLevels() {
    document.getElementById('nav-mining-level').textContent = game.player.skills.mining.level;
    document.getElementById('nav-herbalism-level').textContent = game.player.skills.herbalism.level;
    document.getElementById('nav-crafting-level').textContent = game.player.skills.crafting.level;
    document.getElementById('nav-smithing-level').textContent = game.player.skills.smithing.level;
    }
};

// Navigation entre les sections
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
        const sectionId = this.getAttribute('data-section');
        document.getElementById(sectionId).classList.add('active');
            // Appelle les méthodes d'affichage du skill actif
            if (sectionId === 'mining-section' && mining.renderResources) {
            mining.renderResources();
            mining.updateDisplay();
        }
        if (sectionId === 'herbalism-section' && herbalism.renderResources) {
            herbalism.renderResources();
            herbalism.updateDisplay();
        }
        if (sectionId === 'crafting-section' && crafting.renderResources) {
            crafting.renderResources();
            crafting.updateDisplay();
        }
        if (sectionId === 'smithing-section' && smithing.renderResources) {
            smithing.renderResources();
            smithing.updateDisplay();
        }
        if (sectionId === 'inventory-section' && inventory.render) inventory.render();
    });
});

// Auto-save every 30 seconds
setInterval(() => game.saveGame(), 30000);

// Initialize game when page loads, puis déclenche l'événement 'game-ready'
window.addEventListener('DOMContentLoaded', async () => {
    await game.init();
    document.dispatchEvent(new Event('game-ready'));
    // Appelle directement les inits ici :
    mining.init();
    herbalism.init();
    crafting.init();
    smithing.init();
});