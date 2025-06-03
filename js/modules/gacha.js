// Module Gacha - Système d'invocation
const GachaSystem = {
    // Statistiques d'invocation
    stats: {
        totalSummons: 0,
        rarityCount: {
            legendary: 0,
            epic: 0,
            rare: 0,
            common: 0
        }
    },
    
    // Initialisation du module
    init() {
        console.log('🎲 Initialisation du système Gacha...');
        this.validateConfiguration();
    },
    
    // Validation de la configuration
    validateConfiguration() {
        const rates = GAME_CONFIG.GACHA.RARITY_RATES;
        const totalRate = Object.values(rates).reduce((sum, rate) => sum + rate, 0);
        
        if (Math.abs(totalRate - 1.0) > 0.001) {
            console.warn('⚠️ Les taux de rareté ne totalisent pas 100%:', totalRate);
        }
        
        console.log('📊 Taux de rareté configurés:', rates);
    },
    
    // Fonction principale d'invocation x10
    summon10() {
        console.log('🎲 Début de l\'invocation x10...');
        
        // Vérifications préliminaires
        if (!this.canSummon()) {
            return;
        }
        
        // Désactiver le bouton temporairement
        const summonBtn = document.getElementById('summonBtn');
        summonBtn.disabled = true;
        
        try {
            // Déduire le coût
            gameState.crystals -= GAME_CONFIG.GACHA.SUMMON_COST;
            
            // Effectuer les invocations
            const newCharacters = this.performSummons();
            
            // Mettre à jour l'état du jeu
            this.updateGameState(newCharacters);
            
            // Afficher les résultats
            UI.displaySummonResults(newCharacters);
            
            // Mettre à jour l'interface
            UI.updateStats();
            UI.updatePlayerResources();
            
            // Sauvegarder automatiquement
            SaveSystem.autoSave();
            
            console.log(`✨ Invocation réussie: ${newCharacters.length} personnages obtenus`);
            
        } catch (error) {
            console.error('❌ Erreur lors de l\'invocation:', error);
            UI.handleError('Erreur lors de l\'invocation', error);
            
            // Rembourser les cristaux en cas d'erreur
            gameState.crystals += GAME_CONFIG.GACHA.SUMMON_COST;
        } finally {
            // Réactiver le bouton après un délai
            setTimeout(() => {
                summonBtn.disabled = false;
                UI.updateStats(); // Mettre à jour le statut du bouton
            }, 1000);
        }
    },
    
    // Vérifications avant invocation
    canSummon() {
        // Vérifier les personnages restants
        const invocableChars = this.getInvocableCharacters();
        const ownedInvocable = Array.from(gameState.ownedCharacters).filter(name => name !== "George le Noob");
        
        if (ownedInvocable.length >= invocableChars.length) {
            UI.showNotification('🎉 Collection complète ! Tous les personnages ont été obtenus.', 'success');
            return false;
        }
        
        // Vérifier les cristaux
        if (gameState.crystals < GAME_CONFIG.GACHA.SUMMON_COST) {
            const shortage = GAME_CONFIG.GACHA.SUMMON_COST - gameState.crystals;
            UI.showNotification(
                `⚠️ Pas assez de cristaux !\nRequis: ${GAME_CONFIG.GACHA.SUMMON_COST} 💎\nActuels: ${gameState.crystals} 💎\nManque: ${shortage} 💎\n\nCombattez dans l'arène pour obtenir des cristaux !`, 
                'error'
            );
            return false;
        }
        
        return true;
    },
    
    // Obtenir les personnages invocables (sans George)
    getInvocableCharacters() {
        return CHARACTERS_DB.filter(char => char.name !== "George le Noob");
    },
    
    // Effectuer les invocations
    performSummons() {
        const invocableChars = this.getInvocableCharacters();
        const ownedInvocable = Array.from(gameState.ownedCharacters).filter(name => name !== "George le Noob");
        const remainingCharacters = invocableChars.length - ownedInvocable.length;
        const summonCount = Math.min(GAME_CONFIG.GACHA.SUMMON_COUNT, remainingCharacters);
        
        const newCharacters = [];
        
        for (let i = 0; i < summonCount; i++) {
            const character = this.getRandomCharacter();
            if (character) {
                newCharacters.push(character);
                gameState.ownedCharacters.add(character.name);
                
                // Compter les raretés
                if (character.rarity === 'legendary') {
                    gameState.legendaryCount++;
                }
                this.stats.rarityCount[character.rarity]++;
            }
        }
        
        gameState.totalSummons += summonCount;
        this.stats.totalSummons += summonCount;
        
        return newCharacters;
    },
    
    // Obtenir un personnage aléatoire selon les probabilités
    getRandomCharacter() {
        const availableChars = this.getAvailableCharacters();
        
        if (availableChars.length === 0) {
            console.warn('⚠️ Aucun personnage disponible pour l\'invocation');
            return null;
        }
        
        // Générer un nombre aléatoire pour déterminer la rareté
        const rand = Math.random();
        let cumulativeRate = 0;
        
        // Parcourir les raretés selon leurs taux
        for (const [rarity, rate] of Object.entries(GAME_CONFIG.GACHA.RARITY_RATES)) {
            cumulativeRate += rate;
            
            if (rand <= cumulativeRate) {
                const rarityChars = availableChars.filter(char => char.rarity === rarity);
                
                if (rarityChars.length > 0) {
                    const selectedChar = rarityChars[Math.floor(Math.random() * rarityChars.length)];
                    
                    if (GAME_CONFIG.DEBUG.ENABLED) {
                        console.log(`🎲 Tirage: ${rarity} (${Math.round(rate * 100)}%) - ${selectedChar.name}`);
                    }
                    
                    return selectedChar;
                }
            }
        }
        
        // Fallback: retourner un personnage aléatoire disponible
        const fallbackChar = availableChars[Math.floor(Math.random() * availableChars.length)];
        console.log(`🎲 Fallback: ${fallbackChar.name}`);
        return fallbackChar;
    },
    
    // Obtenir les personnages disponibles (non possédés)
    getAvailableCharacters() {
        return CHARACTERS_DB.filter(char => 
            !gameState.ownedCharacters.has(char.name) && 
            char.name !== "George le Noob"
        );
    },
    
    // Mettre à jour l'état du jeu après invocation
    updateGameState(newCharacters) {
        // Les personnages ont déjà été ajoutés dans performSummons()
        // Ici on peut ajouter d'autres logiques si nécessaire
        
        if (GAME_CONFIG.DEBUG.ENABLED) {
            console.log('📊 État après invocation:', {
                totalOwned: gameState.ownedCharacters.size,
                newCharacters: newCharacters.map(c => `${c.name} (${c.rarity})`),
                crystalsRemaining: gameState.crystals
            });
        }
    },
    
    // Obtenir les statistiques d'invocation
    getStats() {
        const totalInvocable = this.getInvocableCharacters().length;
        const totalOwned = Array.from(gameState.ownedCharacters).filter(name => name !== "George le Noob").length;
        
        return {
            totalSummons: this.stats.totalSummons,
            totalCharacters: totalInvocable,
            ownedCharacters: totalOwned,
            collectionPercentage: Math.round((totalOwned / totalInvocable) * 100),
            rarityBreakdown: { ...this.stats.rarityCount },
            averageRarityPerSummon: this.calculateAverageRarity()
        };
    },
    
    // Calculer la rareté moyenne par invocation
    calculateAverageRarity() {
        if (this.stats.totalSummons === 0) return 0;
        
        const rarityValues = { common: 1, rare: 2, epic: 3, legendary: 4 };
        let totalValue = 0;
        
        Object.entries(this.stats.rarityCount).forEach(([rarity, count]) => {
            totalValue += rarityValues[rarity] * count;
        });
        
        return (totalValue / this.stats.totalSummons).toFixed(2);
    },
    
    // Calculer les probabilités réelles vs théoriques
    calculateRealProbabilities() {
        if (this.stats.totalSummons === 0) return {};
        
        const realProbs = {};
        Object.entries(this.stats.rarityCount).forEach(([rarity, count]) => {
            realProbs[rarity] = {
                real: Math.round((count / this.stats.totalSummons) * 100),
                theoretical: Math.round(GAME_CONFIG.GACHA.RARITY_RATES[rarity] * 100),
                count: count
            };
        });
        
        return realProbs;
    },
    
    // Mode debug: forcer une rareté spécifique
    debugSummon(rarity) {
        if (!GAME_CONFIG.DEBUG.ENABLED) {
            console.warn('⚠️ Mode debug désactivé');
            return null;
        }
        
        const availableChars = this.getAvailableCharacters().filter(char => char.rarity === rarity);
        
        if (availableChars.length === 0) {
            console.warn(`⚠️ Aucun personnage ${rarity} disponible`);
            return null;
        }
        
        const character = availableChars[Math.floor(Math.random() * availableChars.length)];
        gameState.ownedCharacters.add(character.name);
        
        console.log(`🐛 Debug summon: ${character.name} (${rarity})`);
        return character;
    },
    
    // Mode debug: simuler de nombreuses invocations
    debugSimulateSummons(count = 1000) {
        if (!GAME_CONFIG.DEBUG.ENABLED) {
            console.warn('⚠️ Mode debug désactivé');
            return;
        }
        
        const results = { legendary: 0, epic: 0, rare: 0, common: 0 };
        
        for (let i = 0; i < count; i++) {
            const rand = Math.random();
            let cumulativeRate = 0;
            
            for (const [rarity, rate] of Object.entries(GAME_CONFIG.GACHA.RARITY_RATES)) {
                cumulativeRate += rate;
                if (rand <= cumulativeRate) {
                    results[rarity]++;
                    break;
                }
            }
        }
        
        console.log(`🧪 Simulation ${count} tirages:`, results);
        
        Object.entries(results).forEach(([rarity, count]) => {
            const percentage = (count / count) * 100;
            const expected = GAME_CONFIG.GACHA.RARITY_RATES[rarity] * 100;
            console.log(`${rarity}: ${percentage.toFixed(1)}% (attendu: ${expected}%)`);
        });
    },
    
    // Réinitialiser les statistiques
    resetStats() {
        this.stats = {
            totalSummons: 0,
            rarityCount: {
                legendary: 0,
                epic: 0,
                rare: 0,
                common: 0
            }
        };
        console.log('📊 Statistiques Gacha réinitialisées');
    }
};

console.log('🎲 Module Gacha chargé');