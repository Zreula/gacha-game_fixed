// ================================
// SYSTÈME D'ÉQUIPEMENT V2 - ARCHITECTURE PROPRE
// ================================

const EquipmentSystemV2 = {
    // ===== ÉTAT CENTRALISÉ =====
    state: {
        // Inventaire: liste d'objets avec IDs uniques
        inventory: [],
        // Équipement: { characterName: { slot: itemId } }
        characterEquipment: {},
        // Cache pour éviter les recherches répétées
        equipmentCache: new Map()
    },

    // ===== INITIALISATION =====
    init() {
        console.log('⚔️ Initialisation du système d\'équipement V2...');
        this.migrateOldData();
        this.validateState();
    },

    // Migration des données existantes
    migrateOldData() {
        // Migrer l'inventaire existant
        if (gameState.inventory) {
            this.state.inventory = gameState.inventory.map(item => ({
                ...item,
                uniqueId: item.uniqueId || this.generateUniqueId(),
                equippedOn: null // Quel personnage l'a équipé
            }));
        }

        // Migrer l'équipement existant
        this.state.characterEquipment = { ...gameState.characterEquipment };
        
        console.log(`📦 Migration: ${this.state.inventory.length} objets dans l'inventaire`);
    },

    // ===== GESTION DE L'INVENTAIRE =====
    
    // Ajouter un objet à l'inventaire (avec ID unique)
    addToInventory(item) {
        const newItem = {
            ...item,
            uniqueId: this.generateUniqueId(),
            equippedOn: null,
            acquiredAt: Date.now()
        };
        
        this.state.inventory.push(newItem);
        this.syncToGameState();
        
        console.log(`📦 Ajouté à l'inventaire: ${newItem.name} (ID: ${newItem.uniqueId})`);
        return newItem.uniqueId;
    },

    // Supprimer un objet de l'inventaire
    removeFromInventory(uniqueId) {
        const index = this.state.inventory.findIndex(item => item.uniqueId === uniqueId);
        
        if (index === -1) {
            console.error(`❌ Objet non trouvé dans l'inventaire: ${uniqueId}`);
            return null;
        }

        const removedItem = this.state.inventory.splice(index, 1)[0];
        this.syncToGameState();
        
        console.log(`🗑️ Supprimé de l'inventaire: ${removedItem.name} (ID: ${uniqueId})`);
        return removedItem;
    },

    // Obtenir un objet par son ID unique
    getItemByUniqueId(uniqueId) {
        return this.state.inventory.find(item => item.uniqueId === uniqueId) || null;
    },

    // Obtenir tous les objets d'un type
    getInventoryByType(type) {
        return this.state.inventory.filter(item => item.type === type);
    },

    // ===== GESTION DE L'ÉQUIPEMENT =====

    // Équiper un objet (FONCTION PRINCIPALE)
    equipItem(characterName, uniqueId, slotType) {
        console.log(`⚔️ ÉQUIPEMENT: ${characterName} - slot ${slotType} - item ${uniqueId}`);

        // Validations
        if (!this.validateEquipment(characterName, uniqueId, slotType)) {
            return false;
        }

        const item = this.getItemByUniqueId(uniqueId);
        if (!item) {
            console.error(`❌ Objet non trouvé: ${uniqueId}`);
            return false;
        }

        // Vérifier si l'objet est déjà équipé sur ce personnage
        if (this.isItemEquippedOn(uniqueId, characterName, slotType)) {
            console.log(`⚠️ ${item.name} déjà équipé sur ${characterName}`);
            return false;
        }

        // Déséquiper l'objet actuel s'il y en a un
        const currentEquipped = this.getCurrentEquipped(characterName, slotType);
        if (currentEquipped) {
            this.unequipItem(characterName, slotType);
        }

        // Effectuer l'équipement
        this.performEquip(characterName, slotType, uniqueId);
        
        return true;
    },

    // Déséquiper un objet
    unequipItem(characterName, slotType) {
        console.log(`🗑️ DÉSÉQUIPEMENT: ${characterName} - slot ${slotType}`);

        const currentUniqueId = this.getCurrentEquipped(characterName, slotType);
        if (!currentUniqueId) {
            console.log(`⚠️ Aucun objet équipé dans le slot ${slotType}`);
            return false;
        }

        // Effectuer le déséquipement
        this.performUnequip(characterName, slotType, currentUniqueId);
        
        return true;
    },

    // ===== FONCTIONS INTERNES =====

    // Valider les paramètres d'équipement
    validateEquipment(characterName, uniqueId, slotType) {
        if (!characterName || !uniqueId || !slotType) {
            console.error('❌ Paramètres manquants pour l\'équipement');
            return false;
        }

        const item = this.getItemByUniqueId(uniqueId);
        if (!item) {
            console.error(`❌ Objet non trouvé: ${uniqueId}`);
            return false;
        }

        if (item.type !== slotType) {
            console.error(`❌ Type incorrect: ${item.type} ≠ ${slotType}`);
            return false;
        }

        return true;
    },

    // Vérifier si un objet est déjà équipé
    isItemEquippedOn(uniqueId, characterName, slotType) {
        const equipped = this.getCurrentEquipped(characterName, slotType);
        return equipped === uniqueId;
    },

    // Obtenir l'objet actuellement équipé
    getCurrentEquipped(characterName, slotType) {
        if (!this.state.characterEquipment[characterName]) {
            return null;
        }
        return this.state.characterEquipment[characterName][slotType] || null;
    },

    // Effectuer l'équipement (sans validation)
    performEquip(characterName, slotType, uniqueId) {
        // Initialiser l'équipement du personnage si nécessaire
        if (!this.state.characterEquipment[characterName]) {
            this.state.characterEquipment[characterName] = {};
        }

        // Équiper l'objet
        this.state.characterEquipment[characterName][slotType] = uniqueId;

        // Marquer l'objet comme équipé
        const item = this.getItemByUniqueId(uniqueId);
        if (item) {
            item.equippedOn = characterName;
        }

        // Supprimer de l'inventaire
        this.removeFromInventory(uniqueId);

        this.syncToGameState();
        console.log(`✅ ${item?.name} équipé sur ${characterName} dans le slot ${slotType}`);
    },

    // Effectuer le déséquipement (sans validation)
    performUnequip(characterName, slotType, uniqueId) {
        // Supprimer de l'équipement
        delete this.state.characterEquipment[characterName][slotType];

        // Remettre dans l'inventaire
        const originalItem = EquipmentSystem.getEquipmentById(this.getOriginalId(uniqueId));
        if (originalItem) {
            const restoredItem = {
                ...originalItem,
                uniqueId: uniqueId,
                equippedOn: null,
                restoredAt: Date.now()
            };
            
            this.state.inventory.push(restoredItem);
        }

        this.syncToGameState();
        console.log(`🔄 Objet ${uniqueId} déséquipé et remis dans l'inventaire`);
    },

    // ===== FONCTIONS UTILITAIRES =====

    // Générer un ID unique
    generateUniqueId() {
        return `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },

    // Extraire l'ID original d'un uniqueId
    getOriginalId(uniqueId) {
        const item = this.getItemByUniqueId(uniqueId);
        return item ? item.id : null;
    },

    // Synchroniser avec l'ancien gameState
    syncToGameState() {
        gameState.inventory = this.state.inventory;
        gameState.characterEquipment = this.state.characterEquipment;
    },

    // Valider l'état du système
    validateState() {
        let issues = 0;

        // Vérifier les doublons dans l'inventaire
        const uniqueIds = this.state.inventory.map(item => item.uniqueId);
        const duplicates = uniqueIds.filter((id, index) => uniqueIds.indexOf(id) !== index);
        
        if (duplicates.length > 0) {
            console.error('❌ IDs dupliqués détectés:', duplicates);
            issues++;
        }

        // Vérifier la cohérence équipement/inventaire
        Object.entries(this.state.characterEquipment).forEach(([charName, equipment]) => {
            Object.entries(equipment).forEach(([slot, uniqueId]) => {
                const item = this.getItemByUniqueId(uniqueId);
                if (!item) {
                    console.error(`❌ Objet équipé non trouvé: ${charName} - ${slot} - ${uniqueId}`);
                    issues++;
                }
            });
        });

        console.log(issues === 0 ? '✅ État du système valide' : `❌ ${issues} problème(s) détecté(s)`);
        return issues === 0;
    },

    // ===== API PUBLIQUE =====

    // Obtenir les stats totales d'un personnage
    getCharacterStats(characterName) {
        const character = findCharacterByName(characterName);
        if (!character) return { attack: 0, defense: 0, speed: 0, magic: 0 };

        const baseStats = { ...character.stats };
        const equipment = this.state.characterEquipment[characterName] || {};

        // Ajouter les bonus d'équipement
        Object.values(equipment).forEach(uniqueId => {
            const item = this.getItemByUniqueId(uniqueId);
            if (item && item.stats) {
                baseStats.attack += item.stats.attack || 0;
                baseStats.defense += item.stats.defense || 0;
                baseStats.speed += item.stats.speed || 0;
                baseStats.magic += item.stats.magic || 0;
            }
        });

        // S'assurer que les stats restent positives
        Object.keys(baseStats).forEach(stat => {
            baseStats[stat] = Math.max(1, baseStats[stat]);
        });

        return baseStats;
    },

    // Calculer la puissance totale d'un personnage
    getCharacterPower(characterName) {
        const stats = this.getCharacterStats(characterName);
        return stats.attack + stats.defense + stats.speed + stats.magic;
    },

    // Obtenir l'inventaire filtré pour l'interface
    getInventoryForUI(slotType = null) {
        let filtered = this.state.inventory;
        
        if (slotType) {
            filtered = filtered.filter(item => item.type === slotType);
        }

        return filtered.map(item => ({
            ...item,
            isEquipped: item.equippedOn !== null,
            equippedCharacter: item.equippedOn
        }));
    },

    // Obtenir l'équipement d'un personnage pour l'interface
    getCharacterEquipmentForUI(characterName) {
        const equipment = this.state.characterEquipment[characterName] || {};
        const result = {};

        Object.entries(equipment).forEach(([slot, uniqueId]) => {
            const item = this.getItemByUniqueId(uniqueId);
            if (item) {
                result[slot] = {
                    ...item,
                    slot: slot
                };
            }
        });

        return result;
    },

    // ===== FONCTIONS DE DEBUG =====

    // Afficher l'état complet du système
    debugDumpState() {
        console.group('🔍 État du système d\'équipement');
        console.log('Inventaire:', this.state.inventory);
        console.log('Équipement:', this.state.characterEquipment);
        console.log('Validation:', this.validateState());
        console.groupEnd();
    },

    // Nettoyer les données corrompues
    debugCleanup() {
        console.log('🧹 Nettoyage du système d\'équipement...');
        
        // Supprimer les doublons
        const seen = new Set();
        this.state.inventory = this.state.inventory.filter(item => {
            if (seen.has(item.uniqueId)) {
                console.log(`🗑️ Doublon supprimé: ${item.name} (${item.uniqueId})`);
                return false;
            }
            seen.add(item.uniqueId);
            return true;
        });

        // Nettoyer les équipements orphelins
        Object.entries(this.state.characterEquipment).forEach(([charName, equipment]) => {
            Object.entries(equipment).forEach(([slot, uniqueId]) => {
                if (!this.getItemByUniqueId(uniqueId)) {
                    console.log(`🗑️ Équipement orphelin supprimé: ${charName} - ${slot}`);
                    delete this.state.characterEquipment[charName][slot];
                }
            });
        });

        this.syncToGameState();
        console.log('✅ Nettoyage terminé');
    }
};

// ================================
// INTERFACE UTILISATEUR V2
// ================================

const EquipmentUIV2 = {
    // Ouvrir la modal d'inventaire avec le nouveau système
    openInventoryModal(characterName, slotType) {
        const modal = document.getElementById('inventoryModal');
        const title = document.getElementById('inventoryModalTitle');
        const grid = document.getElementById('inventoryGrid');
        
        if (!modal) return;

        modal.dataset.character = characterName;
        modal.dataset.slot = slotType;

        const slotNames = { weapon: 'Arme', armor: 'Armure', accessory: 'Accessoire' };
        title.textContent = `Inventaire - ${slotNames[slotType]}`;

        this.populateInventoryGrid(slotType);
        modal.style.display = 'block';
    },

    // Remplir la grille avec le nouveau système
    populateInventoryGrid(slotType) {
        const grid = document.getElementById('inventoryGrid');
        const emptyDiv = document.getElementById('inventoryEmpty');
        
        if (!grid) return;

        const items = EquipmentSystemV2.getInventoryForUI(slotType);
        
        grid.innerHTML = '';

        if (items.length === 0) {
            grid.style.display = 'none';
            emptyDiv.style.display = 'block';
            return;
        }

        grid.style.display = 'grid';
        emptyDiv.style.display = 'none';

        items.forEach(item => {
            const card = this.createInventoryItemCard(item);
            grid.appendChild(card);
        });
    },

    // Créer une carte d'objet avec le nouveau système
    createInventoryItemCard(item) {
        const card = document.createElement('div');
        card.className = `inventory-item ${item.rarity}`;
        
        // Désactiver si déjà équipé ailleurs
        if (item.isEquipped) {
            card.classList.add('equipped-elsewhere');
            card.title = `Équipé sur ${item.equippedCharacter}`;
        } else {
            card.onclick = () => this.equipFromInventory(item);
        }

        const totalStats = (item.stats.attack || 0) + (item.stats.defense || 0) + 
                          (item.stats.speed || 0) + (item.stats.magic || 0);

        card.innerHTML = `
            <div class="inventory-item-icon">${item.icon}</div>
            <div class="inventory-item-name">${item.name}</div>
            <div class="inventory-item-rarity ${item.rarity}">${item.rarity.toUpperCase()}</div>
            ${item.isEquipped ? `<div class="equipped-indicator">Équipé sur ${item.equippedCharacter}</div>` : ''}
            <div class="inventory-item-stats">
                <div>⚔️ ${item.stats.attack || 0} | 🛡️ ${item.stats.defense || 0}</div>
                <div>⚡ ${item.stats.speed || 0} | ✨ ${item.stats.magic || 0}</div>
                <div style="font-weight: bold; margin-top: 5px;">Total: ${totalStats}</div>
            </div>
        `;

        return card;
    },

    // Équiper un objet avec le nouveau système (SANS BUGS !)
    equipFromInventory(item) {
        const modal = document.getElementById('inventoryModal');
        const characterName = modal.dataset.character;
        const slotType = modal.dataset.slot;

        if (!characterName || !slotType) return;

        // Utiliser le nouveau système (qui gère tout proprement)
        const success = EquipmentSystemV2.equipItem(characterName, item.uniqueId, slotType);

        if (success) {
            UI.closeInventoryModal();
            UI.updateEquipmentTab();
            UI.showNotification(`✅ ${item.name} équipé sur ${characterName} !`, 'success');
            
            if (typeof SaveSystem !== 'undefined') {
                SaveSystem.autoSave();
            }
        }
    }
};

console.log('⚔️ Système d\'équipement V2 chargé');