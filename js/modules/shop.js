// Module ShopSystem - Gestion de la boutique d'équipements
const ShopSystem = {
    // Inventaire du magasin (se renouvelle périodiquement)
    shopInventory: [],
    
    // Dernière mise à jour du magasin
    lastRefresh: 0,
    
    // Délai de renouvellement (24h en millisecondes)
    refreshInterval: 24 * 60 * 60 * 1000,
    
    // Initialisation du module
    init() {
        console.log('🏪 Initialisation du système de boutique...');
        this.checkAndRefreshShop();
    },
    
    // Vérifier et actualiser la boutique si nécessaire
    checkAndRefreshShop() {
        const now = Date.now();
        
        // Première ouverture ou délai écoulé
        if (!this.lastRefresh || (now - this.lastRefresh) >= this.refreshInterval) {
            this.refreshShopInventory();
        } else {
            console.log('🏪 Boutique à jour');
        }
    },
    
    // Actualiser l'inventaire de la boutique
    refreshShopInventory() {
        console.log('🔄 Actualisation de la boutique...');
        
        this.shopInventory = [];
        this.lastRefresh = Date.now();
        
        // Générer l'inventaire selon les niveaux de difficulté
        this.generateShopInventory();
        
        console.log(`🏪 Boutique actualisée: ${this.shopInventory.length} articles disponibles`);
    },
    
    // Générer l'inventaire de la boutique
    generateShopInventory() {
        // Équipements de base (toujours disponibles)
        this.addBasicEquipment();
        
        // Équipements aléatoires selon la progression du joueur
        this.addRandomEquipment();
        
        // Équipements spéciaux selon les achievements
        this.addSpecialEquipment();
    },
    
    // Ajouter les équipements de base
    addBasicEquipment() {
        // Équipements communs toujours disponibles
        const basicItems = [
            'rusty_sword',
            'wooden_staff',
            'leather_vest',
            'cloth_robe',
            'copper_ring',
            'health_amulet'
        ];
        
        basicItems.forEach(itemId => {
            const equipment = EquipmentSystem.getEquipmentById(itemId);
            if (equipment) {
                this.shopInventory.push({
                    ...equipment,
                    stock: -1, // Stock illimité pour les objets de base
                    discount: 0
                });
            }
        });
    },
    
    // Ajouter des équipements aléatoires
    addRandomEquipment() {
        const playerLevel = this.calculatePlayerLevel();
        
        // Nombre d'objets aléatoires selon le niveau
        const randomItemCount = Math.min(8, 3 + Math.floor(playerLevel / 5));
        
        // Pool d'équipements disponibles selon le niveau
        const availableEquipment = this.getAvailableEquipmentForLevel(playerLevel);
        
        // Sélectionner des objets aléatoires
        for (let i = 0; i < randomItemCount; i++) {
            if (availableEquipment.length === 0) break;
            
            const randomIndex = Math.floor(Math.random() * availableEquipment.length);
            const equipment = availableEquipment.splice(randomIndex, 1)[0];
            
            // Appliquer une réduction aléatoire
            const discount = this.generateRandomDiscount(equipment.rarity);
            
            this.shopInventory.push({
                ...equipment,
                stock: this.generateRandomStock(equipment.rarity),
                discount: discount,
                originalPrice: equipment.price,
                price: Math.floor(equipment.price * (1 - discount))
            });
        }
    },
    
    // Ajouter des équipements spéciaux
    addSpecialEquipment() {
        // Équipements débloqués par achievements ou progression
        if (gameState.legendaryCount >= 3) {
            const legendaryItems = EquipmentSystem.getEquipmentByRarity('legendary');
            if (legendaryItems.length > 0) {
                const item = legendaryItems[Math.floor(Math.random() * legendaryItems.length)];
                this.shopInventory.push({
                    ...item,
                    stock: 1,
                    discount: 0.1, // 10% de réduction pour les champions
                    originalPrice: item.price,
                    price: Math.floor(item.price * 0.9),
                    special: true
                });
            }
        }
    },
    
    // Calculer le niveau approximatif du joueur
    calculatePlayerLevel() {
        // Basé sur la progression générale
        const factors = {
            totalSummons: gameState.totalSummons * 0.5,
            ownedCharacters: gameState.ownedCharacters.size * 2,
            legendaryCount: gameState.legendaryCount * 5,
            wealth: (gameState.playerGold + gameState.crystals * 100) * 0.01
        };
        
        return Math.floor(Object.values(factors).reduce((sum, val) => sum + val, 0));
    },
    
    // Obtenir les équipements disponibles pour un niveau
    getAvailableEquipmentForLevel(level) {
        const allEquipment = EquipmentSystem.getAllEquipment();
        
        // Filtrer selon le niveau
        return allEquipment.filter(item => {
            const itemLevel = this.getEquipmentLevel(item);
            return itemLevel <= level + 10; // Permettre des objets légèrement au-dessus
        });
    },
    
    // Déterminer le niveau d'un équipement
    getEquipmentLevel(equipment) {
        const rarityLevels = {
            'common': 1,
            'rare': 5,
            'epic': 15,
            'legendary': 30
        };
        
        const baseLevel = rarityLevels[equipment.rarity] || 1;
        const statLevel = (equipment.price / 100) * 0.5; // Basé sur le prix
        
        return Math.floor(baseLevel + statLevel);
    },
    
    // Générer une réduction aléatoire
    generateRandomDiscount(rarity) {
        const discountRanges = {
            'common': [0, 0.10],     // 0-10%
            'rare': [0, 0.15],       // 0-15%
            'epic': [0, 0.20],       // 0-20%
            'legendary': [0, 0.25]   // 0-25%
        };
        
        const range = discountRanges[rarity] || [0, 0.05];
        return Math.random() * (range[1] - range[0]) + range[0];
    },
    
    // Générer un stock aléatoire
    generateRandomStock(rarity) {
        const stockRanges = {
            'common': [5, 10],
            'rare': [2, 5],
            'epic': [1, 3],
            'legendary': [1, 1]
        };
        
        const range = stockRanges[rarity] || [1, 5];
        return Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
    },
    
    // Acheter un objet
    buyItem(itemIndex) {
        const item = this.shopInventory[itemIndex];
        
        if (!item) {
            console.error('❌ Objet non trouvé dans la boutique');
            return false;
        }
        
        // Vérifier l'argent
        if (gameState.playerGold < item.price) {
            const shortage = item.price - gameState.playerGold;
            if (typeof UI !== 'undefined' && UI.showNotification) {
                UI.showNotification(
                    `❌ Pas assez d'or !\nRequis: ${item.price} 💰\nActuel: ${gameState.playerGold} 💰\nManque: ${shortage} 💰`, 
                    'error'
                );
            }
            return false;
        }
        
        // Vérifier le stock
        if (item.stock === 0) {
            if (typeof UI !== 'undefined' && UI.showNotification) {
                UI.showNotification(`❌ ${item.name} épuisé !`, 'error');
            }
            return false;
        }
        
        // Effectuer l'achat
        gameState.playerGold -= item.price;
        
        // Ajouter l'objet à l'inventaire (pour l'instant, on l'équipe automatiquement)
        this.addItemToInventory(item);
        
        // Réduire le stock
        if (item.stock > 0) {
            item.stock--;
        }
        
        // Notification de succès
        if (typeof UI !== 'undefined' && UI.showNotification) {
            UI.showNotification(`✅ ${item.name} acheté pour ${item.price} 💰 !`, 'success');
        }
        
        console.log(`💰 Achat: ${item.name} pour ${item.price} or`);
        
        // Sauvegarder
        if (typeof SaveSystem !== 'undefined' && SaveSystem.autoSave) {
            SaveSystem.autoSave();
        }
        
        return true;
    },
    
    // Ajouter un objet à l'inventaire (temporaire, en attendant le système d'inventaire)
    addItemToInventory(item) {
        // Pour l'instant, on initialise l'inventaire dans gameState s'il n'existe pas
        if (!gameState.inventory) {
            gameState.inventory = [];
        }
        
        // Ajouter l'objet à l'inventaire
        gameState.inventory.push({
            id: item.id,
            name: item.name,
            type: item.type,
            rarity: item.rarity,
            icon: item.icon,
            stats: item.stats,
            description: item.description,
            acquiredAt: Date.now()
        });
        
        console.log(`📦 ${item.name} ajouté à l'inventaire`);
    },
    
    // Obtenir l'inventaire de la boutique
    getShopInventory() {
        this.checkAndRefreshShop();
        return this.shopInventory;
    },
    
    // Obtenir les articles en promotion
    getDiscountedItems() {
        return this.shopInventory.filter(item => item.discount > 0);
    },
    
    // Obtenir les articles par rareté
    getItemsByRarity(rarity) {
        return this.shopInventory.filter(item => item.rarity === rarity);
    },
    
    // Obtenir les articles par type
    getItemsByType(type) {
        return this.shopInventory.filter(item => item.type === type);
    },
    
    // Forcer la mise à jour de la boutique (pour debug ou événements spéciaux)
    forceRefresh() {
        this.lastRefresh = 0;
        this.refreshShopInventory();
        
        if (typeof UI !== 'undefined' && UI.showNotification) {
            UI.showNotification('🔄 Boutique actualisée !', 'success');
        }
        
        console.log('🔄 Boutique forcée à se renouveler');
    },
    
    // Obtenir le temps restant avant la prochaine actualisation
    getTimeUntilRefresh() {
        const now = Date.now();
        const timeSinceRefresh = now - this.lastRefresh;
        const timeRemaining = this.refreshInterval - timeSinceRefresh;
        
        return Math.max(0, timeRemaining);
    },
    
    // Formater le temps restant en texte lisible
    getRefreshTimeText() {
        const timeRemaining = this.getTimeUntilRefresh();
        
        if (timeRemaining === 0) {
            return 'Actualisable maintenant';
        }
        
        const hours = Math.floor(timeRemaining / (60 * 60 * 1000));
        const minutes = Math.floor((timeRemaining % (60 * 60 * 1000)) / (60 * 1000));
        
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else {
            return `${minutes}m`;
        }
    },
    
    // Calculer les statistiques de la boutique
    getShopStats() {
        const inventory = this.getShopInventory();
        
        const stats = {
            totalItems: inventory.length,
            byRarity: {},
            byType: {},
            totalValue: 0,
            discountedItems: 0,
            avgPrice: 0
        };
        
        inventory.forEach(item => {
            // Par rareté
            stats.byRarity[item.rarity] = (stats.byRarity[item.rarity] || 0) + 1;
            
            // Par type
            stats.byType[item.type] = (stats.byType[item.type] || 0) + 1;
            
            // Valeur totale
            stats.totalValue += item.price;
            
            // Articles en promotion
            if (item.discount > 0) {
                stats.discountedItems++;
            }
        });
        
        stats.avgPrice = inventory.length > 0 ? Math.round(stats.totalValue / inventory.length) : 0;
        
        return stats;
    },
    
    // Vérifier si le joueur peut s'offrir un objet
    canAfford(itemIndex) {
        const item = this.shopInventory[itemIndex];
        return item && gameState.playerGold >= item.price;
    },
    
    // Obtenir les objets que le joueur peut s'offrir
    getAffordableItems() {
        return this.shopInventory.filter(item => gameState.playerGold >= item.price && item.stock !== 0);
    },
    
    // Obtenir les recommandations d'achat
    getRecommendations() {
        const recommendations = [];
        const equippedCharacters = Array.from(gameState.equippedCharacters);
        
        // Analyser l'équipement actuel des personnages équipés
        equippedCharacters.forEach(characterName => {
            const currentEquipment = gameState.characterEquipment[characterName] || {};
            const character = findCharacterByName(characterName);
            
            if (!character) return;
            
            // Vérifier chaque slot d'équipement
            ['weapon', 'armor', 'accessory'].forEach(slot => {
                if (!currentEquipment[slot]) {
                    // Slot vide - recommander le meilleur équipement abordable
                    const affordableItems = this.getAffordableItems()
                        .filter(item => item.type === slot)
                        .sort((a, b) => this.calculateItemValue(b) - this.calculateItemValue(a));
                    
                    if (affordableItems.length > 0) {
                        recommendations.push({
                            type: 'empty_slot',
                            character: characterName,
                            slot: slot,
                            item: affordableItems[0],
                            reason: `${characterName} n'a pas d'équipement dans le slot ${slot}`
                        });
                    }
                } else {
                    // Slot occupé - recommander une amélioration
                    const currentItem = EquipmentSystem.getEquipmentById(currentEquipment[slot]);
                    if (currentItem) {
                        const betterItems = this.getAffordableItems()
                            .filter(item => item.type === slot)
                            .filter(item => this.calculateItemValue(item) > this.calculateItemValue(currentItem))
                            .sort((a, b) => this.calculateItemValue(b) - this.calculateItemValue(a));
                        
                        if (betterItems.length > 0) {
                            recommendations.push({
                                type: 'upgrade',
                                character: characterName,
                                slot: slot,
                                currentItem: currentItem,
                                item: betterItems[0],
                                powerIncrease: this.calculateItemValue(betterItems[0]) - this.calculateItemValue(currentItem),
                                reason: `Amélioration pour ${characterName}`
                            });
                        }
                    }
                }
            });
        });
        
        // Trier par priorité (slots vides d'abord, puis meilleures améliorations)
        return recommendations.sort((a, b) => {
            if (a.type === 'empty_slot' && b.type !== 'empty_slot') return -1;
            if (a.type !== 'empty_slot' && b.type === 'empty_slot') return 1;
            
            if (a.powerIncrease && b.powerIncrease) {
                return b.powerIncrease - a.powerIncrease;
            }
            
            return 0;
        });
    },
    
    // Calculer la valeur d'un objet (pour les comparaisons)
    calculateItemValue(item) {
        if (!item || !item.stats) return 0;
        
        const stats = item.stats;
        const totalStats = (stats.attack || 0) + (stats.defense || 0) + (stats.speed || 0) + (stats.magic || 0);
        
        // Facteur de rareté
        const rarityMultiplier = {
            'common': 1.0,
            'rare': 1.2,
            'epic': 1.5,
            'legendary': 2.0
        };
        
        return totalStats * (rarityMultiplier[item.rarity] || 1.0);
    },
    
    // Appliquer automatiquement les recommandations (achat automatique intelligent)
    applyBestRecommendations(maxBudget = null) {
        const budget = maxBudget || gameState.playerGold;
        const recommendations = this.getRecommendations();
        let spent = 0;
        let purchasesMade = 0;
        
        // Prioriser les slots vides et les meilleures améliorations dans le budget
        for (const rec of recommendations) {
            if (spent + rec.item.price <= budget) {
                const itemIndex = this.shopInventory.findIndex(shopItem => shopItem.id === rec.item.id);
                
                if (itemIndex !== -1 && this.buyItem(itemIndex)) {
                    spent += rec.item.price;
                    purchasesMade++;
                    
                    // Équiper automatiquement l'objet acheté
                    EquipmentSystem.equipItem(rec.character, rec.item.id, rec.slot);
                }
            }
        }
        
        if (typeof UI !== 'undefined' && UI.showNotification) {
            if (purchasesMade > 0) {
                UI.showNotification(`🛒 ${purchasesMade} achat(s) intelligent(s) effectué(s) pour ${spent} 💰`, 'success');
            } else {
                UI.showNotification('💰 Aucun achat recommandé dans votre budget', 'info');
            }
        }
        
        return { purchasesMade, spent };
    },
    
    // Obtenir les offres spéciales du jour
    getDailyDeals() {
        const today = new Date().toDateString();
        const seed = this.hashString(today); // Génère les mêmes offres pour la journée
        
        // Utiliser le seed pour sélectionner des objets spéciaux
        const allItems = this.getShopInventory();
        const dealCount = Math.min(3, Math.floor(allItems.length * 0.3));
        
        const deals = [];
        for (let i = 0; i < dealCount; i++) {
            const index = (seed + i * 7) % allItems.length;
            const item = allItems[index];
            
            if (item && !deals.find(deal => deal.id === item.id)) {
                deals.push({
                    ...item,
                    originalPrice: item.originalPrice || item.price,
                    price: Math.floor(item.price * 0.7), // 30% de réduction
                    discount: 0.3,
                    isDailyDeal: true
                });
            }
        }
        
        return deals;
    },
    
    // Fonction de hachage simple pour générer des offres consistantes
    hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convertir en 32 bits
        }
        return Math.abs(hash);
    },
    
    // Sauvegarder l'état de la boutique
    saveShopState() {
        return {
            shopInventory: this.shopInventory,
            lastRefresh: this.lastRefresh
        };
    },
    
    // Charger l'état de la boutique
    loadShopState(shopState) {
        if (shopState) {
            this.shopInventory = shopState.shopInventory || [];
            this.lastRefresh = shopState.lastRefresh || 0;
            
            // Vérifier si une actualisation est nécessaire
            this.checkAndRefreshShop();
        }
    },
    
    // Mode debug - Ajouter de l'or
    debugAddGold(amount) {
        if (GAME_CONFIG.DEBUG && GAME_CONFIG.DEBUG.ENABLED) {
            gameState.playerGold += amount;
            console.log(`💰 +${amount} or ajouté (debug boutique)`);
            
            if (typeof UI !== 'undefined' && UI.updatePlayerResources) {
                UI.updatePlayerResources();
            }
        }
    },
    
    // Mode debug - Réinitialiser la boutique
    debugResetShop() {
        if (GAME_CONFIG.DEBUG && GAME_CONFIG.DEBUG.ENABLED) {
            this.shopInventory = [];
            this.lastRefresh = 0;
            this.refreshShopInventory();
            console.log('🏪 Boutique réinitialisée (debug)');
        }
    }
};

console.log('🏪 Module ShopSystem chargé');