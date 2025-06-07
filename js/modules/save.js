// Module SaveSystem - Gestion des sauvegardes
const SaveSystem = {
    // État de la sauvegarde
    isSupported: false,
    lastSaveTime: null,
    autoSaveInterval: null,
    
    // Initialisation du module
    init() {
        console.log('💾 Initialisation du système de sauvegarde...');
        this.checkSupport();
        this.setupAutoSave();
    },
    
    // Vérifier le support de localStorage
    checkSupport() {
        try {
            const test = 'test';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            this.isSupported = true;
            console.log('✅ localStorage supporté');
        } catch (error) {
            this.isSupported = false;
            console.warn('⚠️ localStorage non supporté:', error.message);
        }
    },
    
    // Configuration de la sauvegarde automatique
    setupAutoSave() {
        if (GAME_CONFIG.SAVE.AUTO_SAVE && this.isSupported) {
            this.autoSaveInterval = setInterval(() => {
                this.autoSave();
            }, GAME_CONFIG.SAVE.AUTO_SAVE_INTERVAL);
            
            console.log(`🔄 Sauvegarde automatique activée (${GAME_CONFIG.SAVE.AUTO_SAVE_INTERVAL/1000}s)`);
        }
    },
    
    // Sauvegarde manuelle du jeu
    saveGame() {
        if (!this.isSupported) {
            UI.showNotification('❌ Sauvegarde non supportée dans cet environnement', 'error');
            console.error('localStorage non supporté');
            return false;
        }
        
        try {
            const gameData = this.createSaveData();
            const serializedData = JSON.stringify(gameData);
            
            // Vérifier la taille des données
            if (serializedData.length > 5000000) { // 5MB limit
                throw new Error('Données de sauvegarde trop volumineuses');
            }
            
            localStorage.setItem(GAME_CONFIG.SAVE.KEY, serializedData);
            this.lastSaveTime = Date.now();
            
            const saveDate = new Date().toLocaleString();
            UI.showNotification(`💾 Jeu sauvegardé ! (${saveDate})`, 'success');
            
            console.log('💾 Sauvegarde manuelle réussie');
            return true;
            
        } catch (error) {
            console.error('❌ Erreur lors de la sauvegarde:', error);
            UI.showNotification(`❌ Erreur de sauvegarde: ${error.message}`, 'error');
            return false;
        }
    },
    
    // Sauvegarde automatique (silencieuse)
    autoSave() {
        if (!this.isSupported) return false;
        
        try {
            const gameData = this.createSaveData();
            const serializedData = JSON.stringify(gameData);
            
            localStorage.setItem(GAME_CONFIG.SAVE.KEY, serializedData);
            this.lastSaveTime = Date.now();
            
            if (GAME_CONFIG.DEBUG.ENABLED) {
                console.log('💾 Sauvegarde automatique effectuée');
            }
            
            return true;
            
        } catch (error) {
            console.error('❌ Erreur lors de la sauvegarde automatique:', error);
            return false;
        }
    },
    
    // Créer les données de sauvegarde
    createSaveData() {
        return {
            version: GAME_CONFIG.VERSION,
            timestamp: Date.now(),
            gameState: {
                ownedCharacters: Array.from(gameState.ownedCharacters),
                equippedCharacters: Array.from(gameState.equippedCharacters),
                characterEquipment: { ...gameState.characterEquipment },
                totalSummons: gameState.totalSummons,
                legendaryCount: gameState.legendaryCount,
                playerGold: gameState.playerGold,
                crystals: gameState.crystals,
                currentFilter: gameState.currentFilter,
                inventory: gameState.inventory || []
            },
            stats: {
                gachaStats: GachaSystem.getStats(),
                playTime: this.calculatePlayTime(),
                lastPlayed: Date.now()
            },
            settings: {
                debugMode: GAME_CONFIG.DEBUG.ENABLED
            }
        };
    },
    
    // Charger une sauvegarde
    loadGame() {
    if (!this.isSupported) {
        console.warn('localStorage non supporté - impossible de charger');
        return false;
    }
    
    try {
        const saveData = localStorage.getItem(GAME_CONFIG.SAVE.KEY);
        
        if (!saveData) {
            console.log('📁 Aucune sauvegarde trouvée');
            return false;
        }
        
        const gameData = JSON.parse(saveData);
        
        // CORRECTION: Vérifier que gameData.gameState existe
        if (!gameData.gameState) {
            console.warn('⚠️ Sauvegarde invalide - gameState manquant');
            localStorage.removeItem(GAME_CONFIG.SAVE.KEY); // Supprimer la sauvegarde corrompue
            return false;
        }
        
        // Vérifier la version de sauvegarde
        if (!this.isCompatibleVersion(gameData.version)) {
            console.warn(`⚠️ Version de sauvegarde incompatible: ${gameData.version}`);
            UI.showNotification('⚠️ Sauvegarde d\'une version incompatible', 'error');
            return false;
        }
        
        // Arrêter toutes les missions en cours
        if (typeof CombatSystem !== 'undefined' && CombatSystem.stopAllMissions) {
            CombatSystem.stopAllMissions();
        }
        
        // Restaurer l'état du jeu
        this.restoreGameState(gameData.gameState);
            
            // Restaurer l'état du jeu
            this.restoreGameState(gameData.gameState);
            
            // Si pas de personnages, ajouter George
            if (gameState.ownedCharacters.size === 0) {
                this.addGeorgeAsStarter();
            }
            
            const saveDate = new Date(gameData.timestamp).toLocaleString();
            UI.showNotification(`📁 Jeu chargé ! (${saveDate})`, 'success');
            
            console.log('📁 Sauvegarde chargée avec succès');
            return true;
            
        } catch (error) {
            console.error('❌ Erreur lors du chargement:', error);
            UI.showNotification(`❌ Erreur de chargement: ${error.message}`, 'error');
            return false;
        }
    },
    
    // Vérifier la compatibilité de version
    isCompatibleVersion(saveVersion) {
        if (!saveVersion) return false;
        
        const currentMajor = parseInt(GAME_CONFIG.VERSION.split('.')[0]);
        const saveMajor = parseInt(saveVersion.split('.')[0]);
        
        // Compatible si même version majeure
        return currentMajor === saveMajor;
    },
    
    // Restaurer l'état du jeu
    restoreGameState(savedState) {
        gameState.ownedCharacters = new Set(savedState.ownedCharacters || []);
        gameState.equippedCharacters = new Set(savedState.equippedCharacters || []);
        gameState.characterEquipment = savedState.characterEquipment || {};
        gameState.totalSummons = savedState.totalSummons || 0;
        gameState.legendaryCount = savedState.legendaryCount || 0;
        gameState.playerGold = savedState.playerGold || 0;
        gameState.crystals = savedState.crystals || 0;
        gameState.currentFilter = savedState.currentFilter || 'all';
        gameState.inventory = savedState.inventory || [];
        
        // Réinitialiser les missions
        gameState.activeMissions = {};
        gameState.idleMissions = {};
        
        console.log('🔄 État du jeu restauré');
    },
    
    // Ajouter George comme personnage de départ
    addGeorgeAsStarter() {
        const george = findCharacterByName("George le Noob");
        if (george) {
            gameState.ownedCharacters.add("George le Noob");
            gameState.equippedCharacters.add("George le Noob");
            gameState.characterEquipment["George le Noob"] = { 
                weapon: GAME_CONFIG.EQUIPMENT.TYPES.weapon 
            };
            console.log('👤 George ajouté comme personnage de départ');
        }
    },
    
    // Supprimer une sauvegarde
    deleteSave() {
        const confirmed = confirm(
            '⚠️ Êtes-vous sûr de vouloir supprimer la sauvegarde ?\n' +
            'Cette action est irréversible !\n\n' +
            'Votre progression actuelle ne sera pas affectée.'
        );
        
        if (!confirmed) return false;
        
        try {
            if (this.isSupported) {
                localStorage.removeItem(GAME_CONFIG.SAVE.KEY);
                UI.showNotification('🗑️ Sauvegarde supprimée !', 'success');
                console.log('🗑️ Sauvegarde supprimée');
                return true;
            } else {
                UI.showNotification('❌ localStorage non supporté', 'error');
                return false;
            }
        } catch (error) {
            console.error('❌ Erreur lors de la suppression:', error);
            UI.showNotification(`❌ Erreur: ${error.message}`, 'error');
            return false;
        }
    },
    
    // Exporter les données de sauvegarde
    exportSave() {
        try {
            const gameData = this.createSaveData();
            const dataStr = JSON.stringify(gameData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `gacha-save-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            
            UI.showNotification('📤 Sauvegarde exportée !', 'success');
            console.log('📤 Sauvegarde exportée');
            
        } catch (error) {
            console.error('❌ Erreur lors de l\'export:', error);
            UI.showNotification(`❌ Erreur d'export: ${error.message}`, 'error');
        }
    },
    
    // Importer des données de sauvegarde
    importSave(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const gameData = JSON.parse(e.target.result);
                    
                    if (!this.isCompatibleVersion(gameData.version)) {
                        reject(new Error('Version incompatible'));
                        return;
                    }
                    
                    // Arrêter les missions en cours
                    if (typeof CombatSystem !== 'undefined' && CombatSystem.stopAllMissions) {
                        CombatSystem.stopAllMissions();
                    }
                    
                    // Restaurer l'état
                    this.restoreGameState(gameData.gameState);
                    
                    // Sauvegarder immédiatement
                    this.autoSave();
                    
                    UI.showNotification('📥 Sauvegarde importée !', 'success');
                    console.log('📥 Sauvegarde importée');
                    resolve(true);
                    
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = () => reject(new Error('Erreur de lecture du fichier'));
            reader.readAsText(file);
        });
    },
    
    // Obtenir des informations sur la sauvegarde
    getSaveInfo() {
        if (!this.isSupported) {
            return { exists: false, size: 0, lastModified: null };
        }
        
        try {
            const saveData = localStorage.getItem(GAME_CONFIG.SAVE.KEY);
            
            if (!saveData) {
                return { exists: false, size: 0, lastModified: null };
            }
            
            const gameData = JSON.parse(saveData);
            
            return {
                exists: true,
                size: new Blob([saveData]).size,
                lastModified: new Date(gameData.timestamp),
                version: gameData.version,
                charactersOwned: gameData.gameState.ownedCharacters?.length || 0,
                totalSummons: gameData.gameState.totalSummons || 0,
                crystals: gameData.gameState.crystals || 0,
                gold: gameData.gameState.playerGold || 0
            };
            
        } catch (error) {
            console.error('❌ Erreur lors de la lecture des infos:', error);
            return { exists: false, error: error.message };
        }
    },
    
    // Calculer le temps de jeu
    calculatePlayTime() {
        // Simplification: basé sur le nombre d'invocations et l'heure actuelle
        const estimatedMinutes = gameState.totalSummons * 2; // ~2 min par invocation
        return estimatedMinutes;
    },
    
    // Nettoyer les anciennes sauvegardes
    cleanup() {
        if (!this.isSupported) return;
        
        try {
            // Nettoyer les clés orphelines du localStorage
            for (let i = localStorage.length - 1; i >= 0; i--) {
                const key = localStorage.key(i);
                if (key && key.startsWith('gacha') && key !== GAME_CONFIG.SAVE.KEY) {
                    localStorage.removeItem(key);
                    console.log(`🧹 Nettoyage: ${key} supprimé`);
                }
            }
        } catch (error) {
            console.warn('⚠️ Erreur lors du nettoyage:', error);
        }
    },
    
    // Créer une sauvegarde de secours
    createBackup() {
        if (!this.isSupported) return false;
        
        try {
            const saveData = localStorage.getItem(GAME_CONFIG.SAVE.KEY);
            if (saveData) {
                const backupKey = `${GAME_CONFIG.SAVE.KEY}_backup_${Date.now()}`;
                localStorage.setItem(backupKey, saveData);
                console.log('💾 Sauvegarde de secours créée');
                return true;
            }
        } catch (error) {
            console.error('❌ Erreur lors de la création de la sauvegarde de secours:', error);
        }
        
        return false;
    },
    
    // Arrêter la sauvegarde automatique
    stopAutoSave() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
            this.autoSaveInterval = null;
            console.log('⏹️ Sauvegarde automatique arrêtée');
        }
    },
    
    // Redémarrer la sauvegarde automatique
    restartAutoSave() {
        this.stopAutoSave();
        this.setupAutoSave();
    },
    
    // Debug: afficher les détails de la sauvegarde
    debugSaveDetails() {
        if (!GAME_CONFIG.DEBUG.ENABLED) return;
        
        const info = this.getSaveInfo();
        const gameData = this.createSaveData();
        
        console.group('🐛 Détails de sauvegarde');
        console.log('Info:', info);
        console.log('Données actuelles:', gameData);
        console.log('Taille:', JSON.stringify(gameData).length, 'caractères');
        console.groupEnd();
    }
};

console.log('💾 Module SaveSystem chargé');