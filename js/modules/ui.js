// Module UI - Gestion de l'interface utilisateur
const UI = {
    // Éléments DOM cachés pour optimisation
    elements: {},
    
    // Initialisation du module UI
    init() {
        console.log('🎨 Initialisation du module UI...');
        this.cacheElements();
        this.setupAnimations();
    },
    
    // Cache les éléments DOM pour éviter les recherches répétées
    cacheElements() {
        this.elements = {
            // Stats
            totalSummons: document.getElementById('totalSummons'),
            uniqueCount: document.getElementById('uniqueCount'),
            legendaryCount: document.getElementById('legendaryCount'),
            collectionCountDisplay: document.getElementById('collectionCountDisplay'),
            equippedCount: document.getElementById('equippedCount'),
            avgPower: document.getElementById('avgPower'),
            
            // Ressources
            playerGold: document.getElementById('playerGold'),
            playerCrystals: document.getElementById('playerCrystals'),
            
            // Bouton d'invocation
            summonBtn: document.getElementById('summonBtn'),
            summonText: document.getElementById('summonText'),
            
            // Résultats et collection
            results: document.getElementById('results'),
            collectionGrid: document.getElementById('collectionGrid'),
            
            // Onglets
            tabs: document.querySelectorAll('.tab'),
            tabContents: document.querySelectorAll('.tab-content'),
            
            // Modal personnage
            characterModal: document.getElementById('characterModal'),
            modalHeader: document.getElementById('modalHeader'),
            modalAvatar: document.getElementById('modalAvatar'),
            modalName: document.getElementById('modalName'),
            modalRarity: document.getElementById('modalRarity'),
            modalTitle: document.getElementById('modalTitle'),
            modalDescription: document.getElementById('modalDescription'),
            
            // Stats de la modal
            attackValue: document.getElementById('attackValue'),
            defenseValue: document.getElementById('defenseValue'),
            speedValue: document.getElementById('speedValue'),
            magicValue: document.getElementById('magicValue'),
            attackBar: document.getElementById('attackBar'),
            defenseBar: document.getElementById('defenseBar'),
            speedBar: document.getElementById('speedBar'),
            magicBar: document.getElementById('magicBar'),
            
            // Combat
            teamSize: document.getElementById('teamSize'),
            teamPower: document.getElementById('teamPower'),
            recommendedZone: document.getElementById('recommendedZone'),
            teamPreview: document.getElementById('teamPreview'),
            zonesGrid: document.getElementById('zonesGrid'),
            
            // Notifications
            saveNotification: document.getElementById('saveNotification')
        };
        
        console.log('📱 Éléments DOM mis en cache');
    },
    
    // Configuration des animations
    setupAnimations() {
        // Animation de fade-in pour les onglets
        this.elements.tabContents.forEach(content => {
            content.style.opacity = '0';
            content.style.transform = 'translateY(10px)';
        });
        
        // Afficher l'onglet actif
        const activeTab = document.querySelector('.tab-content.active');
        if (activeTab) {
            activeTab.style.opacity = '1';
            activeTab.style.transform = 'translateY(0)';
        }
    },
    
    // Gestion des onglets
    switchTab(tabName) {
        console.log(`🔄 Changement d'onglet: ${tabName}`);
        
        // Désactiver tous les onglets et contenus
        this.elements.tabs.forEach(tab => tab.classList.remove('active'));
        this.elements.tabContents.forEach(content => {
            content.classList.remove('active');
            content.style.opacity = '0';
            content.style.transform = 'translateY(10px)';
        });
        
        // Activer l'onglet sélectionné
        const targetTab = document.getElementById(`tab${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`);
        const targetContent = document.getElementById(tabName);
        
        if (targetTab && targetContent) {
            targetTab.classList.add('active');
            targetContent.classList.add('active');
            
            // Animation d'apparition
            setTimeout(() => {
                targetContent.style.opacity = '1';
                targetContent.style.transform = 'translateY(0)';
            }, 50);

            // Mettre à jour le contenu spécifique à l'onglet
            if (tabName === 'equipment' && this.updateEquipmentTab) {
                setTimeout(() => this.updateEquipmentTab(), 100);
            }
        }
    },
    
    // Mise à jour des statistiques
    updateStats() {
        const invocableChars = CHARACTERS_DB.filter(char => char.name !== "George le Noob");
        const ownedInvocable = Array.from(gameState.ownedCharacters).filter(name => name !== "George le Noob");
        const remainingCharacters = invocableChars.length - ownedInvocable.length;
        
        // Mettre à jour les compteurs
        this.elements.totalSummons.textContent = gameState.totalSummons;
        this.elements.uniqueCount.textContent = gameState.ownedCharacters.size;
        this.elements.legendaryCount.textContent = gameState.legendaryCount;
        
        if (this.elements.collectionCountDisplay) {
            this.elements.collectionCountDisplay.textContent = gameState.ownedCharacters.size;
        }
        
        // Mettre à jour le bouton d'invocation
        this.updateSummonButton(remainingCharacters);
        
        // Mettre à jour les stats de collection
        this.updateCollectionStats();
    },
    
    // Mise à jour du bouton d'invocation
    updateSummonButton(remainingCharacters) {
        const btn = this.elements.summonBtn;
        const text = this.elements.summonText;
        
        if (remainingCharacters === 0) {
            text.textContent = '🎉 Collection complète !';
            btn.disabled = true;
        } else if (gameState.crystals < GAME_CONFIG.GACHA.SUMMON_COST) {
            text.textContent = `❌ Pas assez de cristaux (${gameState.crystals}/${GAME_CONFIG.GACHA.SUMMON_COST})`;
            btn.disabled = true;
        } else if (remainingCharacters < GAME_CONFIG.GACHA.SUMMON_COUNT) {
            text.textContent = `✨ Invoquer x${remainingCharacters} (${GAME_CONFIG.GACHA.SUMMON_COST} 💎) ✨`;
            btn.disabled = false;
        } else {
            text.textContent = `✨ Invoquer x${GAME_CONFIG.GACHA.SUMMON_COUNT} (${GAME_CONFIG.GACHA.SUMMON_COST} 💎) ✨`;
            btn.disabled = false;
        }
    },
    
    // Mise à jour des statistiques de collection
    updateCollectionStats() {
        if (this.elements.equippedCount) {
            this.elements.equippedCount.textContent = gameState.equippedCharacters.size;
            
            // Changer la couleur selon la limite
            if (gameState.equippedCharacters.size >= GAME_CONFIG.COMBAT.MAX_EQUIPPED) {
                this.elements.equippedCount.style.color = '#e74c3c';
            } else if (gameState.equippedCharacters.size >= 3) {
                this.elements.equippedCount.style.color = '#f39c12';
            } else {
                this.elements.equippedCount.style.color = '#667eea';
            }
        }
        
        // Calculer la puissance moyenne
        if (this.elements.avgPower && gameState.ownedCharacters.size > 0) {
            const totalPower = Array.from(gameState.ownedCharacters).reduce((sum, name) => {
                const char = findCharacterByName(name);
                if (char) {
                    return sum + (char.stats.attack + char.stats.defense + char.stats.speed + char.stats.magic);
                }
                return sum;
            }, 0);
            this.elements.avgPower.textContent = Math.round(totalPower / gameState.ownedCharacters.size);
        }
    },
    
    // Mise à jour des ressources du joueur
    updatePlayerResources() {
        this.elements.playerGold.textContent = gameState.playerGold;
        this.elements.playerCrystals.textContent = gameState.crystals;
    },
    
    // Affichage des résultats d'invocation
    displaySummonResults(characters) {
        const results = this.elements.results;
        results.innerHTML = '';
        results.classList.remove('show');
        
        setTimeout(() => {
            characters.forEach((character, index) => {
                setTimeout(() => {
                    const card = this.createCharacterCard(character);
                    results.appendChild(card);
                }, index * GAME_CONFIG.UI.CARD_ANIMATION_DELAY);
            });
            
            results.classList.add('show');
        }, 200);
    },
    
    // Création d'une carte de personnage pour les résultats
    createCharacterCard(character) {
        const card = document.createElement('div');
        card.className = `character-card ${character.rarity}`;
        card.style.transform = 'scale(0)';
        card.style.animation = `cardAppear 0.5s ease forwards`;
        
        const totalPower = character.stats.attack + character.stats.defense + character.stats.speed + character.stats.magic;
        
        card.innerHTML = `
            <div class="character-avatar ${character.rarity}">
                ${character.emoji}
            </div>
            <div class="character-name">${character.name}</div>
            <div class="character-rarity ${character.rarity}">
                ${character.rarity.toUpperCase()}
            </div>
            <div class="character-power">⚡ ${totalPower}</div>
        `;
        
        return card;
    },
    
    // Affichage de la modal de personnage
    showCharacterModal(character) {
        const modal = this.elements.characterModal;
        
        // Mise à jour du contenu
        this.elements.modalHeader.className = `modal-header ${character.rarity}`;
        this.elements.modalAvatar.textContent = character.emoji;
        this.elements.modalName.textContent = character.name;
        this.elements.modalRarity.textContent = character.rarity.toUpperCase();
        this.elements.modalRarity.className = `character-rarity ${character.rarity}`;
        this.elements.modalTitle.textContent = `${character.type} • ${character.element}`;
        this.elements.modalDescription.textContent = character.description;

        // Mise à jour des stats avec animation
        setTimeout(() => {
            this.updateStatBar('attack', character.stats.attack);
            this.updateStatBar('defense', character.stats.defense);
            this.updateStatBar('speed', character.stats.speed);
            this.updateStatBar('magic', character.stats.magic);
        }, 100);

        modal.style.display = 'block';
    },
    
    // NOUVEAU SYSTÈME D'INVENTAIRE
    // Ouvrir la modal d'inventaire avec le nouveau système
    openInventoryModal(characterName, slotType) {
        console.log(`🎒 Ouverture inventaire V2 pour ${characterName}, slot: ${slotType}`);
        
        if (typeof EquipmentUIV2 !== 'undefined') {
            EquipmentUIV2.openInventoryModal(characterName, slotType);
        } else {
            console.error('❌ EquipmentUIV2 non disponible');
        }
    },

    // Fermer la modal d'inventaire
    closeInventoryModal() {
        const modal = document.getElementById('inventoryModal');
        if (modal) {
            modal.style.display = 'none';
        }
    },
    
    // Mise à jour d'une barre de statistique
    updateStatBar(statName, value) {
        const valueElement = this.elements[`${statName}Value`];
        const barElement = this.elements[`${statName}Bar`];
        
        if (valueElement && barElement) {
            valueElement.textContent = value;
            barElement.style.width = value + '%';
        }
    },
    
    // Fermeture de la modal de personnage
    closeCharacterModal() {
        this.elements.characterModal.style.display = 'none';
    },
    
    // Système de notifications
    showNotification(message, type = 'success') {
        const notification = this.elements.saveNotification;
        notification.textContent = message;
        notification.className = `save-notification ${type === 'error' ? 'error' : ''}`;
        
        // Afficher la notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Masquer après la durée configurée
        setTimeout(() => {
            notification.classList.remove('show');
        }, GAME_CONFIG.SAVE.NOTIFICATION_DURATION);
        
        console.log(`📢 Notification: ${message} (${type})`);
    },
    
    // Création d'un élément de personnage pour la collection
    createCollectionItem(character) {
        const item = document.createElement('div');
        const isEquipped = gameState.equippedCharacters.has(character.name);
        const totalPower = character.stats.attack + character.stats.defense + character.stats.speed + character.stats.magic;
        
        item.className = `collection-item ${isEquipped ? 'equipped' : ''}`;
        item.onclick = () => this.showCharacterModal(character);
        
        item.innerHTML = `
            <div class="character-mini-avatar ${character.rarity}">
                ${character.emoji}
            </div>
            <div class="character-mini-info">
                <div class="character-mini-name">${character.name}</div>
                <div class="character-rarity ${character.rarity}" style="font-size: 0.7rem; display: inline-block;">
                    ${character.rarity.toUpperCase()}
                </div>
                <div class="character-mini-stats">
                    <div class="mini-stat">💪 ${character.stats.attack}</div>
                    <div class="mini-stat">🛡️ ${character.stats.defense}</div>
                    <div class="mini-stat">⚡ ${character.stats.speed}</div>
                    <div class="mini-stat">✨ ${character.stats.magic}</div>
                </div>
                <div style="font-size: 0.8rem; color: #667eea; font-weight: bold; margin-top: 3px;">
                    Puissance: ${totalPower}
                </div>
            </div>
        `;
        
        // Créer le slot d'équipement
        const equipmentSlot = document.createElement('div');
        equipmentSlot.className = `equipment-slot ${gameState.characterEquipment[character.name]?.weapon ? 'equipped' : ''}`;
        equipmentSlot.title = 'Arme';
        equipmentSlot.textContent = gameState.characterEquipment[character.name]?.weapon || '+';
        equipmentSlot.onclick = (e) => {
            e.stopPropagation();
            CollectionSystem.toggleEquipment(character.name, 'weapon');
        };
        
        item.appendChild(equipmentSlot);
        return item;
    },
    
    // NOUVEAU SYSTÈME D'ÉQUIPEMENT - Mettre à jour l'onglet équipement
    updateEquipmentTab() {
        const container = document.getElementById('equipmentContainer');
        if (!container) return;
        
        const equippedCharacters = Array.from(gameState.equippedCharacters);
        
        // Mettre à jour les statistiques
        this.updateEquipmentStats();
        
        if (equippedCharacters.length === 0) {
            container.innerHTML = `
                <div class="equipment-message">
                    <p>Aucun personnage équipé dans votre équipe.</p>
                    <p>Allez dans l'onglet <strong>Collection</strong> pour équiper des personnages !</p>
                </div>
            `;
            return;
        }
        
        // Afficher les personnages équipés avec le nouveau système
        container.innerHTML = '';
        
        equippedCharacters.forEach(characterName => {
            const character = findCharacterByName(characterName);
            if (character) {
                const card = this.createCharacterEquipmentCardV2(character);
                container.appendChild(card);
            }
        });
    },

    // Créer une carte d'équipement avec le nouveau système
    createCharacterEquipmentCardV2(character) {
        const card = document.createElement('div');
        card.className = `character-equipment-card ${character.rarity}`;
        
        // Utiliser le nouveau système pour calculer la puissance
        const currentPower = typeof EquipmentSystemV2 !== 'undefined' 
            ? EquipmentSystemV2.getCharacterPower(character.name)
            : EquipmentSystem.calculateCharacterPower(character.name);
        
        // Obtenir l'équipement avec le nouveau système
        const currentEquipment = typeof EquipmentSystemV2 !== 'undefined'
            ? EquipmentSystemV2.getCharacterEquipmentForUI(character.name)
            : {};
        
        card.innerHTML = `
            <div class="character-header">
                <div class="character-avatar-equipment ${character.rarity}">
                    ${character.emoji}
                </div>
                <div class="character-info-equipment">
                    <div class="character-name-equipment">${character.name}</div>
                    <div class="character-power-equipment">⚡ Puissance: ${currentPower}</div>
                </div>
            </div>
            
            <div class="equipment-slots">
                ${this.createEquipmentSlotV2('weapon', '⚔️', 'Arme', currentEquipment.weapon, character.name)}
                ${this.createEquipmentSlotV2('armor', '🛡️', 'Armure', currentEquipment.armor, character.name)}
                ${this.createEquipmentSlotV2('accessory', '💍', 'Accessoire', currentEquipment.accessory, character.name)}
            </div>
        `;
        
        return card;
    },

    // Créer un slot d'équipement avec le nouveau système
    createEquipmentSlotV2(slotType, icon, label, equippedItem, characterName) {
        const isEquipped = !!equippedItem;
        
        const slotContent = isEquipped ? 
            `<div class="slot-icon">${equippedItem.icon}</div>
            <div class="slot-name">${equippedItem.name}</div>` :
            `<div class="slot-icon">${icon}</div>
            <div class="slot-name">Vide</div>`;
        
        return `
            <div class="equipment-slot-container">
                <div class="slot-label">${label}</div>
                <div class="equipment-slot-display ${isEquipped ? 'equipped' : ''}" 
                    onclick="UI.openInventoryModal('${characterName.replace(/'/g, "\\'")}', '${slotType}')">
                    ${slotContent}
                </div>
            </div>
        `;
    },

    // Mettre à jour les stats de l'équipement avec le nouveau système
    updateEquipmentStats() {
        const equippedCount = gameState.equippedCharacters.size;
        
        // Calculer la puissance totale avec le nouveau système
        const totalPower = Array.from(gameState.equippedCharacters).reduce((sum, name) => {
            return sum + (typeof EquipmentSystemV2 !== 'undefined' 
                ? EquipmentSystemV2.getCharacterPower(name)
                : EquipmentSystem.calculateCharacterPower(name));
        }, 0);
        
        // Compter les objets dans l'inventaire
        const inventoryCount = typeof EquipmentSystemV2 !== 'undefined'
            ? EquipmentSystemV2.state.inventory.length
            : (gameState.inventory ? gameState.inventory.length : 0);
        
        const equippedTeamCountEl = document.getElementById('equippedTeamCount');
        const totalTeamPowerEl = document.getElementById('totalTeamPower');
        const inventoryCountEl = document.getElementById('inventoryCount');
        
        if (equippedTeamCountEl) equippedTeamCountEl.textContent = equippedCount;
        if (totalTeamPowerEl) totalTeamPowerEl.textContent = totalPower;
        if (inventoryCountEl) inventoryCountEl.textContent = inventoryCount;
    },

    // Création d'une zone de combat
    createCombatZone(zoneKey, zoneData) {
        const zoneCard = document.createElement('div');
        zoneCard.className = 'zone-card';
        zoneCard.dataset.zone = zoneKey;
        zoneCard.onclick = () => CombatSystem.startMission(zoneKey);
        
        // Vérifications de sécurité pour éviter les erreurs
        const baseGold = zoneData.baseGold || [0, 0];
        const crystalDrop = zoneData.crystalDrop || [0, 0];
        const crystalChance = zoneData.crystalChance || 0;
        const missionDuration = (GAME_CONFIG.COMBAT && GAME_CONFIG.COMBAT.MISSION_DURATIONS && GAME_CONFIG.COMBAT.MISSION_DURATIONS[zoneKey]) || 10;
        
        zoneCard.innerHTML = `
            <div class="zone-icon">${zoneData.icon || '❓'}</div>
            <div class="zone-name">${zoneData.name || 'Zone Inconnue'}</div>
            <div class="zone-difficulty">Puissance: ${zoneData.minPower || 0}-${zoneData.maxPower || 0}</div>
            <div class="zone-rewards">💰 +${baseGold[0]}-${baseGold[1]} Or | 💎 ${crystalDrop[0]}-${crystalDrop[1]} (${Math.round(crystalChance * 100)}%)</div>
            <div class="zone-status" id="${zoneKey}Status">Cliquer pour démarrer</div>
            <div class="mission-progress" id="${zoneKey}Progress">
                <div class="progress-bar">
                    <div class="progress-fill" id="${zoneKey}ProgressFill"></div>
                </div>
                <div class="progress-text" id="${zoneKey}ProgressText">0%</div>
                <div class="mission-timer" id="${zoneKey}Timer">${missionDuration}s restantes</div>
            </div>
        `;
        
        return zoneCard;
    },
    
    // Génération de toutes les zones de combat avec séparation visuelle
    generateCombatZones() {
        const zonesGrid = this.elements.zonesGrid;
        zonesGrid.innerHTML = '';
        
        // Section Missions Standard
        const standardSection = document.createElement('div');
        standardSection.className = 'zones-section';
        standardSection.innerHTML = `
            <h3 class="section-title standard">🗺️ Missions Standard</h3>
            <div class="zones-grid-section" id="standardZones"></div>
        `;
        zonesGrid.appendChild(standardSection);
        
        // Section Missions Extrêmes
        const extremeSection = document.createElement('div');
        extremeSection.className = 'zones-section';
        extremeSection.innerHTML = `
            <h3 class="section-title extreme">⚠️ Missions Extrêmes</h3>
            <div class="zones-grid-section" id="extremeZones"></div>
        `;
        zonesGrid.appendChild(extremeSection);
        
        const standardGrid = document.getElementById('standardZones');
        const extremeGrid = document.getElementById('extremeZones');
        
        // Séparer les zones par difficulté
        Object.entries(GAME_CONFIG.COMBAT.ZONES).forEach(([zoneKey, zoneData]) => {
            const zoneCard = this.createCombatZone(zoneKey, zoneData);
            
            // Missions standard (puissance max <= 2500)
            if (zoneData.maxPower <= 2500) {
                standardGrid.appendChild(zoneCard);
            } 
            // Missions extrêmes (puissance max > 2500)
            else {
                extremeGrid.appendChild(zoneCard);
            }
        });
        
        console.log('🗺️ Zones de combat générées avec séparation');
    },
    
    // Mise à jour de l'aperçu de l'équipe
    updateTeamPreview() {
        const teamPreview = this.elements.teamPreview;
        
        if (gameState.equippedCharacters.size === 0) {
            teamPreview.innerHTML = '<p style="color: #666;">Aucun personnage équipé. Va dans l\'onglet Collection pour équiper tes combattants !</p>';
            return;
        }
        
        const equippedArray = Array.from(gameState.equippedCharacters).map(name => 
            findCharacterByName(name)
        ).filter(char => char !== undefined);
        
        teamPreview.innerHTML = equippedArray.map(char => {
            // Utiliser le nouveau système pour calculer la puissance
            const totalPower = typeof EquipmentSystemV2 !== 'undefined'
                ? EquipmentSystemV2.getCharacterPower(char.name)
                : char.stats.attack + char.stats.defense + char.stats.speed + char.stats.magic;
                
            return `
                <div class="team-member">
                    <span>${char.emoji}</span>
                    <span>${char.name}</span>
                    <span style="color: #666;">(${totalPower})</span>
                </div>
            `;
        }).join('');
    },
    
    // Mise à jour des stats de l'équipe
    updateTeamStats() {
        const equippedArray = Array.from(gameState.equippedCharacters).map(name => 
            findCharacterByName(name)
        ).filter(char => char !== undefined);
        
        // Utiliser le nouveau système pour calculer la puissance totale
        const totalPower = equippedArray.reduce((sum, char) => {
            return sum + (typeof EquipmentSystemV2 !== 'undefined'
                ? EquipmentSystemV2.getCharacterPower(char.name)
                : EquipmentSystem.calculateCharacterPower(char.name));
        }, 0);
        
        this.elements.teamSize.textContent = gameState.equippedCharacters.size;
        this.elements.teamPower.textContent = totalPower;
        
        // Recommandation de zone
        const recommendedZone = this.getRecommendedZone(totalPower);
        this.elements.recommendedZone.textContent = recommendedZone;
    },
    
    // Obtenir la zone recommandée selon la puissance
    getRecommendedZone(teamPower) {
        for (const [zoneKey, zone] of Object.entries(GAME_CONFIG.COMBAT.ZONES)) {
            if (teamPower >= zone.minPower && teamPower <= zone.maxPower + 50) {
                return zone.name;
            }
        }
        if (teamPower < 50) return "Équipe trop faible";
        return "Abîme Éternel";
    },
    
    // Mise à jour des recommandations de zone
    updateZoneRecommendations(teamPower) {
        document.querySelectorAll('.zone-card').forEach(card => {
            const zoneKey = card.dataset.zone;
            const zone = GAME_CONFIG.COMBAT.ZONES[zoneKey];
            
            card.classList.remove('recommended', 'too-weak', 'too-strong');
            
            if (teamPower < zone.minPower - 20) {
                card.classList.add('too-strong');
            } else if (teamPower >= zone.minPower && teamPower <= zone.maxPower + 50) {
                card.classList.add('recommended');
            } else if (teamPower > zone.maxPower + 100) {
                card.classList.add('too-weak');
            }
        });
    },
    
    // Mise à jour complète de l'interface
    updateAll() {
        this.updateStats();
        this.updatePlayerResources();
        this.updateTeamPreview();
        this.updateTeamStats();
        
        // Mettre à jour les recommandations de zone si on est dans l'onglet combat
        const combatTab = document.getElementById('combat');
        if (combatTab && combatTab.classList.contains('active')) {
            const equippedArray = Array.from(gameState.equippedCharacters).map(name => 
                findCharacterByName(name)
            ).filter(char => char !== undefined);
            
            // Utiliser le nouveau système pour la puissance
            const totalPower = equippedArray.reduce((sum, char) => {
                return sum + (typeof EquipmentSystemV2 !== 'undefined'
                    ? EquipmentSystemV2.getCharacterPower(char.name)
                    : char.stats.attack + char.stats.defense + char.stats.speed + char.stats.magic);
            }, 0);
            
            this.updateZoneRecommendations(totalPower);
        }
    },
    
    // Animation de loading
    showLoading(element) {
        if (element) {
            element.classList.add('loading');
        }
    },
    
    hideLoading(element) {
        if (element) {
            element.classList.remove('loading');
        }
    },
    
    // Gestion des erreurs d'interface
    handleError(message, error = null) {
        console.error('❌ Erreur UI:', message, error);
        this.showNotification(`Erreur: ${message}`, 'error');
    }
};

console.log('🎨 Module UI chargé');