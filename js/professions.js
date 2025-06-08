export class ProfessionManager {
    constructor(gameState) {
        this.gameState = gameState;
        this.gatheringData = this.initGatheringData();
        this.offlineGains = [];
    }

    initGatheringData() {
        return {
            mining: {
                nodes: {
                    copper: { 
                        resource: 'copper_ore', 
                        baseTime: 3, 
                        xp: 5, 
                        requiredLevel: 1,
                        amount: [1, 2] // min, max
                    },
                    tin: { 
                        resource: 'tin_ore', 
                        baseTime: 4, 
                        xp: 8, 
                        requiredLevel: 10,
                        amount: [1, 2]
                    },
                    iron: { 
                        resource: 'iron_ore', 
                        baseTime: 5, 
                        xp: 12, 
                        requiredLevel: 25,
                        amount: [1, 2]
                    },
                    mithril: { 
                        resource: 'mithril_ore', 
                        baseTime: 7, 
                        xp: 20, 
                        requiredLevel: 50,
                        amount: [1, 3]
                    }
                }
            },
            herbalism: {
                herbs: {
                    peacebloom: { 
                        resource: 'peacebloom', 
                        baseTime: 2.5, 
                        xp: 4, 
                        requiredLevel: 1,
                        amount: [1, 3]
                    },
                    silverleaf: { 
                        resource: 'silverleaf', 
                        baseTime: 3, 
                        xp: 6, 
                        requiredLevel: 10,
                        amount: [1, 2]
                    },
                    earthroot: { 
                        resource: 'earthroot', 
                        baseTime: 4, 
                        xp: 10, 
                        requiredLevel: 25,
                        amount: [1, 2]
                    },
                    mageroyal: { 
                        resource: 'mageroyal', 
                        baseTime: 5, 
                        xp: 15, 
                        requiredLevel: 40,
                        amount: [1, 2]
                    }
                }
            },
            skinning: {
                animals: {
                    rabbit: { 
                        resource: 'light_leather', 
                        baseTime: 2, 
                        xp: 3, 
                        requiredLevel: 1,
                        amount: [1, 2]
                    },
                    wolf: { 
                        resource: 'medium_leather', 
                        baseTime: 3.5, 
                        xp: 8, 
                        requiredLevel: 15,
                        amount: [1, 2]
                    },
                    bear: { 
                        resource: 'heavy_leather', 
                        baseTime: 5, 
                        xp: 15, 
                        requiredLevel: 35,
                        amount: [1, 3]
                    }
                }
            }
        };
    }

    update(deltaTime) {
        // Mettre à jour les métiers de récolte actifs
        for (const [profName, profData] of Object.entries(this.gameState.professions)) {
            if (profData.isActive && this.isGatheringProfession(profName)) {
                this.updateGathering(profName, deltaTime);
            }
        }
    }

    isGatheringProfession(profession) {
        return ['mining', 'herbalism', 'skinning'].includes(profession);
    }

    updateGathering(profession, deltaTime) {
        const profData = this.gameState.professions[profession];
        const gatheringInfo = this.gatheringData[profession];
        
        // Initialiser la progression si nécessaire
        if (profData.gatheringProgress === undefined) {
            profData.gatheringProgress = 0;
        }

        // Calculer le temps nécessaire selon le type de ressource actuelle
        let currentResource;
        let resourceData;
        
        if (profession === 'mining') {
            currentResource = profData.currentNode;
            resourceData = gatheringInfo.nodes[currentResource];
        } else if (profession === 'herbalism') {
            currentResource = profData.currentHerb;
            resourceData = gatheringInfo.herbs[currentResource];
        } else if (profession === 'skinning') {
            currentResource = profData.currentAnimal;
            resourceData = gatheringInfo.animals[currentResource];
        }

        if (!resourceData) return;

        const baseTime = resourceData.baseTime;
        const actualTime = baseTime / profData.efficiency;

        // Incrémenter la progression
        profData.gatheringProgress += deltaTime;

        // Compléter la récolte si le temps est écoulé
        if (profData.gatheringProgress >= actualTime) {
            // Calculer combien de récoltes complètes on peut faire
            const completedGatherings = Math.floor(profData.gatheringProgress / actualTime);
            
            for (let i = 0; i < completedGatherings; i++) {
                this.completeGathering(profession, resourceData);
            }
            
            // Garder le reste de progression pour le prochain cycle
            profData.gatheringProgress = profData.gatheringProgress % actualTime;
        }
    }

    completeGathering(profession, resourceData) {
        const profData = this.gameState.professions[profession];
        
        // Calculer la quantité récoltée
        const [minAmount, maxAmount] = resourceData.amount;
        const amount = Math.floor(Math.random() * (maxAmount - minAmount + 1)) + minAmount;
        
        // Bonus d'efficacité pour plus de ressources
        const bonusChance = (profData.efficiency - 1) * 0.5;
        const finalAmount = Math.random() < bonusChance ? amount + 1 : amount;

        // Ajouter les ressources
        this.gameState.addResource(resourceData.resource, finalAmount);
        
        // Ajouter l'expérience
        this.gameState.addProfessionXP(profession, resourceData.xp);
        
        // Chance de bonus de charbon pour le minage
        if (profession === 'mining' && Math.random() < 0.15) {
            this.gameState.addResource('coal', 1);
        }
        
        // Chance de linen cloth pour le skinning
        if (profession === 'skinning' && Math.random() < 0.1) {
            this.gameState.addResource('linen_cloth', 1);
        }
    }

    startGathering(profession) {
        if (!this.isGatheringProfession(profession)) return false;
        
        // Arrêter les autres métiers de récolte
        for (const prof of ['mining', 'herbalism', 'skinning']) {
            this.gameState.professions[prof].isActive = false;
            this.gameState.professions[prof].gatheringProgress = 0;
        }
        
        this.gameState.professions[profession].isActive = true;
        this.gameState.professions[profession].gatheringProgress = 0;
        return true;
    }

    stopGathering(profession) {
        this.gameState.professions[profession].isActive = false;
        this.gameState.professions[profession].gatheringProgress = 0;
    }

    switchResource(profession, resourceName) {
        const profData = this.gameState.professions[profession];
        const gatheringInfo = this.gatheringData[profession];
        
        let resourceData;
        if (profession === 'mining') {
            resourceData = gatheringInfo.nodes[resourceName];
            if (resourceData && profData.unlockedNodes.includes(resourceName)) {
                profData.currentNode = resourceName;
                profData.gatheringProgress = 0;
                return true;
            }
        } else if (profession === 'herbalism') {
            resourceData = gatheringInfo.herbs[resourceName];
            if (resourceData && profData.unlockedHerbs.includes(resourceName)) {
                profData.currentHerb = resourceName;
                profData.gatheringProgress = 0;
                return true;
            }
        } else if (profession === 'skinning') {
            resourceData = gatheringInfo.animals[resourceName];
            if (resourceData && profData.unlockedAnimals.includes(resourceName)) {
                profData.currentAnimal = resourceName;
                profData.gatheringProgress = 0;
                return true;
            }
        }
        
        return false;
    }

    craftItem(recipe, amount = 1) {
        const recipeData = this.gameState.getRecipeData(recipe);
        if (!recipeData) return false;

        // Vérifier les matériaux pour la quantité demandée
        for (const [material, needed] of Object.entries(recipeData.materials)) {
            const available = this.gameState.inventory.resources[material] || 0;
            if (available < needed * amount) return false;
        }

        // Déterminer le métier
        const profession = this.getRecipeProfession(recipe);
        if (!profession) return false;

        const profData = this.gameState.professions[profession];
        if (profData.level < recipeData.requiredLevel) return false;

        // Consommer les matériaux
        for (const [material, needed] of Object.entries(recipeData.materials)) {
            this.gameState.removeResource(material, needed * amount);
        }

        // Créer les objets
        for (const [item, quantity] of Object.entries(recipeData.result)) {
            this.gameState.addCraftedItem(item, quantity * amount);
        }

        // Ajouter l'expérience
        this.gameState.addProfessionXP(profession, recipeData.xp * amount);

        return true;
    }

    getRecipeProfession(recipe) {
        const professionRecipes = {
            blacksmithing: ['copper_sword', 'copper_dagger', 'iron_sword', 'steel_sword'],
            alchemy: ['minor_healing_potion', 'minor_mana_potion', 'healing_potion'],
            tailoring: ['linen_cloth_gloves', 'linen_cloth_boots', 'woolen_cloth_shirt'],
            engineering: ['rough_dynamite', 'handful_of_copper_bolts', 'bronze_tube']
        };

        for (const [profession, recipes] of Object.entries(professionRecipes)) {
            if (recipes.includes(recipe)) return profession;
        }
        return null;
    }

    processOfflineGains(offlineTime) {
        this.offlineGains = [];
        
        // Traiter les gains de récolte offline
        for (const [profName, profData] of Object.entries(this.gameState.professions)) {
            if (profData.isActive && this.isGatheringProfession(profName)) {
                const gains = this.calculateOfflineGatheringGains(profName, offlineTime);
                if (gains.resources > 0) {
                    this.offlineGains.push({
                        profession: profName,
                        ...gains
                    });
                }
            }
        }
    }

    calculateOfflineGatheringGains(profession, offlineTime) {
        const profData = this.gameState.professions[profession];
        const gatheringInfo = this.gatheringData[profession];
        
        let currentResource;
        let resourceData;
        
        if (profession === 'mining') {
            currentResource = profData.currentNode;
            resourceData = gatheringInfo.nodes[currentResource];
        } else if (profession === 'herbalism') {
            currentResource = profData.currentHerb;
            resourceData = gatheringInfo.herbs[currentResource];
        } else if (profession === 'skinning') {
            currentResource = profData.currentAnimal;
            resourceData = gatheringInfo.animals[currentResource];
        }

        if (!resourceData) return { resources: 0, xp: 0 };

        const baseTime = resourceData.baseTime;
        const actualTime = baseTime / profData.efficiency;
        const gatherings = Math.floor(offlineTime / actualTime);
        
        // Limiter les gains offline à 8 heures max
        const maxGatherings = Math.floor((8 * 3600) / actualTime);
        const finalGatherings = Math.min(gatherings, maxGatherings);

        if (finalGatherings > 0) {
            const avgAmount = (resourceData.amount[0] + resourceData.amount[1]) / 2;
            const totalResources = Math.floor(finalGatherings * avgAmount);
            const totalXP = finalGatherings * resourceData.xp;

            // Appliquer les gains
            this.gameState.addResource(resourceData.resource, totalResources);
            this.gameState.addProfessionXP(profession, totalXP);

            return {
                resources: totalResources,
                resourceType: resourceData.resource,
                xp: totalXP,
                gatherings: finalGatherings
            };
        }

        return { resources: 0, xp: 0 };
    }

    upgradeEfficiency(profession) {
        const profData = this.gameState.professions[profession];
        const cost = Math.floor(1000 * Math.pow(1.5, profData.efficiency - 1));
        
        if (this.gameState.removeGold(cost)) {
            profData.efficiency += 0.1;
            return true;
        }
        return false;
    }

    getEfficiencyUpgradeCost(profession) {
        const profData = this.gameState.professions[profession];
        return Math.floor(1000 * Math.pow(1.5, profData.efficiency - 1));
    }
}