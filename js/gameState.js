export class GameState {
    constructor() {
        this.player = {
            level: 1,
            gold: 100,
            experience: 0,
            experienceToNext: 1000
        };

        this.professions = {
            // Métiers de récolte
            mining: {
                level: 1,
                experience: 0,
                experienceToNext: 100,
                isActive: false,
                efficiency: 1.0,
                currentNode: 'copper',
                unlockedNodes: ['copper']
            },
            herbalism: {
                level: 1,
                experience: 0,
                experienceToNext: 100,
                isActive: false,
                efficiency: 1.0,
                currentHerb: 'peacebloom',
                unlockedHerbs: ['peacebloom']
            },
            skinning: {
                level: 1,
                experience: 0,
                experienceToNext: 100,
                isActive: false,
                efficiency: 1.0,
                currentAnimal: 'rabbit',
                unlockedAnimals: ['rabbit']
            },
            
            // Métiers de production
            blacksmithing: {
                level: 1,
                experience: 0,
                experienceToNext: 100,
                unlockedRecipes: ['copper_sword', 'copper_dagger'],
                specialization: null
            },
            alchemy: {
                level: 1,
                experience: 0,
                experienceToNext: 100,
                unlockedRecipes: ['minor_healing_potion', 'minor_mana_potion'],
                specialization: null
            },
            tailoring: {
                level: 1,
                experience: 0,
                experienceToNext: 100,
                unlockedRecipes: ['linen_cloth_gloves', 'linen_cloth_boots'],
                specialization: null
            },
            engineering: {
                level: 1,
                experience: 0,
                experienceToNext: 100,
                unlockedRecipes: ['rough_dynamite', 'handful_of_copper_bolts'],
                specialization: null
            }
        };

        this.inventory = {
            // Ressources de base
            resources: {
                // Minerais
                copper_ore: 0,
                tin_ore: 0,
                iron_ore: 0,
                mithril_ore: 0,
                thorium_ore: 0,
                
                // Herbes
                peacebloom: 0,
                silverleaf: 0,
                earthroot: 0,
                mageroyal: 0,
                stranglekelp: 0,
                
                // Cuirs et peaux
                light_leather: 0,
                medium_leather: 0,
                heavy_leather: 0,
                thick_leather: 0,
                
                // Matériaux secondaires
                linen_cloth: 0,
                wool_cloth: 0,
                silk_cloth: 0,
                coal: 0,
                flux: 0
            },
            
            // Objets craftés
            crafted: {
                // Armes forgées
                copper_sword: 0,
                copper_dagger: 0,
                iron_sword: 0,
                steel_sword: 0,
                
                // Potions
                minor_healing_potion: 0,
                minor_mana_potion: 0,
                healing_potion: 0,
                mana_potion: 0,
                
                // Équipements en tissu
                linen_cloth_gloves: 0,
                linen_cloth_boots: 0,
                woolen_cloth_shirt: 0,
                
                // Objets d'ingénierie
                rough_dynamite: 0,
                handful_of_copper_bolts: 0,
                bronze_tube: 0
            }
        };

        this.quests = {
            available: [],
            active: [],
            completed: []
        };

        this.auctionHouse = {
            playerListings: [],
            marketPrices: this.generateInitialMarketPrices(),
            marketTrends: {}
        };

        this.settings = {
            autoSave: true,
            offlineGains: true,
            notifications: true
        };

        this.statistics = {
            totalItemsCrafted: 0,
            totalResourcesGathered: 0,
            totalGoldEarned: 0,
            totalGoldSpent: 0,
            playTime: 0,
            startDate: Date.now()
        };
    }

    generateInitialMarketPrices() {
        return {
            // Minerais
            copper_ore: { base: 2, current: 2, trend: 0 },
            tin_ore: { base: 4, current: 4, trend: 0 },
            iron_ore: { base: 8, current: 8, trend: 0 },
            mithril_ore: { base: 15, current: 15, trend: 0 },
            thorium_ore: { base: 25, current: 25, trend: 0 },
            
            // Herbes
            peacebloom: { base: 1, current: 1, trend: 0 },
            silverleaf: { base: 2, current: 2, trend: 0 },
            earthroot: { base: 4, current: 4, trend: 0 },
            mageroyal: { base: 8, current: 8, trend: 0 },
            stranglekelp: { base: 6, current: 6, trend: 0 },
            
            // Cuirs
            light_leather: { base: 3, current: 3, trend: 0 },
            medium_leather: { base: 6, current: 6, trend: 0 },
            heavy_leather: { base: 12, current: 12, trend: 0 },
            
            // Objets craftés
            copper_sword: { base: 50, current: 50, trend: 0 },
            minor_healing_potion: { base: 15, current: 15, trend: 0 },
            linen_cloth_gloves: { base: 20, current: 20, trend: 0 }
        };
    }

    addResource(resourceName, amount) {
        if (this.inventory.resources.hasOwnProperty(resourceName)) {
            this.inventory.resources[resourceName] += amount;
            this.statistics.totalResourcesGathered += amount;
            return true;
        }
        return false;
    }

    removeResource(resourceName, amount) {
        if (this.inventory.resources.hasOwnProperty(resourceName) && 
            this.inventory.resources[resourceName] >= amount) {
            this.inventory.resources[resourceName] -= amount;
            return true;
        }
        return false;
    }

    addCraftedItem(itemName, amount) {
        if (this.inventory.crafted.hasOwnProperty(itemName)) {
            this.inventory.crafted[itemName] += amount;
            this.statistics.totalItemsCrafted += amount;
            return true;
        }
        return false;
    }

    removeCraftedItem(itemName, amount) {
        if (this.inventory.crafted.hasOwnProperty(itemName) && 
            this.inventory.crafted[itemName] >= amount) {
            this.inventory.crafted[itemName] -= amount;
            return true;
        }
        return false;
    }

    addGold(amount) {
        this.player.gold += amount;
        this.statistics.totalGoldEarned += amount;
    }

    removeGold(amount) {
        if (this.player.gold >= amount) {
            this.player.gold -= amount;
            this.statistics.totalGoldSpent += amount;
            return true;
        }
        return false;
    }

    addProfessionXP(profession, amount) {
        const prof = this.professions[profession];
        if (!prof) return false;

        prof.experience += amount;
        
        // Vérifier le level up
        while (prof.experience >= prof.experienceToNext) {
            prof.experience -= prof.experienceToNext;
            prof.level++;
            prof.experienceToNext = Math.floor(prof.experienceToNext * 1.15);
            
            // Déverrouiller de nouvelles ressources/recettes
            this.checkUnlocks(profession);
        }
        
        return true;
    }

    checkUnlocks(profession) {
        const level = this.professions[profession].level;
        
        switch(profession) {
            case 'mining':
                if (level >= 10 && !this.professions.mining.unlockedNodes.includes('tin')) {
                    this.professions.mining.unlockedNodes.push('tin');
                }
                if (level >= 25 && !this.professions.mining.unlockedNodes.includes('iron')) {
                    this.professions.mining.unlockedNodes.push('iron');
                }
                break;
                
            case 'herbalism':
                if (level >= 10 && !this.professions.herbalism.unlockedHerbs.includes('silverleaf')) {
                    this.professions.herbalism.unlockedHerbs.push('silverleaf');
                }
                if (level >= 25 && !this.professions.herbalism.unlockedHerbs.includes('earthroot')) {
                    this.professions.herbalism.unlockedHerbs.push('earthroot');
                }
                break;
                
            case 'blacksmithing':
                if (level >= 10 && !this.professions.blacksmithing.unlockedRecipes.includes('iron_sword')) {
                    this.professions.blacksmithing.unlockedRecipes.push('iron_sword');
                }
                break;
        }
    }

    getInventoryValue() {
        let totalValue = 0;
        const prices = this.auctionHouse.marketPrices;
        
        // Valeur des ressources
        for (const [resource, amount] of Object.entries(this.inventory.resources)) {
            if (prices[resource] && amount > 0) {
                totalValue += prices[resource].current * amount;
            }
        }
        
        // Valeur des objets craftés
        for (const [item, amount] of Object.entries(this.inventory.crafted)) {
            if (prices[item] && amount > 0) {
                totalValue += prices[item].current * amount;
            }
        }
        
        return totalValue;
    }

    canCraft(recipe) {
        const recipeData = this.getRecipeData(recipe);
        if (!recipeData) return false;
        
        for (const [material, needed] of Object.entries(recipeData.materials)) {
            const available = this.inventory.resources[material] || 0;
            if (available < needed) return false;
        }
        
        return true;
    }

    getRecipeData(recipeName) {
        const recipes = {
            copper_sword: {
                materials: { copper_ore: 3, coal: 1 },
                result: { copper_sword: 1 },
                xp: 10,
                requiredLevel: 1
            },
            copper_dagger: {
                materials: { copper_ore: 2 },
                result: { copper_dagger: 1 },
                xp: 8,
                requiredLevel: 1
            },
            iron_sword: {
                materials: { iron_ore: 4, coal: 2 },
                result: { iron_sword: 1 },
                xp: 25,
                requiredLevel: 10
            },
            minor_healing_potion: {
                materials: { peacebloom: 1, silverleaf: 1 },
                result: { minor_healing_potion: 1 },
                xp: 12,
                requiredLevel: 1
            },
            linen_cloth_gloves: {
                materials: { linen_cloth: 4 },
                result: { linen_cloth_gloves: 1 },
                xp: 15,
                requiredLevel: 1
            }
        };
        
        return recipes[recipeName] || null;
    }

    toJSON() {
        return {
            player: this.player,
            professions: this.professions,
            inventory: this.inventory,
            quests: this.quests,
            auctionHouse: this.auctionHouse,
            settings: this.settings,
            statistics: this.statistics
        };
    }

    fromJSON(data) {
        if (data.player) this.player = { ...this.player, ...data.player };
        if (data.professions) this.professions = { ...this.professions, ...data.professions };
        if (data.inventory) this.inventory = { ...this.inventory, ...data.inventory };
        if (data.quests) this.quests = { ...this.quests, ...data.quests };
        if (data.auctionHouse) this.auctionHouse = { ...this.auctionHouse, ...data.auctionHouse };
        if (data.settings) this.settings = { ...this.settings, ...data.settings };
        if (data.statistics) this.statistics = { ...this.statistics, ...data.statistics };
    }
}