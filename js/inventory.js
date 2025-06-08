export class InventoryManager {
    constructor(gameState) {
        this.gameState = gameState;
        this.itemDefinitions = this.initItemDefinitions();
    }

    initItemDefinitions() {
        return {
            // Ressources - Minerais
            copper_ore: {
                name: 'Minerai de cuivre',
                type: 'resource',
                category: 'mining',
                quality: 'common',
                description: 'Un minerai commun utilisé en forge.',
                stackSize: 200,
                vendorPrice: 1
            },
            tin_ore: {
                name: 'Minerai d\'étain',
                type: 'resource',
                category: 'mining',
                quality: 'common',
                description: 'Un minerai plus rare que le cuivre.',
                stackSize: 200,
                vendorPrice: 2
            },
            iron_ore: {
                name: 'Minerai de fer',
                type: 'resource',
                category: 'mining',
                quality: 'uncommon',
                description: 'Un minerai solide pour l\'artisanat.',
                stackSize: 200,
                vendorPrice: 4
            },

            // Ressources - Herbes
            peacebloom: {
                name: 'Pacifique',
                type: 'resource',
                category: 'herbalism',
                quality: 'common',
                description: 'Une herbe délicate aux propriétés curatives.',
                stackSize: 200,
                vendorPrice: 1
            },
            silverleaf: {
                name: 'Feuillargent',
                type: 'resource',
                category: 'herbalism',
                quality: 'common',
                description: 'Herbe aux reflets argentés.',
                stackSize: 200,
                vendorPrice: 1
            },
            earthroot: {
                name: 'Terrestrine',
                type: 'resource',
                category: 'herbalism',
                quality: 'uncommon',
                description: 'Racine imprégnée de magie terrestre.',
                stackSize: 200,
                vendorPrice: 3
            },

            // Ressources - Cuirs
            light_leather: {
                name: 'Cuir léger',
                type: 'resource',
                category: 'skinning',
                quality: 'common',
                description: 'Cuir souple et facile à travailler.',
                stackSize: 200,
                vendorPrice: 2
            },
            medium_leather: {
                name: 'Cuir moyen',
                type: 'resource',
                category: 'skinning',
                quality: 'common',
                description: 'Cuir plus résistant.',
                stackSize: 200,
                vendorPrice: 4
            },

            // Matériaux secondaires
            coal: {
                name: 'Charbon',
                type: 'resource',
                category: 'mining',
                quality: 'common',
                description: 'Combustible nécessaire à la forge.',
                stackSize: 200,
                vendorPrice: 1
            },
            linen_cloth: {
                name: 'Étoffe de lin',
                type: 'resource',
                category: 'skinning',
                quality: 'common',
                description: 'Tissu de base pour la couture.',
                stackSize: 200,
                vendorPrice: 1
            },

            // Objets craftés - Armes
            copper_sword: {
                name: 'Épée en cuivre',
                type: 'weapon',
                category: 'blacksmithing',
                quality: 'common',
                description: 'Une épée basique mais efficace.',
                stackSize: 1,
                vendorPrice: 25,
                stats: { damage: '8-12', durability: 25 }
            },
            copper_dagger: {
                name: 'Dague en cuivre',
                type: 'weapon',
                category: 'blacksmithing',
                quality: 'common',
                description: 'Arme légère et rapide.',
                stackSize: 1,
                vendorPrice: 18,
                stats: { damage: '5-8', speed: 'Rapide' }
            },
            iron_sword: {
                name: 'Épée en fer',
                type: 'weapon',
                category: 'blacksmithing',
                quality: 'uncommon',
                description: 'Épée solide en fer forgé.',
                stackSize: 1,
                vendorPrice: 45,
                stats: { damage: '15-22', durability: 40 }
            },

            // Objets craftés - Potions
            minor_healing_potion: {
                name: 'Potion de soins mineure',
                type: 'consumable',
                category: 'alchemy',
                quality: 'common',
                description: 'Restaure une petite quantité de vie.',
                stackSize: 20,
                vendorPrice: 8,
                effect: 'Restaure 50-70 PV'
            },
            minor_mana_potion: {
                name: 'Potion de mana mineure',
                type: 'consumable',
                category: 'alchemy',
                quality: 'common',
                description: 'Restaure une petite quantité de mana.',
                stackSize: 20,
                vendorPrice: 10,
                effect: 'Restaure 30-50 PM'
            },

            // Objets craftés - Équipements
            linen_cloth_gloves: {
                name: 'Gants en lin',
                type: 'armor',
                category: 'tailoring',
                quality: 'common',
                description: 'Gants légers en tissu de lin.',
                stackSize: 1,
                vendorPrice: 12,
                stats: { armor: 2, intellect: 1 }
            },
            linen_cloth_boots: {
                name: 'Bottes en lin',
                type: 'armor',
                category: 'tailoring',
                quality: 'common',
                description: 'Bottes confortables en tissu.',
                stackSize: 1,
                vendorPrice: 15,
                stats: { armor: 3, stamina: 1 }
            },

            // Objets d'ingénierie
            rough_dynamite: {
                name: 'Dynamite grossière',
                type: 'explosive',
                category: 'engineering',
                quality: 'common',
                description: 'Explosif basique mais efficace.',
                stackSize: 20,
                vendorPrice: 6,
                effect: 'Dégâts d\'explosion: 50-75'
            },
            handful_of_copper_bolts: {
                name: 'Poignée de boulons en cuivre',
                type: 'component',
                category: 'engineering',
                quality: 'common',
                description: 'Composant de base pour l\'ingénierie.',
                stackSize: 200,
                vendorPrice: 3
            }
        };
    }

    getItemInfo(itemName) {
        return this.itemDefinitions[itemName] || null;
    }

    getAllItemsOfType(type) {
        const items = [];
        for (const [itemName, itemData] of Object.entries(this.itemDefinitions)) {
            if (itemData.type === type) {
                items.push({ name: itemName, ...itemData });
            }
        }
        return items;
    }

    getResourcesByCategory(category) {
        const resources = [];
        for (const [resourceName, amount] of Object.entries(this.gameState.inventory.resources)) {
            const itemInfo = this.getItemInfo(resourceName);
            if (itemInfo && itemInfo.category === category && amount > 0) {
                resources.push({
                    name: resourceName,
                    amount: amount,
                    info: itemInfo
                });
            }
        }
        return resources;
    }

    getCraftedItemsByCategory(category) {
        const items = [];
        for (const [itemName, amount] of Object.entries(this.gameState.inventory.crafted)) {
            const itemInfo = this.getItemInfo(itemName);
            if (itemInfo && itemInfo.category === category && amount > 0) {
                items.push({
                    name: itemName,
                    amount: amount,
                    info: itemInfo
                });
            }
        }
        return items;
    }

    getAllNonEmptyItems() {
        const allItems = [];
        
        // Ajouter les ressources
        for (const [resourceName, amount] of Object.entries(this.gameState.inventory.resources)) {
            if (amount > 0) {
                const itemInfo = this.getItemInfo(resourceName);
                allItems.push({
                    name: resourceName,
                    amount: amount,
                    info: itemInfo,
                    category: 'resource'
                });
            }
        }
        
        // Ajouter les objets craftés
        for (const [itemName, amount] of Object.entries(this.gameState.inventory.crafted)) {
            if (amount > 0) {
                const itemInfo = this.getItemInfo(itemName);
                allItems.push({
                    name: itemName,
                    amount: amount,
                    info: itemInfo,
                    category: 'crafted'
                });
            }
        }
        
        return allItems;
    }

    getItemValue(itemName, amount = 1) {
        const marketPrice = this.gameState.auctionHouse.marketPrices[itemName];
        if (marketPrice) {
            return marketPrice.current * amount;
        }
        
        const itemInfo = this.getItemInfo(itemName);
        return itemInfo ? itemInfo.vendorPrice * amount : 0;
    }

    getTotalInventoryValue() {
        let totalValue = 0;
        
        // Valeur des ressources
        for (const [resourceName, amount] of Object.entries(this.gameState.inventory.resources)) {
            if (amount > 0) {
                totalValue += this.getItemValue(resourceName, amount);
            }
        }
        
        // Valeur des objets craftés
        for (const [itemName, amount] of Object.entries(this.gameState.inventory.crafted)) {
            if (amount > 0) {
                totalValue += this.getItemValue(itemName, amount);
            }
        }
        
        return totalValue;
    }

    sellToVendor(itemName, amount, itemCategory = 'resource') {
        let currentAmount;
        if (itemCategory === 'resource') {
            currentAmount = this.gameState.inventory.resources[itemName] || 0;
        } else {
            currentAmount = this.gameState.inventory.crafted[itemName] || 0;
        }
        
        if (currentAmount < amount) return false;
        
        const itemInfo = this.getItemInfo(itemName);
        if (!itemInfo) return false;
        
        const totalValue = itemInfo.vendorPrice * amount;
        
        // Enlever les objets
        if (itemCategory === 'resource') {
            this.gameState.removeResource(itemName, amount);
        } else {
            this.gameState.removeCraftedItem(itemName, amount);
        }
        
        // Ajouter l'or
        this.gameState.addGold(totalValue);
        
        return totalValue;
    }

    canSellItem(itemName, amount, itemCategory = 'resource') {
        let currentAmount;
        if (itemCategory === 'resource') {
            currentAmount = this.gameState.inventory.resources[itemName] || 0;
        } else {
            currentAmount = this.gameState.inventory.crafted[itemName] || 0;
        }
        
        return currentAmount >= amount;
    }

    getItemsByQuality(quality) {
        const items = [];
        const allItems = this.getAllNonEmptyItems();
        
        for (const item of allItems) {
            if (item.info && item.info.quality === quality) {
                items.push(item);
            }
        }
        
        return items;
    }

    searchItems(searchTerm) {
        const items = [];
        const allItems = this.getAllNonEmptyItems();
        const lowerSearchTerm = searchTerm.toLowerCase();
        
        for (const item of allItems) {
            if (item.info && 
                (item.info.name.toLowerCase().includes(lowerSearchTerm) ||
                 item.info.description.toLowerCase().includes(lowerSearchTerm))) {
                items.push(item);
            }
        }
        
        return items;
    }

    getItemStackInfo(itemName) {
        const itemInfo = this.getItemInfo(itemName);
        if (!itemInfo) return null;
        
        let currentAmount = 0;
        if (this.gameState.inventory.resources[itemName] !== undefined) {
            currentAmount = this.gameState.inventory.resources[itemName];
        } else if (this.gameState.inventory.crafted[itemName] !== undefined) {
            currentAmount = this.gameState.inventory.crafted[itemName];
        }
        
        return {
            current: currentAmount,
            max: itemInfo.stackSize,
            percentage: (currentAmount / itemInfo.stackSize) * 100
        };
    }

    getQualityColor(quality) {
        const colors = {
            common: '#9d9d9d',
            uncommon: '#1eff00',
            rare: '#0070dd',
            epic: '#a335ee',
            legendary: '#ff8000'
        };
        return colors[quality] || '#ffffff';
    }

    formatItemTooltip(itemName) {
        const itemInfo = this.getItemInfo(itemName);
        if (!itemInfo) return '';
        
        let tooltip = `<div class="item-tooltip">`;
        tooltip += `<div class="tooltip-name ${itemInfo.quality}">${itemInfo.name}</div>`;
        
        if (itemInfo.stats) {
            tooltip += `<div class="tooltip-stats">`;
            for (const [stat, value] of Object.entries(itemInfo.stats)) {
                tooltip += `<div>${stat}: ${value}</div>`;
            }
            tooltip += `</div>`;
        }
        
        if (itemInfo.effect) {
            tooltip += `<div class="tooltip-effect">${itemInfo.effect}</div>`;
        }
        
        tooltip += `<div class="tooltip-description">"${itemInfo.description}"</div>`;
        tooltip += `<div class="tooltip-vendor">Prix vendeur: ${itemInfo.vendorPrice} <span class="gold">or</span></div>`;
        tooltip += `</div>`;
        
        return tooltip;
    }

    sortInventory(sortBy = 'name') {
        const allItems = this.getAllNonEmptyItems();
        
        switch(sortBy) {
            case 'name':
                return allItems.sort((a, b) => a.info.name.localeCompare(b.info.name));
            case 'quality':
                const qualityOrder = { common: 1, uncommon: 2, rare: 3, epic: 4, legendary: 5 };
                return allItems.sort((a, b) => {
                    const qualityA = qualityOrder[a.info.quality] || 0;
                    const qualityB = qualityOrder[b.info.quality] || 0;
                    return qualityB - qualityA;
                });
            case 'value':
                return allItems.sort((a, b) => {
                    const valueA = this.getItemValue(a.name, a.amount);
                    const valueB = this.getItemValue(b.name, b.amount);
                    return valueB - valueA;
                });
            case 'category':
                return allItems.sort((a, b) => a.info.category.localeCompare(b.info.category));
            case 'amount':
                return allItems.sort((a, b) => b.amount - a.amount);
            default:
                return allItems;
        }
    }

    getInventoryStats() {
        const allItems = this.getAllNonEmptyItems();
        const stats = {
            totalItems: allItems.length,
            totalValue: this.getTotalInventoryValue(),
            totalStacks: 0,
            byQuality: {
                common: 0,
                uncommon: 0,
                rare: 0,
                epic: 0,
                legendary: 0
            },
            byCategory: {}
        };
        
        for (const item of allItems) {
            stats.totalStacks += item.amount;
            
            if (item.info.quality) {
                stats.byQuality[item.info.quality]++;
            }
            
            if (item.info.category) {
                stats.byCategory[item.info.category] = (stats.byCategory[item.info.category] || 0) + 1;
            }
        }
        
        return stats;
    }
}