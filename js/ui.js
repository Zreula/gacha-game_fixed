export class UIManager {
    constructor(gameState) {
        this.gameState = gameState;
        this.professionManager = null;
        this.inventoryManager = null;
        this.auctionHouse = null;
        this.questManager = null;
    }

    setManagers(professionManager, inventoryManager, auctionHouse, questManager) {
        this.professionManager = professionManager;
        this.inventoryManager = inventoryManager;
        this.auctionHouse = auctionHouse;
        this.questManager = questManager;
    }

    init() {
        this.updatePlayerInfo();
        this.updateProfessionsUI();
        this.updateInventoryUI();
    }

    update() {
        this.updatePlayerInfo();
        this.updateActiveProfessionProgress();
        
        // Mettre à jour l'inventaire moins fréquemment pour éviter le spam
        if (!this.lastInventoryUpdate) this.lastInventoryUpdate = 0;
        const now = Date.now();
        if (now - this.lastInventoryUpdate > 1000) { // Toutes les secondes
            this.updateInventoryNumbers();
            this.lastInventoryUpdate = now;
        }
    }

    updateInventoryNumbers() {
        // Mettre à jour uniquement les nombres dans l'inventaire sans reconstruire l'interface
        const activeTab = document.querySelector('.tab-content.active');
        if (activeTab && activeTab.id === 'inventory') {
            this.updateInventoryUI();
        }
        
        // Mettre à jour les quantités dans les métiers actifs
        const professionsTab = document.getElementById('professions');
        if (professionsTab && professionsTab.classList.contains('active')) {
            const gatheringProfs = ['mining', 'herbalism', 'skinning'];
            gatheringProfs.forEach(profName => {
                if (this.gameState.professions[profName].isActive) {
                    const professionElements = document.querySelectorAll('.profession.gathering');
                    professionElements.forEach(element => {
                        const professionTitle = element.querySelector('h3').textContent;
                        const expectedTitle = this.getProfessionDisplayName(profName);
                        if (professionTitle === expectedTitle) {
                            this.updateResourceQuantities(element, profName);
                        }
                    });
                }
            });
        }
    }

    updatePlayerInfo() {
        const goldElement = document.getElementById('player-gold');
        const levelElement = document.getElementById('player-level');
        
        if (goldElement) {
            goldElement.textContent = `Or: ${Math.floor(this.gameState.player.gold)}`;
        }
        if (levelElement) {
            levelElement.textContent = `Niveau: ${this.gameState.player.level}`;
        }
    }

    updateProfessionsUI() {
        this.updateGatheringProfessions();
        this.updateCraftingProfessions();
    }

    updateGatheringProfessions() {
        const container = document.getElementById('gathering-professions');
        if (!container) return;

        const gatheringProfs = ['mining', 'herbalism', 'skinning'];
        container.innerHTML = '';

        gatheringProfs.forEach(profName => {
            const profData = this.gameState.professions[profName];
            const profDiv = this.createGatheringProfessionElement(profName, profData);
            container.appendChild(profDiv);
        });
    }

    createGatheringProfessionElement(profName, profData) {
        const div = document.createElement('div');
        div.className = 'profession gathering';
        
        const displayName = this.getProfessionDisplayName(profName);
        const currentResource = this.getCurrentResource(profName, profData);
        const isActive = profData.isActive;
        
        div.innerHTML = `
            <div class="profession-header">
                <h3>${displayName}</h3>
                <div class="profession-icon">${this.getProfessionIcon(profName)}</div>
            </div>
            
            <div class="skill-level">
                <span>Niveau ${profData.level}</span>
                <span class="skill-xp">${profData.experience}/${profData.experienceToNext} XP</span>
            </div>
            
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${(profData.experience / profData.experienceToNext) * 100}%"></div>
            </div>
            
            <div class="profession-status">
                <div class="gathering-status">
                    <div class="status-indicator ${isActive ? 'active' : ''}"></div>
                    <span>${isActive ? 'Actif' : 'Inactif'}</span>
                    ${isActive ? `<span class="efficiency-bonus">x${profData.efficiency.toFixed(1)}</span>` : ''}
                </div>
                ${isActive ? this.createGatheringProgress(profName, profData) : ''}
            </div>
            
            <div class="resource-selection">
                <label>Ressource actuelle:</label>
                <select onchange="window.game.professionManager.switchResource('${profName}', this.value); window.game.uiManager.updateProfessionsUI();">
                    ${this.createResourceOptions(profName, profData)}
                </select>
            </div>
            
            <div class="profession-actions">
                <button class="btn ${isActive ? 'btn-stop' : 'btn-start'}" 
                        onclick="this.toggleGathering('${profName}')">
                    ${isActive ? 'Arrêter' : 'Commencer'}
                </button>
                <button class="btn btn-upgrade" 
                        onclick="this.upgradeEfficiency('${profName}')"
                        title="Coût: ${this.professionManager ? this.professionManager.getEfficiencyUpgradeCost(profName) : 0} or">
                    Améliorer (+0.1x)
                </button>
            </div>
            
            <div class="resource-list">
                <h5 style="color: #90CAF9; margin-bottom: 0.5rem;">Ressources collectées:</h5>
                ${this.createResourceList(profName)}
            </div>
        `;

        // Ajouter les event listeners
        this.setupGatheringEventListeners(div, profName);
        return div;
    }

    createGatheringProgress(profName, profData) {
        if (!profData.gatheringProgress && profData.gatheringProgress !== 0) return '';
        
        const resourceData = this.getResourceData(profName, profData);
        if (!resourceData) return '';
        
        const baseTime = resourceData.baseTime;
        const actualTime = baseTime / profData.efficiency;
        const progress = Math.min((profData.gatheringProgress / actualTime) * 100, 100);
        const timeRemaining = Math.max(0, actualTime - profData.gatheringProgress);
        
        return `
            <div class="gathering-progress">
                <div class="progress-bar">
                    <div class="progress-fill gathering-progress-fill" style="width: ${progress}%"></div>
                </div>
                <small class="gathering-time-text">Récolte en cours... (${timeRemaining.toFixed(1)}s restant)</small>
            </div>
        `;
    }

    setupGatheringEventListeners(element, profName) {
        const toggleBtn = element.querySelector('.btn-start, .btn-stop');
        const upgradeBtn = element.querySelector('.btn-upgrade');
        
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                const isActive = this.gameState.professions[profName].isActive;
                if (isActive) {
                    this.professionManager.stopGathering(profName);
                } else {
                    this.professionManager.startGathering(profName);
                }
                // Forcer la mise à jour immédiate de l'interface
                setTimeout(() => {
                    this.updateProfessionsUI();
                }, 50);
            });
        }
        
        if (upgradeBtn) {
            upgradeBtn.addEventListener('click', () => {
                if (this.professionManager.upgradeEfficiency(profName)) {
                    setTimeout(() => {
                        this.updateProfessionsUI();
                    }, 50);
                    this.showNotification(`Efficacité de ${this.getProfessionDisplayName(profName)} améliorée !`);
                } else {
                    this.showNotification('Pas assez d\'or !', 'error');
                }
            });
        }
    }

    updateCraftingProfessions() {
        const container = document.getElementById('crafting-professions');
        if (!container) return;

        const craftingProfs = ['blacksmithing', 'alchemy', 'tailoring', 'engineering'];
        container.innerHTML = '';

        craftingProfs.forEach(profName => {
            const profData = this.gameState.professions[profName];
            const profDiv = this.createCraftingProfessionElement(profName, profData);
            container.appendChild(profDiv);
        });
    }

    createCraftingProfessionElement(profName, profData) {
        const div = document.createElement('div');
        div.className = 'profession crafting';
        
        const displayName = this.getProfessionDisplayName(profName);
        const recipes = this.getAvailableRecipes(profName, profData);
        
        div.innerHTML = `
            <div class="profession-header">
                <h3>${displayName}</h3>
                <div class="profession-icon">${this.getProfessionIcon(profName)}</div>
            </div>
            
            <div class="skill-level">
                <span>Niveau ${profData.level}</span>
                <span class="skill-xp">${profData.experience}/${profData.experienceToNext} XP</span>
            </div>
            
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${(profData.experience / profData.experienceToNext) * 100}%"></div>
            </div>
            
            <div class="craft-interface">
                <h4>Recettes disponibles</h4>
                <div class="recipe-list">
                    ${recipes.map(recipe => this.createRecipeElement(recipe)).join('')}
                </div>
            </div>
        `;

        return div;
    }

    createRecipeElement(recipe) {
        const canCraft = this.gameState.canCraft(recipe.name);
        const materials = this.getRecipeMaterialsDisplay(recipe);
        
        return `
            <div class="recipe ${canCraft ? 'craftable' : 'not-craftable'}">
                <div class="recipe-header">
                    <span class="recipe-name">${recipe.displayName}</span>
                    <span class="recipe-level">Niveau ${recipe.requiredLevel}</span>
                </div>
                
                <div class="recipe-materials">
                    ${materials}
                </div>
                
                <div class="recipe-actions">
                    <input type="number" class="craft-amount" min="1" max="10" value="1" 
                           id="amount-${recipe.name}">
                    <button class="btn ${canCraft ? '' : 'btn-disabled'}" 
                            onclick="this.craftItem('${recipe.name}')"
                            ${!canCraft ? 'disabled' : ''}>
                        Créer
                    </button>
                </div>
            </div>
        `;
    }

    getRecipeMaterialsDisplay(recipe) {
        const recipeData = this.gameState.getRecipeData(recipe.name);
        if (!recipeData) return '';
        
        return Object.entries(recipeData.materials).map(([material, needed]) => {
            const available = this.gameState.inventory.resources[material] || 0;
            const sufficient = available >= needed;
            const itemInfo = this.inventoryManager.getItemInfo(material);
            const materialName = itemInfo ? itemInfo.name : material;
            
            return `<span class="material ${sufficient ? '' : 'insufficient'}">
                ${materialName}: ${available}/${needed}
            </span>`;
        }).join(', ');
    }

    updateInventoryUI() {
        this.updateResourcesInventory();
        this.updateCraftedInventory();
    }

    updateResourcesInventory() {
        const container = document.getElementById('resources-inventory');
        if (!container) return;

        const allResources = this.inventoryManager.getAllNonEmptyItems()
            .filter(item => item.category === 'resource');

        container.innerHTML = '';
        
        if (allResources.length === 0) {
            container.innerHTML = '<p class="empty-inventory">Aucune ressource</p>';
            return;
        }

        allResources.forEach(item => {
            const itemDiv = this.createInventoryItemElement(item);
            container.appendChild(itemDiv);
        });
    }

    updateCraftedInventory() {
        const container = document.getElementById('crafted-inventory');
        if (!container) return;

        const allCrafted = this.inventoryManager.getAllNonEmptyItems()
            .filter(item => item.category === 'crafted');

        container.innerHTML = '';
        
        if (allCrafted.length === 0) {
            container.innerHTML = '<p class="empty-inventory">Aucun objet crafté</p>';
            return;
        }

        allCrafted.forEach(item => {
            const itemDiv = this.createInventoryItemElement(item);
            container.appendChild(itemDiv);
        });
    }

    createInventoryItemElement(item) {
        const div = document.createElement('div');
        div.className = 'inventory-item';
        
        const value = this.inventoryManager.getItemValue(item.name, item.amount);
        
        div.innerHTML = `
            <div class="item-header">
                <span class="item-name ${item.info.quality}">${item.info.name}</span>
                <div class="item-icon"></div>
            </div>
            
            <div class="item-quantity">${item.amount}</div>
            
            <div class="item-info">
                <div class="item-value">Valeur: ${value} or</div>
                <div class="item-description">${item.info.description}</div>
            </div>
            
            <div class="item-actions">
                <button class="btn btn-small" onclick="this.sellToVendor('${item.name}', 1, '${item.category}')">
                    Vendre (${item.info.vendorPrice} or)
                </button>
            </div>
        `;

        return div;
    }

    updateActiveProfessionProgress() {
        // Mise à jour en temps réel des barres de progression des métiers actifs
        const gatheringProfs = ['mining', 'herbalism', 'skinning'];
        
        gatheringProfs.forEach(profName => {
            const profData = this.gameState.professions[profName];
            if (profData.isActive && profData.gatheringProgress !== undefined) {
                // Trouver l'élément de progression spécifique à ce métier
                const professionElements = document.querySelectorAll('.profession.gathering');
                
                professionElements.forEach(element => {
                    const professionTitle = element.querySelector('h3').textContent;
                    const expectedTitle = this.getProfessionDisplayName(profName);
                    
                    if (professionTitle === expectedTitle) {
                        const progressElement = element.querySelector('.gathering-progress-fill');
                        const timeText = element.querySelector('.gathering-time-text');
                        
                        if (progressElement && timeText) {
                            const resourceData = this.getResourceData(profName, profData);
                            if (resourceData) {
                                const actualTime = resourceData.baseTime / profData.efficiency;
                                const progress = Math.min((profData.gatheringProgress / actualTime) * 100, 100);
                                const timeRemaining = Math.max(0, actualTime - profData.gatheringProgress);
                                
                                progressElement.style.width = `${progress}%`;
                                timeText.textContent = `Récolte en cours... (${timeRemaining.toFixed(1)}s restant)`;
                            }
                        }
                        
                        // Mettre à jour les quantités de ressources affichées
                        this.updateResourceQuantities(element, profName);
                    }
                });
            }
        });
    }

    updateResourceQuantities(professionElement, profName) {
        // Mettre à jour les quantités affichées dans la section métier
        const resourceItems = professionElement.querySelectorAll('.resource-item');
        
        resourceItems.forEach(item => {
            const resourceName = item.querySelector('.resource-name');
            const resourceAmount = item.querySelector('.resource-amount');
            
            if (resourceName && resourceAmount) {
                const resourceKey = this.getResourceKeyFromDisplay(resourceName.textContent, profName);
                if (resourceKey && this.gameState.inventory.resources[resourceKey] !== undefined) {
                    resourceAmount.textContent = this.gameState.inventory.resources[resourceKey];
                }
            }
        });
    }

    createResourceList(profName) {
        const resourceMappings = {
            mining: ['copper_ore', 'tin_ore', 'iron_ore', 'mithril_ore', 'coal'],
            herbalism: ['peacebloom', 'silverleaf', 'earthroot', 'mageroyal'],
            skinning: ['light_leather', 'medium_leather', 'heavy_leather', 'linen_cloth']
        };
        
        const relevantResources = resourceMappings[profName] || [];
        
        return relevantResources.map(resourceKey => {
            const amount = this.gameState.inventory.resources[resourceKey] || 0;
            const itemInfo = this.inventoryManager.getItemInfo(resourceKey);
            const displayName = itemInfo ? itemInfo.name : resourceKey;
            
            return `
                <div class="resource-item">
                    <span class="resource-name">${displayName}</span>
                    <span class="resource-amount">${amount}</span>
                </div>
            `;
        }).join('');
    }

    // Méthodes utilitaires
    getProfessionDisplayName(profName) {
        const names = {
            mining: 'Minage',
            herbalism: 'Herboristerie',
            skinning: 'Dépeçage',
            blacksmithing: 'Forge',
            alchemy: 'Alchimie',
            tailoring: 'Couture',
            engineering: 'Ingénierie'
        };
        return names[profName] || profName;
    }

    getProfessionIcon(profName) {
        const icons = {
            mining: '⛏️',
            herbalism: '🌿',
            skinning: '🔪',
            blacksmithing: '🔨',
            alchemy: '🧪',
            tailoring: '🧵',
            engineering: '⚙️'
        };
        return icons[profName] || '?';
    }

    getCurrentResource(profName, profData) {
        if (profName === 'mining') return profData.currentNode;
        if (profName === 'herbalism') return profData.currentHerb;
        if (profName === 'skinning') return profData.currentAnimal;
        return '';
    }

    createResourceOptions(profName, profData) {
        let options = '';
        let availableResources = [];
        
        if (profName === 'mining') {
            availableResources = profData.unlockedNodes;
        } else if (profName === 'herbalism') {
            availableResources = profData.unlockedHerbs;
        } else if (profName === 'skinning') {
            availableResources = profData.unlockedAnimals;
        }
        
        const currentResource = this.getCurrentResource(profName, profData);
        
        availableResources.forEach(resource => {
            const selected = resource === currentResource ? 'selected' : '';
            const displayName = this.getResourceDisplayName(resource);
            options += `<option value="${resource}" ${selected}>${displayName}</option>`;
        });
        
        return options;
    }

    getResourceDisplayName(resource) {
        const names = {
            copper: 'Cuivre',
            tin: 'Étain',
            iron: 'Fer',
            mithril: 'Mithril',
            peacebloom: 'Pacifique',
            silverleaf: 'Feuillargent',
            earthroot: 'Terrestrine',
            rabbit: 'Lapins',
            wolf: 'Loups',
            bear: 'Ours'
        };
        return names[resource] || resource;
    }

    getResourceData(profName, profData) {
        if (!this.professionManager) return null;
        
        const gatheringData = this.professionManager.gatheringData[profName];
        if (!gatheringData) return null;
        
        const currentResource = this.getCurrentResource(profName, profData);
        
        if (profName === 'mining') {
            return gatheringData.nodes[currentResource];
        } else if (profName === 'herbalism') {
            return gatheringData.herbs[currentResource];
        } else if (profName === 'skinning') {
            return gatheringData.animals[currentResource];
        }
        
        return null;
    }

    getAvailableRecipes(profName, profData) {
        const allRecipes = {
            blacksmithing: [
                { name: 'copper_sword', displayName: 'Épée en cuivre', requiredLevel: 1 },
                { name: 'copper_dagger', displayName: 'Dague en cuivre', requiredLevel: 1 },
                { name: 'iron_sword', displayName: 'Épée en fer', requiredLevel: 10 }
            ],
            alchemy: [
                { name: 'minor_healing_potion', displayName: 'Potion de soins mineure', requiredLevel: 1 },
                { name: 'minor_mana_potion', displayName: 'Potion de mana mineure', requiredLevel: 1 }
            ],
            tailoring: [
                { name: 'linen_cloth_gloves', displayName: 'Gants en lin', requiredLevel: 1 },
                { name: 'linen_cloth_boots', displayName: 'Bottes en lin', requiredLevel: 1 }
            ],
            engineering: [
                { name: 'rough_dynamite', displayName: 'Dynamite grossière', requiredLevel: 1 },
                { name: 'handful_of_copper_bolts', displayName: 'Boulons en cuivre', requiredLevel: 1 }
            ]
        };
        
        const recipes = allRecipes[profName] || [];
        return recipes.filter(recipe => 
            profData.unlockedRecipes.includes(recipe.name) && 
            profData.level >= recipe.requiredLevel
        );
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#f44336' : '#4CAF50'};
            color: white;
            padding: 1rem;
            border-radius: 5px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    updateAuctionHouseUI() {
        this.updateSellInterface();
        this.updateBuyInterface();
    }

    updateSellInterface() {
        const container = document.getElementById('sell-interface');
        if (!container) return;

        const sellableItems = this.inventoryManager.getAllNonEmptyItems();
        
        container.innerHTML = `
            <div class="quick-sell" style="margin-bottom: 1rem;">
                <h4 style="color: #ffd700; margin-bottom: 0.5rem;">Vente Rapide</h4>
                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                    ${sellableItems.slice(0, 6).map(item => `
                        <button class="quick-sell-btn" onclick="quickSellItem('${item.name}', 1, '${item.category}')"
                                style="background: #FF9800; border: none; color: white; padding: 0.3rem 0.6rem; border-radius: 3px; cursor: pointer;">
                            ${item.info.name} (${Math.floor(this.auctionHouse.getMarketPrice(item.name)?.current * 0.9 || item.info.vendorPrice)} or)
                        </button>
                    `).join('')}
                </div>
            </div>

            <div class="sell-list">
                <h4 style="color: #ffd700; margin-bottom: 1rem;">Vos Objets</h4>
                ${sellableItems.length > 0 
                    ? sellableItems.map(item => this.createSellItemElement(item)).join('')
                    : '<p>Aucun objet à vendre</p>'
                }
            </div>
        `;
    }

    createSellItemElement(item) {
        const marketPrice = this.auctionHouse.getMarketPrice(item.name);
        const recommendedPrice = this.auctionHouse.getRecommendedPrice(item.name);
        
        return `
            <div class="auction-item" style="
                background: rgba(0,0,0,0.3);
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 5px;
                padding: 1rem;
                margin-bottom: 0.5rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
            ">
                <div class="auction-info" style="flex: 1;">
                    <div class="auction-item-name" style="font-weight: bold; color: #E0E0E0; margin-bottom: 0.25rem;">
                        ${item.info.name}
                    </div>
                    <div style="font-size: 0.9rem; color: #90CAF9;">
                        Quantité: ${item.amount} | 
                        Prix marché: ${marketPrice ? Math.floor(marketPrice.current) : 'N/A'} or |
                        Recommandé: ${recommendedPrice} or
                    </div>
                </div>
                
                <div class="auction-actions" style="display: flex; gap: 0.5rem; align-items: center;">
                    <input type="number" class="price-input" placeholder="${recommendedPrice}" 
                           style="width: 80px; padding: 0.3rem; border: 1px solid #666; border-radius: 3px; background: rgba(0,0,0,0.3); color: white;"
                           id="price-${item.name}">
                    <input type="number" class="amount-input" placeholder="1" max="${item.amount}" min="1"
                           style="width: 60px; padding: 0.3rem; border: 1px solid #666; border-radius: 3px; background: rgba(0,0,0,0.3); color: white;"
                           id="amount-${item.name}">
                    <button class="btn" onclick="sellItemToAuction('${item.name}', '${item.category}')"
                            style="background: #4CAF50;">
                        Vendre
                    </button>
                </div>
            </div>
        `;
    }

    updateBuyInterface() {
        const container = document.getElementById('buy-interface');
        if (!container) return;

        const marketItems = Object.entries(this.gameState.auctionHouse.marketPrices);
        
        container.innerHTML = `
            <div class="market-trends" style="
                background: rgba(255,255,255,0.05);
                border-radius: 5px;
                padding: 0.8rem;
                margin-bottom: 1rem;
            ">
                <h4 style="color: #ffd700; margin-bottom: 0.5rem;">Tendances du Marché</h4>
                ${marketItems.slice(0, 5).map(([item, price]) => `
                    <div class="trend-item" style="
                        display: flex;
                        justify-content: space-between;
                        margin: 0.3rem 0;
                        font-size: 0.9rem;
                    ">
                        <span>${this.inventoryManager.getItemInfo(item)?.name || item}</span>
                        <span class="${price.trend > 0 ? 'trend-up' : price.trend < 0 ? 'trend-down' : 'trend-stable'}"
                              style="color: ${price.trend > 0 ? '#4CAF50' : price.trend < 0 ? '#f44336' : '#90CAF9'};">
                            ${Math.floor(price.current)} or 
                            ${price.trend > 0 ? '↗' : price.trend < 0 ? '↘' : '→'}
                        </span>
                    </div>
                `).join('')}
            </div>

            <div class="market-items">
                <h4 style="color: #ffd700; margin-bottom: 1rem;">Marché</h4>
                <p style="color: #ccc; font-style: italic;">
                    Fonctionnalité d'achat à venir - Pour l'instant vous ne pouvez que vendre
                </p>
            </div>
        `;
    }

    updateQuestsUI() {
        const container = document.getElementById('available-quests');
        if (!container) return;

        const availableQuests = this.gameState.quests.available;
        const activeQuests = this.gameState.quests.active;

        container.innerHTML = '';

        // Section des quêtes actives
        if (activeQuests.length > 0) {
            const activeSection = document.createElement('div');
            activeSection.innerHTML = `
                <h3 style="color: #4CAF50; margin-bottom: 1rem;">Quêtes Actives (${activeQuests.length}/3)</h3>
                <div class="active-quests">
                    ${activeQuests.map(quest => this.createActiveQuestElement(quest)).join('')}
                </div>
            `;
            container.appendChild(activeSection);
        }

        // Section des quêtes disponibles
        const availableSection = document.createElement('div');
        availableSection.innerHTML = `
            <h3 style="color: #ffd700; margin-bottom: 1rem; margin-top: 2rem;">Quêtes Disponibles</h3>
            <div class="available-quests">
                ${availableQuests.length > 0 
                    ? availableQuests.map(quest => this.createAvailableQuestElement(quest)).join('')
                    : '<p class="no-quests">Aucune quête disponible</p>'
                }
            </div>
        `;
        container.appendChild(availableSection);
    }

    createActiveQuestElement(quest) {
        const progress = this.questManager.getActiveQuestProgress(quest.id);
        const timeRemaining = this.questManager.formatTimeRemaining(quest.timeRemaining);
        const canComplete = this.questManager.isQuestComplete(quest);

        return `
            <div class="quest-item active-quest" style="
                background: rgba(76, 175, 80, 0.1);
                border: 1px solid #4CAF50;
                border-radius: 8px;
                padding: 1rem;
                margin-bottom: 1rem;
            ">
                <div class="quest-header" style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div>
                        <h4 style="color: #4CAF50; margin: 0;">${quest.title}</h4>
                        <p style="color: #ccc; font-size: 0.9rem; margin: 0.25rem 0;">${quest.description}</p>
                    </div>
                    <span class="quest-difficulty" style="
                        background: ${this.questManager.getDifficultyColor(quest.difficulty)};
                        color: white;
                        padding: 0.2rem 0.5rem;
                        border-radius: 3px;
                        font-size: 0.8rem;
                    ">${this.questManager.getDifficultyDisplayName(quest.difficulty)}</span>
                </div>

                <div class="quest-progress" style="margin: 1rem 0;">
                    ${Object.entries(progress.progress).map(([item, prog]) => `
                        <div class="progress-item" style="margin: 0.5rem 0;">
                            <div style="display: flex; justify-content: space-between;">
                                <span>${this.inventoryManager.getItemInfo(item)?.name || item}</span>
                                <span style="color: ${prog.current >= prog.required ? '#4CAF50' : '#f44336'};">
                                    ${prog.current}/${prog.required}
                                </span>
                            </div>
                            <div class="progress-bar" style="
                                width: 100%;
                                height: 8px;
                                background: rgba(0,0,0,0.3);
                                border-radius: 4px;
                                overflow: hidden;
                                margin-top: 0.25rem;
                            ">
                                <div class="progress-fill" style="
                                    height: 100%;
                                    background: ${prog.current >= prog.required ? '#4CAF50' : '#FF9800'};
                                    width: ${prog.percentage}%;
                                    transition: width 0.3s ease;
                                "></div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="quest-footer" style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="color: #90CAF9; font-size: 0.9rem;">
                        Temps restant: ${timeRemaining}
                    </span>
                    <div class="quest-actions" style="display: flex; gap: 0.5rem;">
                        <button class="btn ${canComplete ? 'btn-complete' : 'btn-disabled'}" 
                                onclick="completeQuest('${quest.id}')"
                                ${!canComplete ? 'disabled' : ''}
                                style="background: ${canComplete ? '#4CAF50' : '#666'};">
                            ${canComplete ? 'Terminer' : 'En cours'}
                        </button>
                        <button class="btn btn-abandon" 
                                onclick="abandonQuest('${quest.id}')"
                                style="background: #f44336;">
                            Abandonner
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    createAvailableQuestElement(quest) {
        const rewards = Object.entries(quest.rewards).map(([type, value]) => {
            if (type === 'gold') return `${value} or`;
            if (type === 'experience') return `${value} XP`;
            return `${type}: ${value}`;
        }).join(', ');

        const requirements = Object.entries(quest.requirements).map(([item, amount]) => {
            const itemInfo = this.inventoryManager.getItemInfo(item);
            const itemName = itemInfo ? itemInfo.name : item;
            return `${amount} ${itemName}`;
        }).join(', ');

        const timeLimit = this.questManager.formatTimeRemaining(quest.duration);

        return `
            <div class="quest-item available-quest" style="
                background: rgba(255,255,255,0.05);
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 8px;
                padding: 1rem;
                margin-bottom: 1rem;
                transition: all 0.3s ease;
            " onmouseover="this.style.borderColor='#ffd700'" onmouseout="this.style.borderColor='rgba(255,255,255,0.1)'">
                <div class="quest-header" style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div style="flex: 1;">
                        <h4 style="color: #ffd700; margin: 0;">${quest.title}</h4>
                        <p style="color: #ccc; font-size: 0.9rem; margin: 0.25rem 0;">${quest.description}</p>
                    </div>
                    <span class="quest-difficulty" style="
                        background: ${this.questManager.getDifficultyColor(quest.difficulty)};
                        color: white;
                        padding: 0.2rem 0.5rem;
                        border-radius: 3px;
                        font-size: 0.8rem;
                        margin-left: 1rem;
                    ">${this.questManager.getDifficultyDisplayName(quest.difficulty)}</span>
                </div>

                <div class="quest-details" style="margin: 1rem 0;">
                    <div style="margin-bottom: 0.5rem;">
                        <strong style="color: #90CAF9;">Objectifs:</strong>
                        <span style="color: #E0E0E0; margin-left: 0.5rem;">${requirements}</span>
                    </div>
                    <div style="margin-bottom: 0.5rem;">
                        <strong style="color: #4CAF50;">Récompenses:</strong>
                        <span style="color: #E0E0E0; margin-left: 0.5rem;">${rewards}</span>
                    </div>
                    <div>
                        <strong style="color: #FF9800;">Limite de temps:</strong>
                        <span style="color: #E0E0E0; margin-left: 0.5rem;">${timeLimit}</span>
                    </div>
                </div>

                <div class="quest-footer" style="text-align: right;">
                    <button class="btn btn-accept" 
                            onclick="acceptQuest('${quest.id}')"
                            style="background: #2196F3; color: white;">
                        Accepter
                    </button>
                </div>
            </div>
        `;
    }
}