// Variables globales du jeu
let gameState = {
    ownedCharacters: new Set(),
    equippedCharacters: new Set(),
    characterEquipment: {},
    totalSummons: 0,
    legendaryCount: 0,
    playerGold: 0,
    crystals: 0,
    currentFilter: 'all',
    activeMissions: {},
    idleMissions: {}
};

// Initialisation du jeu
document.addEventListener('DOMContentLoaded', function() {
    console.log(`🎮 Gacha Game v${GAME_CONFIG.VERSION} - Initialisation...`);
    
    // Initialiser les modules dans l'ordre
    initializeGame();
});

function initializeGame() {
    try {
        // 1. Initialiser l'interface utilisateur
        UI.init();
        
        // 2. Initialiser le système de sauvegarde
        SaveSystem.init();
        
        // 3. Charger une sauvegarde existante ou créer un nouveau jeu
        if (!SaveSystem.loadGame()) {
            // Pas de sauvegarde - créer un nouveau jeu avec George
            createNewGame();
        }
        
        // 4. Initialiser les systèmes de jeu
        GachaSystem.init();
        CombatSystem.init();
        CollectionSystem.init();
        
        // 5. Mettre à jour l'interface
        updateAllUI();
        
        // 6. Démarrer la sauvegarde automatique si activée
        if (GAME_CONFIG.SAVE.AUTO_SAVE) {
            startAutoSave();
        }
        
        // 7. Ajouter les gestionnaires d'événements globaux
        setupGlobalEventListeners();
        
        console.log('✅ Jeu initialisé avec succès !');
        
        // Debug mode
        if (GAME_CONFIG.DEBUG.ENABLED) {
            console.log('🐛 Mode debug activé');
            window.gameState = gameState; // Exposer pour debug
            window.GAME_CONFIG = GAME_CONFIG;
        }
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation:', error);
        UI.showNotification('Erreur de chargement du jeu', 'error');
    }
}

function createNewGame() {
    console.log('🆕 Création d\'un nouveau jeu...');
    
    // Réinitialiser l'état du jeu
    gameState.ownedCharacters.clear();
    gameState.equippedCharacters.clear();
    gameState.characterEquipment = {};
    gameState.totalSummons = 0;
    gameState.legendaryCount = 0;
    gameState.playerGold = 0;
    gameState.crystals = 0;
    gameState.currentFilter = 'all';
    
    // Ajouter George le Noob comme personnage de départ
    const george = CHARACTERS_DB.find(char => char.name === "George le Noob");
    if (george) {
        gameState.ownedCharacters.add("George le Noob");
        gameState.equippedCharacters.add("George le Noob");
        gameState.characterEquipment["George le Noob"] = { 
            weapon: GAME_CONFIG.EQUIPMENT.TYPES.weapon 
        };
        console.log('👤 George le Noob ajouté comme personnage de départ');
    }
}

function updateAllUI() {
    // Mettre à jour tous les éléments d'interface
    UI.updateStats();
    UI.updatePlayerResources();
    CollectionSystem.updateCollection();
    CombatSystem.updateCombatInfo();
}

function startAutoSave() {
    setInterval(() => {
        SaveSystem.autoSave();
    }, GAME_CONFIG.SAVE.AUTO_SAVE_INTERVAL);
    
    console.log(`💾 Sauvegarde automatique activée (${GAME_CONFIG.SAVE.AUTO_SAVE_INTERVAL/1000}s)`);
}

function setupGlobalEventListeners() {
    // Gestion des onglets
    document.getElementById('tabInvocation').addEventListener('click', () => {
        UI.switchTab('invocation');
    });
    
    document.getElementById('tabCollection').addEventListener('click', () => {
        UI.switchTab('collection');
    });
    
    document.getElementById('tabCombat').addEventListener('click', () => {
        UI.switchTab('combat');
        CombatSystem.updateCombatInfo();
    });
    
    // Boutons de sauvegarde
    document.getElementById('saveBtn').addEventListener('click', () => SaveSystem.saveGame());
    document.getElementById('loadBtn').addEventListener('click', () => SaveSystem.loadGame());
    document.getElementById('deleteBtn').addEventListener('click', () => SaveSystem.deleteSave());
    
    // Bouton de reset
    document.getElementById('resetBtn').addEventListener('click', resetGame);
    
    // ✅ CORRECTION: Bouton d'invocation avec arrow function
    document.getElementById('summonBtn').addEventListener('click', () => {
        GachaSystem.summon10();
    });
    
    // Filtres de collection
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const filter = e.target.dataset.filter;
            CollectionSystem.filterCollection(filter);
        });
    });
    
    // Fermeture de la modal
    document.getElementById('closeModal').addEventListener('click', () => UI.closeCharacterModal());
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('characterModal');
        if (e.target === modal) {
            UI.closeCharacterModal();
        }
    });
    
    // Gestion de la fermeture de page
    window.addEventListener('beforeunload', () => {
        if (GAME_CONFIG.SAVE.AUTO_SAVE) {
            SaveSystem.autoSave();
        }
    });
    
    console.log('🎮 Gestionnaires d\'événements configurés');
}

function resetGame() {
    if (confirm('⚠️ Êtes-vous sûr de vouloir réinitialiser complètement le jeu ?\nToutes vos données seront perdues !')) {
        // Arrêter toutes les missions
        CombatSystem.stopAllMissions();
        
        // Créer un nouveau jeu
        createNewGame();
        
        // Mettre à jour l'interface
        updateAllUI();
        
        // Sauvegarder
        SaveSystem.autoSave();
        
        UI.showNotification('🔄 Jeu réinitialisé !', 'success');
        console.log('🔄 Jeu réinitialisé');
    }
}

// Fonctions utilitaires globales
window.GameUtils = {
    // Accès facile à l'état du jeu
    getGameState: () => gameState,
    
    // Fonctions de debug
    addCrystals: (amount) => {
        if (GAME_CONFIG.DEBUG.ENABLED) {
            gameState.crystals += amount;
            UI.updatePlayerResources();
            console.log(`💎 +${amount} cristaux ajoutés (debug)`);
        }
    },
    
    addGold: (amount) => {
        if (GAME_CONFIG.DEBUG.ENABLED) {
            gameState.playerGold += amount;
            UI.updatePlayerResources();
            console.log(`💰 +${amount} or ajouté (debug)`);
        }
    },
    
    unlockAllCharacters: () => {
        if (GAME_CONFIG.DEBUG.ENABLED) {
            CHARACTERS_DB.forEach(char => {
                if (char.name !== "George le Noob") {
                    gameState.ownedCharacters.add(char.name);
                }
            });
            CollectionSystem.updateCollection();
            UI.updateStats();
            console.log('🔓 Tous les personnages débloqués (debug)');
        }
    }
};

// Exposer les modules principaux pour l'accès externe
window.Game = {
    state: gameState,
    config: GAME_CONFIG,
    modules: {
        UI,
        SaveSystem,
        GachaSystem,
        CombatSystem,
        CollectionSystem
    },
    utils: window.GameUtils
};