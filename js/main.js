import { GameState } from './gameState.js';
import { ProfessionManager } from './professions.js';
import { InventoryManager } from './inventory.js';
import { AuctionHouse } from './auctionHouse.js';
import { QuestManager } from './quests.js';
import { UIManager } from './ui.js';
import { SaveManager } from './saveManager.js';

class WoWIdleGame {
    constructor() {
        this.gameState = new GameState();
        this.professionManager = new ProfessionManager(this.gameState);
        this.inventoryManager = new InventoryManager(this.gameState);
        this.auctionHouse = new AuctionHouse(this.gameState);
        this.questManager = new QuestManager(this.gameState);
        this.uiManager = new UIManager(this.gameState);
        this.saveManager = new SaveManager(this.gameState);
        
        // Lier les managers à l'UI
        this.uiManager.setManagers(
            this.professionManager,
            this.inventoryManager,
            this.auctionHouse,
            this.questManager
        );
        
        this.lastUpdate = Date.now();
        this.init();
    }

    init() {
        // Charger la sauvegarde
        this.saveManager.loadGame();
        
        // Initialiser l'interface
        this.uiManager.init();
        this.setupEventListeners();
        this.setupGlobalMethods();
        
        // Démarrer la boucle de jeu
        this.gameLoop();
        
        // Sauvegarde automatique toutes les 30 secondes
        setInterval(() => {
            this.saveManager.saveGame();
        }, 30000);
    }

    setupGlobalMethods() {
        // Exposer certaines méthodes globalement pour les boutons HTML
        window.craftItem = (recipeName) => {
            const amount = parseInt(document.getElementById(`amount-${recipeName}`)?.value || 1);
            if (this.professionManager.craftItem(recipeName, amount)) {
                this.uiManager.updateInventoryUI();
                this.uiManager.updateProfessionsUI();
                this.uiManager.showNotification(`${amount} ${recipeName} créé(s) !`);
            } else {
                this.uiManager.showNotification('Impossible de créer cet objet !', 'error');
            }
        };

        window.sellToVendor = (itemName, amount, category) => {
            const result = this.inventoryManager.sellToVendor(itemName, amount, category);
            if (result) {
                this.uiManager.updateInventoryUI();
                this.uiManager.showNotification(`Vendu pour ${result} or !`);
            } else {
                this.uiManager.showNotification('Impossible de vendre !', 'error');
            }
        };

        window.acceptQuest = (questId) => {
            const result = this.questManager.acceptQuest(questId);
            if (result.success) {
                this.uiManager.updateQuestsUI();
                this.uiManager.showNotification(`Quête "${result.quest.title}" acceptée !`);
            } else {
                this.uiManager.showNotification(result.reason, 'error');
            }
        };

        window.completeQuest = (questId) => {
            const result = this.questManager.completeQuest(questId);
            if (result.success) {
                this.uiManager.updateQuestsUI();
                this.uiManager.updateInventoryUI();
                let rewardText = '';
                result.rewards.forEach(reward => {
                    if (reward.type === 'gold') rewardText += `${reward.amount} or `;
                });
                this.uiManager.showNotification(`Quête terminée ! Récompenses: ${rewardText}`);
            } else {
                this.uiManager.showNotification(result.reason, 'error');
            }
        };

        window.abandonQuest = (questId) => {
            if (this.questManager.abandonQuest(questId)) {
                this.uiManager.updateQuestsUI();
                this.uiManager.showNotification('Quête abandonnée');
            }
        };

        window.quickSellItem = (itemName, amount, category) => {
            const result = this.auctionHouse.quickSell(itemName, amount);
            if (result.success) {
                this.uiManager.updateInventoryUI();
                this.uiManager.updateAuctionHouseUI();
                this.uiManager.showNotification(`Vendu rapidement pour ${Math.floor(result.totalPrice)} or !`);
            } else {
                this.uiManager.showNotification(result.reason, 'error');
            }
        };

        window.sellItemToAuction = (itemName, category) => {
            const priceInput = document.getElementById(`price-${itemName}`);
            const amountInput = document.getElementById(`amount-${itemName}`);
            
            const price = parseInt(priceInput?.value) || this.auctionHouse.getRecommendedPrice(itemName);
            const amount = parseInt(amountInput?.value) || 1;
            
            const result = this.auctionHouse.sellItem(itemName, amount, price);
            if (result.success) {
                this.uiManager.updateInventoryUI();
                this.uiManager.updateAuctionHouseUI();
                this.uiManager.showNotification(`Vendu pour ${Math.floor(result.totalPrice)} or ! (Commission: ${Math.floor(result.commission)} or)`);
            } else {
                this.uiManager.showNotification(result.reason, 'error');
            }
        };

        // Méthode globale pour forcer la mise à jour de l'interface
        window.refreshUI = () => {
            this.uiManager.updateProfessionsUI();
            this.uiManager.updateInventoryUI();
        };
    }

    setupEventListeners() {
        // Gestion des onglets
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.switchTab(tabName);
            });
        });

        // Sauvegarde avant fermeture
        window.addEventListener('beforeunload', () => {
            this.saveManager.saveGame();
        });

        // Gestion de la visibilité de la page pour les gains offline
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                this.handleOfflineProgress();
            }
        });
    }

    switchTab(tabName) {
        // Désactiver tous les onglets
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        // Activer l'onglet sélectionné
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(tabName).classList.add('active');

        // Mettre à jour l'interface selon l'onglet
        switch(tabName) {
            case 'professions':
                this.uiManager.updateProfessionsUI();
                break;
            case 'inventory':
                this.uiManager.updateInventoryUI();
                break;
            case 'auction-house':
                this.uiManager.updateAuctionHouseUI();
                break;
            case 'quests':
                this.uiManager.updateQuestsUI();
                break;
        }
    }

    gameLoop() {
        const now = Date.now();
        const deltaTime = (now - this.lastUpdate) / 1000;
        this.lastUpdate = now;

        // Mettre à jour les systèmes
        this.professionManager.update(deltaTime);
        this.questManager.update(deltaTime);
        this.auctionHouse.update(deltaTime);

        // Mettre à jour l'interface
        this.uiManager.update();

        // Continuer la boucle
        requestAnimationFrame(() => this.gameLoop());
    }

    handleOfflineProgress() {
        const offlineTime = this.saveManager.getOfflineTime();
        if (offlineTime > 60) { // Plus d'une minute offline
            this.professionManager.processOfflineGains(offlineTime);
            this.showOfflineReport(offlineTime);
        }
    }

    showOfflineReport(offlineTime) {
        const hours = Math.floor(offlineTime / 3600);
        const minutes = Math.floor((offlineTime % 3600) / 60);
        
        // Créer une popup de rapport offline
        const report = document.createElement('div');
        report.className = 'offline-report';
        report.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
        `;
        
        report.innerHTML = `
            <div class="offline-report-content" style="
                background: linear-gradient(135deg, #1a1a2e, #16213e);
                border: 2px solid #ffd700;
                border-radius: 10px;
                padding: 2rem;
                max-width: 500px;
                color: white;
                text-align: center;
            ">
                <h3 style="color: #ffd700; margin-bottom: 1rem;">Rapport Offline</h3>
                <p>Vous étiez absent pendant ${hours}h ${minutes}m</p>
                <div class="offline-gains" style="margin: 1rem 0;">
                    ${this.formatOfflineGains()}
                </div>
                <button class="btn" onclick="this.parentElement.parentElement.remove()" style="
                    background: #4CAF50;
                    border: none;
                    color: white;
                    padding: 0.8rem 1.5rem;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 1rem;
                ">Continuer</button>
            </div>
        `;
        
        document.body.appendChild(report);
    }

    formatOfflineGains() {
        const gains = this.professionManager.offlineGains;
        if (!gains || gains.length === 0) {
            return '<p>Aucun gain offline</p>';
        }

        return gains.map(gain => `
            <div style="margin: 0.5rem 0; padding: 0.5rem; background: rgba(255,255,255,0.1); border-radius: 5px;">
                <strong>${this.uiManager.getProfessionDisplayName(gain.profession)}</strong><br>
                +${gain.resources} ${gain.resourceType}<br>
                +${gain.xp} XP
            </div>
        `).join('');
    }
}

// Démarrer le jeu quand la page est chargée
document.addEventListener('DOMContentLoaded', () => {
    window.game = new WoWIdleGame();
});
        this.uiManager.update();
        {

        // Continuer la boucle
        requestAnimationFrame(() => this.gameLoop());
    }

    handleOfflineProgress() 
    {
        const offlineTime = this.saveManager.getOfflineTime();
        if (offlineTime > 60) { // Plus d'une minute offline
            this.professionManager.processOfflineGains(offlineTime);
            this.showOfflineReport(offlineTime);
        }
    }

    showOfflineReport(offlineTime) 
    {
        const hours = Math.floor(offlineTime / 3600);
        const minutes = Math.floor((offlineTime % 3600) / 60);
        
        // Créer une popup de rapport offline
        const report = document.createElement('div'); 
        {
        report.className = 'offline-report';
        report.innerHTML = `
            <div class="offline-report-content">
                <h3>Rapport Offline</h3>
                <p>Vous étiez absent pendant ${hours}h ${minutes}m</p>
                <div class="offline-gains">
                    <!-- Les gains seront ajoutés par le ProfessionManager -->
                </div>
                <button class="btn" onclick="this.parentElement.parentElement.remove()">Continuer</button>
            </div>
        `;
        
        document.body.appendChild(report);
    }
}

// Démarrer le jeu quand la page est chargée
document.addEventListener('DOMContentLoaded', () => {
    window.game = new WoWIdleGame();
});