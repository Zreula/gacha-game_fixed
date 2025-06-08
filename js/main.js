// Variables globales du jeu
let gameState = {
    ownedCharacters: new Set(),
    equippedCharacters: new Set(),
    characterEquipment: {},
    totalSummons: 0,
    legendaryCount: 0,
    playerGold: 256,  // Valeur par défaut pour test
    crystals: 2,      // Valeur par défaut pour test
    currentFilter: 'all',
    activeMissions: {},
    idleMissions: {}
};

// Initialisation du jeu
document.addEventListener('DOMContentLoaded', function() {
    console.log(`🎮 Gacha Game v${GAME_CONFIG ? GAME_CONFIG.VERSION : '1.0.0'} - Initialisation...`);
    
    // Attendre que tous les scripts soient chargés
    setTimeout(() => {
        initializeGame();
    }, 100);
});

function initializeGame() {
    try {
        console.log('🚀 Début de l\'initialisation...');
        
        // Vérifier que les modules sont chargés
        if (typeof UI === 'undefined') {
            console.warn('⚠️ Module UI non chargé, initialisation basique...');
            initializeBasicGame();
            return;
        }
        
        // 1. Initialiser l'interface utilisateur
        UI.init();
        EquipmentSystem.init();
        ShopSystem.init();

        // 2. Initialiser le système de sauvegarde
        if (typeof SaveSystem !== 'undefined') {
            SaveSystem.init();
            
            // 3. Charger une sauvegarde existante ou créer un nouveau jeu
            if (!SaveSystem.loadGame()) {
                createNewGame();
            }
        } else {
            console.warn('⚠️ SaveSystem non chargé, création d\'un nouveau jeu...');
            createNewGame();
        }
        
        // 4. Initialiser les systèmes de jeu
        if (typeof GachaSystem !== 'undefined') GachaSystem.init();
        if (typeof CombatSystem !== 'undefined') CombatSystem.init();
        if (typeof CollectionSystem !== 'undefined') CollectionSystem.init();
        if (typeof EquipmentSystem !== 'undefined') EquipmentSystem.init();
        if (typeof ShopSystem !== 'undefined') ShopSystem.init();
        
        // 5. Mettre à jour l'interface
        updateAllUI();
        
        // 6. Démarrer la sauvegarde automatique si activée
        if (GAME_CONFIG && GAME_CONFIG.SAVE && GAME_CONFIG.SAVE.AUTO_SAVE && typeof SaveSystem !== 'undefined') {
            startAutoSave();
        }
        
        // 7. Ajouter les gestionnaires d'événements globaux
        setupGlobalEventListeners();
        
        console.log('✅ Jeu initialisé avec succès !');
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation:', error);
        console.log('🔧 Tentative d\'initialisation basique...');
        initializeBasicGame();
    }
}

function initializeBasicGame() {
    // Initialisation minimale si les modules principaux ne sont pas chargés
    console.log('🔧 Mode de récupération activé...');
    
    createNewGame();
    updateBasicUI();
    setupBasicEventListeners();
    
    console.log('✅ Initialisation basique terminée');
}

function createNewGame() {
    console.log('🆕 Création d\'un nouveau jeu...');
    
    // Réinitialiser l'état du jeu
    gameState.ownedCharacters.clear();
    gameState.equippedCharacters.clear();
    gameState.characterEquipment = {};
    gameState.totalSummons = 0;
    gameState.legendaryCount = 0;
    gameState.playerGold = 256;
    gameState.crystals = 2;
    gameState.currentFilter = 'all';
    
    // Ajouter George le Noob comme personnage de départ
    if (typeof CHARACTERS_DB !== 'undefined') {
        const george = CHARACTERS_DB.find(char => char.name === "George le Noob");
        if (george) {
            gameState.ownedCharacters.add("George le Noob");
            gameState.equippedCharacters.add("George le Noob");
            gameState.characterEquipment["George le Noob"] = { 
                weapon: "⚔️"
            };
            console.log('👤 George le Noob ajouté comme personnage de départ');
        }
    }
}

function updateAllUI() {
    // Mettre à jour tous les éléments d'interface (avec vérifications)
    if (typeof UI !== 'undefined') {
        UI.updateStats();
        UI.updatePlayerResources();
    }
    
    if (typeof CollectionSystem !== 'undefined') {
        CollectionSystem.updateCollection();
    }
    
    if (typeof CombatSystem !== 'undefined') {
        CombatSystem.updateCombatInfo();
    }
    
    // Fallback si UI n'est pas disponible
    updateBasicUI();
}

function updateBasicUI() {
    // Mise à jour basique des éléments essentiels
    const elements = {
        playerGold: document.getElementById('playerGold'),
        playerCrystals: document.getElementById('playerCrystals'),
        totalSummons: document.getElementById('totalSummons'),
        uniqueCount: document.getElementById('uniqueCount'),
        legendaryCount: document.getElementById('legendaryCount')
    };
    
    if (elements.playerGold) elements.playerGold.textContent = gameState.playerGold;
    if (elements.playerCrystals) elements.playerCrystals.textContent = gameState.crystals;
    if (elements.totalSummons) elements.totalSummons.textContent = gameState.totalSummons;
    if (elements.uniqueCount) elements.uniqueCount.textContent = gameState.ownedCharacters.size;
    if (elements.legendaryCount) elements.legendaryCount.textContent = gameState.legendaryCount;
}

function startAutoSave() {
    if (typeof SaveSystem === 'undefined') return;
    
    setInterval(() => {
        SaveSystem.autoSave();
    }, 30000); // 30 secondes
    
    console.log('💾 Sauvegarde automatique activée (30s)');
}

function setupGlobalEventListeners() {
    console.log('🎮 Configuration des gestionnaires d\'événements...');
    
    // Helper function pour ajouter des listeners de façon sécurisée
    function safeAddEventListener(elementId, event, handler) {
        const element = document.getElementById(elementId);
        if (element) {
            element.addEventListener(event, handler);
            console.log(`✅ Event listener ajouté: ${elementId}`);
        } else {
            console.warn(`⚠️ Élément non trouvé: ${elementId}`);
        }
    }
    
    // Gestion des onglets
    safeAddEventListener('tabInvocation', 'click', () => {
        if (typeof UI !== 'undefined') UI.switchTab('invocation');
    });
    
    safeAddEventListener('tabCollection', 'click', () => {
        if (typeof UI !== 'undefined') UI.switchTab('collection');
    });
    
    safeAddEventListener('tabCombat', 'click', () => {
        if (typeof UI !== 'undefined') UI.switchTab('combat');
        if (typeof CombatSystem !== 'undefined') CombatSystem.updateCombatInfo();
    });

    // Ajouter cette ligne avec les autres gestionnaires d'onglets
    safeAddEventListener('tabEquipment', 'click', () => {
        if (typeof UI !== 'undefined' && UI.switchTab) {
            UI.switchTab('equipment');
        }
        if (typeof UI !== 'undefined' && UI.updateEquipmentTab) {
            UI.updateEquipmentTab();
        }
        // EventManager.emit('tab_changed', 'equipment');
    });
    
    // Boutons de sauvegarde
    safeAddEventListener('saveBtn', 'click', () => {
        if (typeof SaveSystem !== 'undefined') SaveSystem.saveGame();
    });
    
    safeAddEventListener('loadBtn', 'click', () => {
        if (typeof SaveSystem !== 'undefined') SaveSystem.loadGame();
    });
    
    safeAddEventListener('deleteBtn', 'click', () => {
        if (typeof SaveSystem !== 'undefined') SaveSystem.deleteSave();
    });
    
    // Bouton de reset
    safeAddEventListener('resetBtn', 'click', resetGame);
    
    // Bouton d'invocation
    safeAddEventListener('summonBtn', 'click', () => {
        if (typeof GachaSystem !== 'undefined') {
            GachaSystem.summon10();
        } else {
            console.log('🎲 Système Gacha non disponible');
        }
    });
    
    // Filtres de collection
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const filter = e.target.dataset.filter;
            if (typeof CollectionSystem !== 'undefined') {
                CollectionSystem.filterCollection(filter);
            }
        });
    });
    
    // Fermeture de la modal
    safeAddEventListener('closeModal', 'click', () => {
        if (typeof UI !== 'undefined') UI.closeCharacterModal();
    });
    
    // Clic en dehors de la modal
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('characterModal');
        if (modal && e.target === modal && typeof UI !== 'undefined') {
            UI.closeCharacterModal();
        }
    });
    
    // Gestion de la fermeture de page
    window.addEventListener('beforeunload', () => {
        if (typeof SaveSystem !== 'undefined' && GAME_CONFIG && GAME_CONFIG.SAVE && GAME_CONFIG.SAVE.AUTO_SAVE) {
            SaveSystem.autoSave();
        }
    });

    safeAddEventListener('closeInventoryModal', 'click', () => {
    if (typeof UI !== 'undefined' && UI.closeInventoryModal) {
        UI.closeInventoryModal();
    }
    });
    
    console.log('🎮 Gestionnaires d\'événements configurés');
}

function setupBasicEventListeners() {
    // Version simplifiée pour le mode de récupération
    const summonBtn = document.getElementById('summonBtn');
    if (summonBtn) {
        summonBtn.addEventListener('click', () => {
            console.log('🎲 Invocation demandée (mode basique)');
            alert('Système de jeu en cours de chargement...');
        });
    }
}

function resetGame() {
    if (confirm('⚠️ Êtes-vous sûr de vouloir réinitialiser complètement le jeu ?\nToutes vos données seront perdues !')) {
        // Arrêter toutes les missions
        if (typeof CombatSystem !== 'undefined') {
            CombatSystem.stopAllMissions();
        }
        
        // Créer un nouveau jeu
        createNewGame();
        
        // Mettre à jour l'interface
        updateAllUI();
        
        // Sauvegarder
        if (typeof SaveSystem !== 'undefined') {
            SaveSystem.autoSave();
        }
        
        if (typeof UI !== 'undefined') {
            UI.showNotification('🔄 Jeu réinitialisé !', 'success');
        }
        console.log('🔄 Jeu réinitialisé');
    }
}

// Fonctions utilitaires globales
window.GameUtils = {
    getGameState: () => gameState,
    addCrystals: (amount) => {
        gameState.crystals += amount;
        updateBasicUI();
        console.log(`💎 +${amount} cristaux ajoutés`);
    },
    addGold: (amount) => {
        gameState.playerGold += amount;
        updateBasicUI();
        console.log(`💰 +${amount} or ajouté`);
    }
};

// Exposer les modules principaux pour l'accès externe
window.Game = {
    state: gameState,
    config: typeof GAME_CONFIG !== 'undefined' ? GAME_CONFIG : null,
    utils: window.GameUtils
};

console.log('🎮 Main.js chargé avec gestion d\'erreurs améliorée');