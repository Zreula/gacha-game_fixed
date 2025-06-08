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
        
        this.lastUpdate = Date.now();
        this.init();
    }

    init() {
        // Charger la sauvegarde
        this.saveManager.loadGame();
        
        // Initialiser l'interface
        this.uiManager.init();
        this.setupEventListeners();
        
        // Démarrer la boucle de jeu
        this.gameLoop();
        
        // Sauvegarde automatique toutes les 30 secondes
        setInterval(() => {
            this.saveManager.saveGame();
        }, 30000);
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