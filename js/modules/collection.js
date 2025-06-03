// Module CollectionSystem - Gestion de la collection et de l'équipement
const CollectionSystem = {
    // Filtres disponibles
    availableFilters: ['all', 'legendary', 'epic', 'rare', 'common', 'equipped'],
    
    // Initialisation du module
    init() {
        console.log('📚 Initialisation du système de collection...');
        this.setupFilterEvents();
        this.updateCollection();
    },
    
    // Configuration des événements de filtrage
    setupFilterEvents() {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.filterCollection(filter);
            });
        });
    },
    
    // Filtrer la collection
    filterCollection(filter) {
        console.log(`🔍 Filtrage: ${filter}`);
        
        gameState.currentFilter = filter;
        
        // Mettre à jour l'état des boutons de filtre
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === filter) {
                btn.classList.add('active');
            }
        });
        
        // Mettre à jour l'affichage
        this.updateCollection();
        
        // Sauvegarder le filtre
        SaveSystem.autoSave();
    },
    
    // Mettre à jour l'affichage de la collection
    updateCollection() {
        const collectionGrid = document.getElementById('collectionGrid');
        if (!collectionGrid) {
            console.warn('⚠️ Element collectionGrid non trouvé');
            return;
        }
        
        collectionGrid.innerHTML = '';
        
        // Obtenir les personnages possédés triés
        const ownedArray = this.getOwnedCharactersSorted();
        
        // Appliquer le filtre
        const filteredCharacters = this.applyCurrentFilter(ownedArray);
        
        // Afficher les personnages
        filteredCharacters.forEach(character => {
            const item = UI.createCollectionItem(character);
            collectionGrid.appendChild(item);
        });
        
        // Mettre à jour les statistiques
        this.updateCollectionStats();
        
        console.log(`📚 Collection mise à jour: ${filteredCharacters.length}/${ownedArray.length} personnages affichés`);
    },
    
    // Obtenir les personnages possédés triés par rareté
    getOwnedCharactersSorted() {
        return Array.from(gameState.ownedCharacters)
            .map(name => findCharacterByName(name))
            .filter(char => char !== undefined)
            .sort((a, b) => {
                const rarityOrder = { legendary: 0, epic: 1, rare: 2, common: 3 };
                const rarityCompare = rarityOrder[a.rarity] - rarityOrder[b.rarity];
                
                // Si même rareté, trier par puissance décroissante
                if (rarityCompare === 0) {
                    const powerA = a.stats.attack + a.stats.defense + a.stats.speed + a.stats.magic;
                    const powerB = b.stats.attack + b.stats.defense + b.stats.speed + b.stats.magic;
                    return powerB - powerA;
                }
                
                return rarityCompare;
            });
    },
    
    // Appliquer le filtre actuel
    applyCurrentFilter(characters) {
        switch (gameState.currentFilter) {
            case 'all':
                return characters;
            
            case 'equipped':
                return characters.filter(char => gameState.equippedCharacters.has(char.name));
            
            case 'legendary':
            case 'epic':
            case 'rare':
            case 'common':
                return characters.filter(char => char.rarity === gameState.currentFilter);
            
            default:
                console.warn(`⚠️ Filtre inconnu: ${gameState.currentFilter}`);
                return characters;
        }
    },
    
    // Mettre à jour les statistiques de collection
    updateCollectionStats() {
        UI.updateCollectionStats();
        
        // Statistiques supplémentaires pour debug
        if (GAME_CONFIG.DEBUG.ENABLED) {
            this.logCollectionStats();
        }
    },
    
    // Gestion de l'équipement
    toggleEquipment(characterName, slot) {
        console.log(`🔧 Toggle équipement: ${characterName} - ${slot}`);
        
        if (!gameState.characterEquipment[characterName]) {
            gameState.characterEquipment[characterName] = {};
        }
        
        const isCurrentlyEquipped = gameState.characterEquipment[characterName][slot];
        
        if (isCurrentlyEquipped) {
            // Déséquiper
            this.unequipCharacter(characterName, slot);
        } else {
            // Vérifier la limite d'équipement
            if (gameState.equippedCharacters.size >= GAME_CONFIG.COMBAT.MAX_EQUIPPED) {
                UI.showNotification(
                    `⚠️ Limite atteinte ! Tu ne peux équiper que ${GAME_CONFIG.COMBAT.MAX_EQUIPPED} personnages maximum.\n` +
                    'Déséquipe un personnage pour en équiper un autre.', 
                    'error'
                );
                return;
            }
            
            // Équiper
            this.equipCharacter(characterName, slot);
        }
        
        // Mettre à jour l'affichage
        this.updateCollection();
        
        // Mettre à jour les infos de combat si on est dans cet onglet
        const combatTab = document.getElementById('combat');
        if (combatTab && combatTab.classList.contains('active')) {
            CombatSystem.updateCombatInfo();
        }
        
        // Sauvegarder
        SaveSystem.autoSave();
    },
    
    // Équiper un personnage
    equipCharacter(characterName, slot) {
        const equipmentType = GAME_CONFIG.EQUIPMENT.TYPES[slot];
        
        if (!equipmentType) {
            console.error(`❌ Type d'équipement inconnu: ${slot}`);
            return;
        }
        
        gameState.characterEquipment[characterName][slot] = equipmentType;
        gameState.equippedCharacters.add(characterName);
        
        console.log(`✅ ${characterName} équipé avec ${equipmentType}`);
        
        // Notification de succès
        const character = findCharacterByName(characterName);
        if (character) {
            UI.showNotification(`⚔️ ${character.emoji} ${characterName} équipé !`, 'success');
        }
    },
    
    // Déséquiper un personnage
    unequipCharacter(characterName, slot) {
        if (gameState.characterEquipment[characterName]) {
            delete gameState.characterEquipment[characterName][slot];
            
            // Si plus d'équipement, retirer de la liste des équipés
            const hasAnyEquipment = Object.keys(gameState.characterEquipment[characterName]).length > 0;
            if (!hasAnyEquipment) {
                gameState.equippedCharacters.delete(characterName);
                delete gameState.characterEquipment[characterName];
            }
        }
        
        console.log(`❌ ${characterName} déséquipé`);
        
        // Notification
        const character = findCharacterByName(characterName);
        if (character) {
            UI.showNotification(`🔓 ${character.emoji} ${characterName} déséquipé`, 'success');
        }
    },
    
    // Équiper automatiquement les meilleurs personnages
    autoEquipBest() {
        console.log('🤖 Équipement automatique des meilleurs personnages...');
        
        // Déséquiper tous les personnages actuels
        this.unequipAll();
        
        // Obtenir les personnages triés par puissance
        const sortedByPower = Array.from(gameState.ownedCharacters)
            .map(name => findCharacterByName(name))
            .filter(char => char !== undefined)
            .sort((a, b) => {
                const powerA = a.stats.attack + a.stats.defense + a.stats.speed + a.stats.magic;
                const powerB = b.stats.attack + b.stats.defense + b.stats.speed + b.stats.magic;
                return powerB - powerA;
            });
        
        // Équiper les 5 meilleurs (ou moins si pas assez)
        const toEquip = sortedByPower.slice(0, GAME_CONFIG.COMBAT.MAX_EQUIPPED);
        
        toEquip.forEach(character => {
            this.equipCharacter(character.name, 'weapon');
        });
        
        this.updateCollection();
        
        if (toEquip.length > 0) {
            UI.showNotification(`🤖 ${toEquip.length} meilleurs personnages équipés automatiquement !`, 'success');
        }
        
        SaveSystem.autoSave();
    },
    
    // Déséquiper tous les personnages
    unequipAll() {
        console.log('🔓 Déséquipement de tous les personnages...');
        
        gameState.equippedCharacters.clear();
        gameState.characterEquipment = {};
        
        this.updateCollection();
        
        UI.showNotification('🔓 Tous les personnages ont été déséquipés', 'success');
        SaveSystem.autoSave();
    },
    
    // Obtenir les statistiques de la collection
    getCollectionStats() {
        const totalCharacters = CHARACTERS_DB.length;
        const ownedCharacters = gameState.ownedCharacters.size;
        const equippedCharacters = gameState.equippedCharacters.size;
        
        // Statistiques par rareté
        const rarityStats = { legendary: 0, epic: 0, rare: 0, common: 0 };
        
        Array.from(gameState.ownedCharacters).forEach(name => {
            const character = findCharacterByName(name);
            if (character) {
                rarityStats[character.rarity]++;
            }
        });
        
        // Puissance moyenne
        let totalPower = 0;
        if (ownedCharacters > 0) {
            totalPower = Array.from(gameState.ownedCharacters).reduce((sum, name) => {
                const char = findCharacterByName(name);
                if (char) {
                    return sum + (char.stats.attack + char.stats.defense + char.stats.speed + char.stats.magic);
                }
                return sum;
            }, 0);
        }
        
        const averagePower = ownedCharacters > 0 ? Math.round(totalPower / ownedCharacters) : 0;
        
        // Puissance de l'équipe équipée
        const equippedArray = Array.from(gameState.equippedCharacters).map(name => 
            findCharacterByName(name)
        ).filter(char => char !== undefined);
        
        const teamPower = equippedArray.reduce((sum, char) => 
            sum + char.stats.attack + char.stats.defense + char.stats.speed + char.stats.magic, 0
        );
        
        return {
            total: totalCharacters,
            owned: ownedCharacters,
            equipped: equippedCharacters,
            completion: Math.round((ownedCharacters / totalCharacters) * 100),
            rarityBreakdown: rarityStats,
            averagePower,
            teamPower,
            maxEquipped: GAME_CONFIG.COMBAT.MAX_EQUIPPED
        };
    },
    
    // Obtenir le personnage le plus puissant
    getStrongestCharacter() {
        let strongest = null;
        let maxPower = 0;
        
        Array.from(gameState.ownedCharacters).forEach(name => {
            const character = findCharacterByName(name);
            if (character) {
                const power = character.stats.attack + character.stats.defense + character.stats.speed + character.stats.magic;
                if (power > maxPower) {
                    maxPower = power;
                    strongest = character;
                }
            }
        });
        
        return strongest ? { character: strongest, power: maxPower } : null;
    },
    
    // Obtenir les personnages par rareté
    getCharactersByRarity(rarity) {
        return Array.from(gameState.ownedCharacters)
            .map(name => findCharacterByName(name))
            .filter(char => char && char.rarity === rarity)
            .sort((a, b) => {
                const powerA = a.stats.attack + a.stats.defense + a.stats.speed + a.stats.magic;
                const powerB = b.stats.attack + b.stats.defense + b.stats.speed + b.stats.magic;
                return powerB - powerA;
            });
    },
    
    // Vérifier si un personnage est équipé
    isCharacterEquipped(characterName) {
        return gameState.equippedCharacters.has(characterName);
    },
    
    // Obtenir l'équipement d'un personnage
    getCharacterEquipment(characterName) {
        return gameState.characterEquipment[characterName] || {};
    },
    
    // Rechercher des personnages par nom
    searchCharacters(query) {
        if (!query || query.trim() === '') {
            return this.getOwnedCharactersSorted();
        }
        
        const searchTerm = query.toLowerCase().trim();
        
        return this.getOwnedCharactersSorted().filter(character => 
            character.name.toLowerCase().includes(searchTerm) ||
            character.type.toLowerCase().includes(searchTerm) ||
            character.element.toLowerCase().includes(searchTerm) ||
            character.rarity.toLowerCase().includes(searchTerm)
        );
    },
    
    // Obtenir les recommandations d'équipement
    getEquipmentRecommendations() {
        const recommendations = [];
        
        // Si moins de 5 personnages équipés
        if (gameState.equippedCharacters.size < GAME_CONFIG.COMBAT.MAX_EQUIPPED) {
            const unequippedPowerful = this.getOwnedCharactersSorted()
                .filter(char => !this.isCharacterEquipped(char.name))
                .slice(0, GAME_CONFIG.COMBAT.MAX_EQUIPPED - gameState.equippedCharacters.size);
            
            if (unequippedPowerful.length > 0) {
                recommendations.push({
                    type: 'equip_powerful',
                    message: `Équipe ${unequippedPowerful.length} personnage(s) puissant(s)`,
                    characters: unequippedPowerful,
                    action: () => {
                        unequippedPowerful.forEach(char => {
                            this.equipCharacter(char.name, 'weapon');
                        });
                        this.updateCollection();
                    }
                });
            }
        }
        
        // Si des personnages faibles sont équipés alors que des plus forts existent
        const equippedArray = Array.from(gameState.equippedCharacters)
            .map(name => findCharacterByName(name))
            .filter(char => char !== undefined);
        
        const unequippedArray = this.getOwnedCharactersSorted()
            .filter(char => !this.isCharacterEquipped(char.name));
        
        if (equippedArray.length > 0 && unequippedArray.length > 0) {
            const weakestEquipped = equippedArray[equippedArray.length - 1];
            const strongestUnequipped = unequippedArray[0];
            
            const weakestPower = weakestEquipped.stats.attack + weakestEquipped.stats.defense + 
                                 weakestEquipped.stats.speed + weakestEquipped.stats.magic;
            const strongestPower = strongestUnequipped.stats.attack + strongestUnequipped.stats.defense + 
                                  strongestUnequipped.stats.speed + strongestUnequipped.stats.magic;
            
            if (strongestPower > weakestPower + 20) { // Différence significative
                recommendations.push({
                    type: 'replace_weak',
                    message: `Remplace ${weakestEquipped.name} par ${strongestUnequipped.name}`,
                    oldCharacter: weakestEquipped,
                    newCharacter: strongestUnequipped,
                    powerGain: strongestPower - weakestPower,
                    action: () => {
                        this.unequipCharacter(weakestEquipped.name, 'weapon');
                        this.equipCharacter(strongestUnequipped.name, 'weapon');
                        this.updateCollection();
                    }
                });
            }
        }
        
        return recommendations;
    },
    
    // Appliquer automatiquement les recommandations
    applyRecommendations() {
        const recommendations = this.getEquipmentRecommendations();
        
        if (recommendations.length === 0) {
            UI.showNotification('✅ Ton équipe est déjà optimisée !', 'success');
            return;
        }
        
        recommendations.forEach(rec => {
            if (rec.action) {
                rec.action();
            }
        });
        
        UI.showNotification(`🔧 ${recommendations.length} amélioration(s) appliquée(s) !`, 'success');
        SaveSystem.autoSave();
    },
    
    // Exporter la collection au format JSON
    exportCollection() {
        try {
            const collectionData = {
                timestamp: Date.now(),
                version: GAME_CONFIG.VERSION,
                characters: Array.from(gameState.ownedCharacters).map(name => {
                    const character = findCharacterByName(name);
                    const equipment = this.getCharacterEquipment(name);
                    const isEquipped = this.isCharacterEquipped(name);
                    
                    return {
                        name: character.name,
                        rarity: character.rarity,
                        stats: character.stats,
                        element: character.element,
                        type: character.type,
                        equipment: equipment,
                        isEquipped: isEquipped,
                        totalPower: character.stats.attack + character.stats.defense + 
                                   character.stats.speed + character.stats.magic
                    };
                }).sort((a, b) => b.totalPower - a.totalPower),
                
                summary: this.getCollectionStats()
            };
            
            const dataStr = JSON.stringify(collectionData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `collection-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            
            UI.showNotification('📤 Collection exportée !', 'success');
            
        } catch (error) {
            console.error('❌ Erreur lors de l\'export:', error);
            UI.showNotification('❌ Erreur lors de l\'export', 'error');
        }
    },
    
    // Analyser la collection et donner des conseils
    analyzeCollection() {
        const stats = this.getCollectionStats();
        const analysis = [];
        
        // Analyse du taux de completion
        if (stats.completion < 10) {
            analysis.push('🎯 Collection débutante ! Continue à farmer pour obtenir plus de personnages.');
        } else if (stats.completion < 50) {
            analysis.push('📈 Belle progression ! Tu as déjà une base solide de personnages.');
        } else if (stats.completion < 90) {
            analysis.push('🏆 Excellente collection ! Tu approches de la completion.');
        } else {
            analysis.push('👑 Collection quasi-complète ! Tu es un maître collectionneur !');
        }
        
        // Analyse des raretés
        if (stats.rarityBreakdown.legendary === 0) {
            analysis.push('⭐ Aucun légendaire pour le moment. Continue les invocations !');
        } else if (stats.rarityBreakdown.legendary >= 3) {
            analysis.push(`🌟 Impressionnant ! Tu as ${stats.rarityBreakdown.legendary} légendaires !`);
        }
        
        // Analyse de l'équipe
        if (stats.equipped < stats.maxEquipped) {
            analysis.push(`⚔️ Tu peux équiper ${stats.maxEquipped - stats.equipped} personnage(s) supplémentaire(s).`);
        }
        
        if (stats.teamPower > 0) {
            const avgCharPower = stats.teamPower / stats.equipped;
            if (avgCharPower < 200) {
                analysis.push('💪 Ton équipe peut être renforcée avec de meilleurs personnages.');
            } else if (avgCharPower > 400) {
                analysis.push('🔥 Équipe très puissante ! Tu peux affronter les zones difficiles.');
            }
        }
        
        // Recommandations d'équipement
        const recommendations = this.getEquipmentRecommendations();
        if (recommendations.length > 0) {
            analysis.push(`🔧 ${recommendations.length} amélioration(s) d'équipement possible(s).`);
        }
        
        return {
            stats,
            analysis,
            recommendations
        };
    },
    
    // Logger les statistiques (debug)
    logCollectionStats() {
        if (!GAME_CONFIG.DEBUG.ENABLED) return;
        
        const stats = this.getCollectionStats();
        
        console.group('📊 Statistiques de collection');
        console.log('Total:', `${stats.owned}/${stats.total} (${stats.completion}%)`);
        console.log('Équipés:', `${stats.equipped}/${stats.maxEquipped}`);
        console.log('Puissance moyenne:', stats.averagePower);
        console.log('Puissance équipe:', stats.teamPower);
        console.log('Raretés:', stats.rarityBreakdown);
        console.groupEnd();
    },
    
    // Mode debug: ajouter tous les personnages
    debugAddAllCharacters() {
        if (!GAME_CONFIG.DEBUG.ENABLED) return;
        
        CHARACTERS_DB.forEach(char => {
            if (char.name !== "George le Noob") {
                gameState.ownedCharacters.add(char.name);
                if (char.rarity === 'legendary') {
                    gameState.legendaryCount++;
                }
            }
        });
        
        this.updateCollection();
        UI.updateStats();
        
        console.log('🐛 Tous les personnages ajoutés (debug)');
    },
    
    // Mode debug: équiper les 5 légendaires
    debugEquipLegendaries() {
        if (!GAME_CONFIG.DEBUG.ENABLED) return;
        
        this.unequipAll();
        
        const legendaries = this.getCharactersByRarity('legendary').slice(0, 5);
        legendaries.forEach(char => {
            this.equipCharacter(char.name, 'weapon');
        });
        
        this.updateCollection();
        console.log(`🐛 ${legendaries.length} légendaires équipés (debug)`);
    }
};

console.log('📚 Module CollectionSystem chargé');