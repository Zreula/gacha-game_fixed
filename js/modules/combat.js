// Module CombatSystem - Gestion des missions et du combat
const CombatSystem = {
    // Missions actives
    activeMissions: {},
    idleMissions: {},
    
    // Initialisation du module
    init() {
        console.log('⚔️ Initialisation du système de combat...');
        this.validateZones();
        this.generateCombatZones();
    },
    
    // Validation de la configuration des zones
    validateZones() {
        Object.entries(GAME_CONFIG.COMBAT.ZONES).forEach(([key, zone]) => {
            if (zone.minPower >= zone.maxPower) {
                console.warn(`⚠️ Zone ${key}: minPower >= maxPower`);
            }
            if (zone.crystalChance < 0 || zone.crystalChance > 1) {
                console.warn(`⚠️ Zone ${key}: crystalChance invalide`);
            }
        });
        
        console.log('✅ Configuration des zones validée');
    },
    
    // Générer les zones de combat dans l'interface
    generateCombatZones() {
        UI.generateCombatZones();
    },
    
    // Démarrer une mission (toggle idle)
    startMission(zoneKey) {
        console.log(`🎯 Mission demandée: ${zoneKey}`);
        
        // Vérifications préliminaires
        if (!this.canStartMission(zoneKey)) {
            return;
        }
        
        const statusText = document.getElementById(`${zoneKey}Status`);
        
        // Toggle du mode idle
        if (gameState.idleMissions[zoneKey]) {
            // Arrêter la mission idle
            this.stopIdleMission(zoneKey);
        } else {
            // Démarrer la mission idle
            this.startIdleMission(zoneKey);
        }
    },
    
    // Vérifications avant de démarrer une mission
    canStartMission(zoneKey) {
        // Vérifier qu'on a des personnages équipés
        if (gameState.equippedCharacters.size === 0) {
            UI.showNotification('⚠️ Tu dois équiper au moins un personnage pour partir en mission !', 'error');
            return false;
        }
        
        const zone = GAME_CONFIG.COMBAT.ZONES[zoneKey];
        const teamPower = this.calculateTeamPower();
        
        // Vérifier si la zone est trop difficile
        if (teamPower < zone.minPower - 50) {
            UI.showNotification(
                `⚠️ Ton équipe est trop faible pour ${zone.name} !\n` +
                `Puissance recommandée: ${zone.minPower}+\n` +
                `Ta puissance: ${teamPower}`, 
                'error'
            );
            return false;
        }
        
        return true;
    },
    
    // Calculer la puissance totale de l'équipe
    calculateTeamPower() {
        const equippedArray = Array.from(gameState.equippedCharacters).map(name => 
            findCharacterByName(name)
        ).filter(char => char !== undefined);
        
        return equippedArray.reduce((sum, char) => 
            sum + char.stats.attack + char.stats.defense + char.stats.speed + char.stats.magic, 0
        );
    },
    
    // Démarrer une mission en mode idle
    startIdleMission(zoneKey) {
        const teamPower = this.calculateTeamPower();
        const equippedArray = Array.from(gameState.equippedCharacters).map(name => 
            findCharacterByName(name)
        ).filter(char => char !== undefined);
        
        gameState.idleMissions[zoneKey] = {
            totalPower: teamPower,
            equippedArray: equippedArray,
            isRunning: true
        };
        
        const statusText = document.getElementById(`${zoneKey}Status`);
        statusText.textContent = 'En cours (cliquer pour arrêter)';
        statusText.classList.add('active');
        statusText.classList.remove('stopped');
        
        // Démarrer la première mission
        this.runSingleMission(zoneKey);
        
        console.log(`🚀 Mission idle démarrée: ${zoneKey}`);
    },
    
    // Arrêter une mission idle
    stopIdleMission(zoneKey) {
        const statusText = document.getElementById(`${zoneKey}Status`);
        const zoneCard = document.querySelector(`[data-zone="${zoneKey}"]`);
        const progressDiv = document.getElementById(`${zoneKey}Progress`);
        
        // Arrêter le mode idle
        delete gameState.idleMissions[zoneKey];
        delete gameState.activeMissions[zoneKey];
        
        // Remettre l'interface à l'état initial
        statusText.textContent = 'Cliquer pour démarrer';
        statusText.classList.remove('active');
        statusText.classList.add('stopped');
        
        if (zoneCard) zoneCard.classList.remove('in-progress');
        if (progressDiv) progressDiv.classList.remove('active');
        
        console.log(`⏹️ Mission idle arrêtée: ${zoneKey}`);
    },
    
    // Exécuter une mission individuelle
    runSingleMission(zoneKey) {
        if (!gameState.idleMissions[zoneKey] || !gameState.idleMissions[zoneKey].isRunning) {
            return; // Mission arrêtée
        }
        
        const zoneCard = document.querySelector(`[data-zone="${zoneKey}"]`);
        const progressDiv = document.getElementById(`${zoneKey}Progress`);
        const progressFill = document.getElementById(`${zoneKey}ProgressFill`);
        const progressText = document.getElementById(`${zoneKey}ProgressText`);
        const timerText = document.getElementById(`${zoneKey}Timer`);
        
        // Interface en cours de mission
        if (zoneCard) zoneCard.classList.add('in-progress');
        if (progressDiv) progressDiv.classList.add('active');
        
        // Données de la mission
        const duration = this.getMissionDuration(zoneKey);
        const startTime = Date.now();
        
        gameState.activeMissions[zoneKey] = {
            startTime,
            duration,
            ...gameState.idleMissions[zoneKey]
        };
        
        // Animation de la barre de progression
        const updateProgress = () => {
            if (!gameState.idleMissions[zoneKey] || !gameState.idleMissions[zoneKey].isRunning) {
                return; // Mission arrêtée
            }
            
            const elapsed = Date.now() - startTime;
            const progress = Math.min((elapsed / duration) * 100, 100);
            const timeLeft = Math.max(0, Math.ceil((duration - elapsed) / 1000));
            
            if (progressFill) progressFill.style.width = `${progress}%`;
            if (progressText) progressText.textContent = `${Math.round(progress)}%`;
            if (timerText) timerText.textContent = `${timeLeft}s restantes`;
            
            if (progress >= 100) {
                // Mission terminée - recommencer automatiquement
                this.completeMission(zoneKey, true);
            } else {
                // Continuer l'animation
                requestAnimationFrame(updateProgress);
            }
        };
        
        updateProgress();
    },
    
    // Obtenir la durée d'une mission
    getMissionDuration(zoneKey) {
        const baseDuration = GAME_CONFIG.COMBAT.MISSION_DURATIONS[zoneKey] || 10;
        
        if (GAME_CONFIG.DEBUG.FAST_MISSIONS) {
            return baseDuration * 100; // 100ms pour debug
        }
        
        return baseDuration * 1000; // Convertir en millisecondes
    },
    
    // Compléter une mission
    completeMission(zoneKey, isIdle = false) {
        const mission = gameState.activeMissions[zoneKey];
        if (!mission) return;
        
        // Calculer le résultat du combat
        const result = this.simulateCombat(zoneKey, mission.totalPower);
        
        // Donner les récompenses
        if (result.victory) {
            gameState.playerGold += result.goldEarned;
            gameState.crystals += result.crystalAmount;
            
            // Mettre à jour l'interface
            UI.updatePlayerResources();
            UI.updateStats();
            
            // Sauvegarder automatiquement
            SaveSystem.autoSave();
        }
            // Tentative de drop d'équipement
        const droppedItem = EquipmentSystem.generateRandomDrop(zoneKey);
        if (droppedItem) {
            ShopSystem.addItemToInventory(droppedItem);
            // Notification de drop
        }
        // Supprimer la mission active
        delete gameState.activeMissions[zoneKey];
        
        if (isIdle && gameState.idleMissions[zoneKey] && gameState.idleMissions[zoneKey].isRunning) {
            // Recommencer automatiquement après un court délai
            setTimeout(() => {
                this.runSingleMission(zoneKey);
            }, GAME_CONFIG.UI.MISSION_RESTART_DELAY);
        } else {
            // Mission unique terminée - remettre l'interface normale
            const zoneCard = document.querySelector(`[data-zone="${zoneKey}"]`);
            const progressDiv = document.getElementById(`${zoneKey}Progress`);
            const statusText = document.getElementById(`${zoneKey}Status`);
            
            if (zoneCard) zoneCard.classList.remove('in-progress');
            if (progressDiv) progressDiv.classList.remove('active');
            if (statusText) {
                statusText.textContent = 'Cliquer pour démarrer';
                statusText.classList.remove('active');
            }
        }
        
        if (GAME_CONFIG.DEBUG.ENABLED && result.victory) {
            console.log(`💰 Mission ${zoneKey}: +${result.goldEarned} or, +${result.crystalAmount} cristaux`);
        }
    },
    
    // Simuler un combat
    simulateCombat(zoneKey, teamPower) {
        const zone = GAME_CONFIG.COMBAT.ZONES[zoneKey];
        const enemy = zone.enemies[Math.floor(Math.random() * zone.enemies.length)];
        const enemyPower = Math.floor(Math.random() * (zone.maxPower - zone.minPower + 1)) + zone.minPower;
        
        // Calcul du taux de victoire basé sur la puissance
        const powerRatio = teamPower / enemyPower;
        const baseWinChance = Math.min(0.9, Math.max(0.1, powerRatio * 0.6));
        const victory = Math.random() < baseWinChance;
        
        let goldEarned = 0;
        let crystalAmount = 0;
        
        if (victory) {
            // Calcul de l'or
            goldEarned = Math.floor(Math.random() * (zone.baseGold[1] - zone.baseGold[0] + 1)) + zone.baseGold[0];
            
            // Bonus d'or si très puissant
            if (powerRatio > 1.2) {
                const bonus = Math.floor(goldEarned * 0.5);
                goldEarned += bonus;
            }
            
            // Calcul des cristaux
            const crystalDropped = Math.random() < zone.crystalChance;
            if (crystalDropped) {
                crystalAmount = Math.floor(Math.random() * (zone.crystalDrop[1] - zone.crystalDrop[0] + 1)) + zone.crystalDrop[0];
            }
        }
        
        return {
            victory,
            enemy,
            enemyPower,
            powerRatio,
            goldEarned,
            crystalAmount,
            zone: zone.name
        };
    },
    
    // Mettre à jour les informations de combat
    updateCombatInfo() {
        this.updateTeamInfo();
        this.updateZoneRecommendations();
    },
    
    // Mettre à jour les informations de l'équipe
    updateTeamInfo() {
        UI.updateTeamPreview();
        UI.updateTeamStats();
    },
    
    // Mettre à jour les recommandations de zone
    updateZoneRecommendations() {
        const teamPower = this.calculateTeamPower();
        UI.updateZoneRecommendations(teamPower);
    },
    
    // Arrêter toutes les missions
    stopAllMissions() {
        console.log('⏹️ Arrêt de toutes les missions...');
        
        Object.keys(gameState.idleMissions).forEach(zoneKey => {
            this.stopIdleMission(zoneKey);
        });
        
        gameState.activeMissions = {};
        gameState.idleMissions = {};
    },
    
    // Obtenir les statistiques de combat
    getCombatStats() {
        const activeMissionCount = Object.keys(gameState.activeMissions).length;
        const idleMissionCount = Object.keys(gameState.idleMissions).length;
        
        return {
            activeMissions: activeMissionCount,
            idleMissions: idleMissionCount,
            teamPower: this.calculateTeamPower(),
            equippedCharacters: gameState.equippedCharacters.size,
            maxEquipped: GAME_CONFIG.COMBAT.MAX_EQUIPPED
        };
    },
    
    // Calculer l'efficacité d'une zone pour l'équipe actuelle
    calculateZoneEfficiency(zoneKey) {
        const zone = GAME_CONFIG.COMBAT.ZONES[zoneKey];
        const teamPower = this.calculateTeamPower();
        
        if (teamPower === 0) return 0;
        
        const powerRatio = teamPower / ((zone.minPower + zone.maxPower) / 2);
        const winChance = Math.min(0.9, Math.max(0.1, powerRatio * 0.6));
        
        // Calcul de l'efficacité (récompenses / temps * taux de victoire)
        const avgGold = (zone.baseGold[0] + zone.baseGold[1]) / 2;
        const avgCrystals = (zone.crystalDrop[0] + zone.crystalDrop[1]) / 2 * zone.crystalChance;
        const missionTime = GAME_CONFIG.COMBAT.MISSION_DURATIONS[zoneKey];
        
        const efficiency = ((avgGold * 0.1 + avgCrystals) / missionTime) * winChance;
        
        return Math.round(efficiency * 100) / 100;
    },
    
    // Obtenir la meilleure zone pour l'équipe actuelle
    getBestZoneForTeam() {
        let bestZone = null;
        let bestEfficiency = 0;
        
        Object.keys(GAME_CONFIG.COMBAT.ZONES).forEach(zoneKey => {
            const efficiency = this.calculateZoneEfficiency(zoneKey);
            if (efficiency > bestEfficiency) {
                bestEfficiency = efficiency;
                bestZone = zoneKey;
            }
        });
        
        return {
            zone: bestZone,
            efficiency: bestEfficiency,
            name: bestZone ? GAME_CONFIG.COMBAT.ZONES[bestZone].name : null
        };
    },
    
    // Mode debug: simuler de nombreux combats
    debugSimulateCombats(zoneKey, count = 100) {
        if (!GAME_CONFIG.DEBUG.ENABLED) return;
        
        const teamPower = this.calculateTeamPower();
        let victories = 0;
        let totalGold = 0;
        let totalCrystals = 0;
        
        for (let i = 0; i < count; i++) {
            const result = this.simulateCombat(zoneKey, teamPower);
            if (result.victory) {
                victories++;
                totalGold += result.goldEarned;
                totalCrystals += result.crystalAmount;
            }
        }
        
        const winRate = (victories / count * 100).toFixed(1);
        const avgGold = (totalGold / victories || 0).toFixed(1);
        const avgCrystals = (totalCrystals / victories || 0).toFixed(1);
        
        console.group(`🧪 Simulation ${count} combats - ${zoneKey}`);
        console.log(`Taux de victoire: ${winRate}%`);
        console.log(`Or moyen par victoire: ${avgGold}`);
        console.log(`Cristaux moyens par victoire: ${avgCrystals}`);
        console.log(`Efficacité calculée: ${this.calculateZoneEfficiency(zoneKey)}`);
        console.groupEnd();
    },
    
    // Mode debug: afficher les recommandations
    debugShowRecommendations() {
        if (!GAME_CONFIG.DEBUG.ENABLED) return;
        
        const teamPower = this.calculateTeamPower();
        const best = this.getBestZoneForTeam();
        
        console.group('🎯 Recommandations de combat');
        console.log(`Puissance de l'équipe: ${teamPower}`);
        console.log(`Meilleure zone: ${best.name} (efficacité: ${best.efficiency})`);
        
        Object.keys(GAME_CONFIG.COMBAT.ZONES).forEach(zoneKey => {
            const efficiency = this.calculateZoneEfficiency(zoneKey);
            const zone = GAME_CONFIG.COMBAT.ZONES[zoneKey];
            console.log(`${zone.name}: ${efficiency} (${zone.minPower}-${zone.maxPower})`);
        });
        
        console.groupEnd();
    }
};

console.log('⚔️ Module CombatSystem chargé');