// ===== GAME DATA =====

// Hero Pool - Will be unlocked by player level
const heroes = [
    // Starter Hero (Level 1)
    { 
        id: 0,
        name: "Aiden Stormwind", 
        role: "Adventurer", 
        attack: 120, 
        speed: 85, 
        crit: 18, 
        hp: 700, 
        def: 35, 
        unlockLevel: 1,
        currentLevel: 1,
        currentXP: 0,
        xpToNext: 100
    },
    
    // Level 10 Heroes
    { 
        id: 1,
        name: "Gareth Ironforge", 
        role: "Warrior", 
        attack: 150, 
        speed: 70, 
        crit: 15, 
        hp: 850, 
        def: 50, 
        unlockLevel: 10,
        currentLevel: 1,
        currentXP: 0,
        xpToNext: 100
    },
    { 
        id: 2,
        name: "Lyra Moonwhisper", 
        role: "Priest", 
        attack: 90, 
        speed: 95, 
        crit: 12, 
        hp: 600, 
        def: 30, 
        unlockLevel: 10,
        currentLevel: 1,
        currentXP: 0,
        xpToNext: 100
    },
    
    // Level 20 Hero
    { 
        id: 3,
        name: "Kael Flamestrike", 
        role: "Mage", 
        attack: 180, 
        speed: 60, 
        crit: 10, 
        hp: 500, 
        def: 20, 
        unlockLevel: 20,
        currentLevel: 1,
        currentXP: 0,
        xpToNext: 100
    }
];

// World Maps Data
const worldMaps = [
    {
        id: 0,
        name: "Elwynn Forest",
        unlocked: true,
        knowledge: 0,
        maxKnowledge: 100,
        missions: [
            {
                id: 0,
                name: "Kobold Menace",
                description: "Clear out kobold camps threatening local farmers",
                difficulty: "Easy",
                knowledgeRequired: 0,
                knowledgeReward: 3,
                goldReward: 5,
                xpReward: 10,
                unlocked: true,
                completed: false
            },
            {
                id: 1,
                name: "Wolf Pack Hunt",
                description: "Thin out the aggressive wolf population",
                difficulty: "Easy", 
                knowledgeRequired: 0,
                knowledgeReward: 5,
                goldReward: 15,
                xpReward: 15,
                unlocked: true,
                completed: false
            },
            {
                id: 2,
                name: "Bandit Hideout",
                description: "Raid the notorious Defias bandit camp south of Goldshire",
                difficulty: "Medium",
                knowledgeRequired: 25,
                knowledgeReward: 6,
                goldReward: 30,
                xpReward: 25,
                unlocked: false,
                completed: false
            },
            {
                id: 3,
                name: "Murloc Investigation",
                description: "Investigate strange murloc activity near Crystal Lake",
                difficulty: "Medium",
                knowledgeRequired: 35,
                knowledgeReward: 8,
                goldReward: 40,
                xpReward: 28,
                unlocked: false,
                completed: false
            },
            {
                id: 4,
                name: "Rare Herb Collection",
                description: "Gather valuable Peacebloom and Silverleaf while defending against forest creatures",
                difficulty: "Easy",
                knowledgeRequired: 43,
                knowledgeReward: 3,
                goldReward: 5,
                xpReward: 3,
                unlocked: false,
                completed: false
            },
            {
                id: 5,
                name: "Elite: Hogger Hunt",
                description: "Face the infamous gnoll leader terrorizing trade routes",
                difficulty: "Hard",
                knowledgeRequired: 60,
                knowledgeReward: 10,
                goldReward: 200,
                xpReward: 100,
                unlocked: false,
                completed: false
            },
            {
                id: 6,
                name: "Ancient Ruins Exploration",
                description: "Explore mysterious ruins discovered deep in the forest",
                difficulty: "Hard",
                knowledgeRequired: 90,
                knowledgeReward: 5,
                goldReward: 50,
                xpReward: 30,
                unlocked: false,
                completed: false
            }
        ]
    },
    {
        id: 1,
        name: "Westfall",
        unlocked: false,
        knowledge: 0,
        maxKnowledge: 160,
        missions: []
    }
];

// ===== GAME STATE =====
let gameState = {
    // Player progression
    playerLevel: 1,
    playerXP: 0,
    playerXPToNext: 100,
    
    // Resources
    gold: 0,
    
    // Heroes
    unlockedHeroes: [0], // Only starter hero unlocked
    selectedTeam: [], // Current party (max 6)
    
    // World progression
    currentMap: 0,
    unlockedMaps: [0],
    
    // UI state
    currentTab: 'heroes'

    // Mission tracking
   // missionInProgress: null, // Will store: { mission, startTime, duration, timer}
};

// ===== CORE GAME FUNCTIONS =====

// Initialize the game
function initGame() {
    console.log("🎮 Initializing Infernal WoW...");
    
    setupNavigation();
    updatePlayerUI();
    updateHeroesTab();
    updateWorldMapTab();
    
    console.log("✅ Game initialized successfully!");
}

// Setup tab navigation
function setupNavigation() {
    const navTabs = document.querySelectorAll('.nav-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            if (tab.classList.contains('disabled')) return;
            
            const targetTab = tab.dataset.tab;
            
            // Update nav tabs
            navTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update tab content
            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(`${targetTab}-tab`).classList.add('active');
            
            // Update game state
            gameState.currentTab = targetTab;
            
            // Refresh tab content
            switch(targetTab) {
                case 'heroes':
                    updateHeroesTab();
                    break;
                case 'worldmap':
                    updateWorldMapTab();
                    break;
                case 'inventory':
                    updateInventoryTab();
                    break;
            }
        });
    });
}

// ===== PLAYER PROGRESSION =====

function addPlayerXP(amount) {
    gameState.playerXP += amount;
    
    // Check for level up
    while (gameState.playerXP >= gameState.playerXPToNext) {
        levelUpPlayer();
    }
    
    updatePlayerUI();
    checkHeroUnlocks();
}

function levelUpPlayer() {
    gameState.playerXP -= gameState.playerXPToNext;
    gameState.playerLevel++;
    gameState.playerXPToNext = Math.floor(gameState.playerXPToNext * 1.15); // 15% increase per level
    
    console.log(`🎉 Player leveled up to ${gameState.playerLevel}!`);
    
    // Show level up notification (todo: nice UI popup)
    alert(`🎉 Level Up! You are now level ${gameState.playerLevel}!`);
}

function checkHeroUnlocks() {
    let newHeroUnlocked = false;
    
    heroes.forEach((hero, index) => {
        if (hero.unlockLevel <= gameState.playerLevel && !gameState.unlockedHeroes.includes(index)) {
            gameState.unlockedHeroes.push(index);
            newHeroUnlocked = true;
            console.log(`🦸‍♂️ New hero unlocked: ${hero.name}!`);
        }
    });
    
    if (newHeroUnlocked) {
        updateHeroesTab();
        // Show unlock notification (todo: nice UI popup)
        alert("🦸‍♂️ New hero unlocked! Check your Heroes tab!");
    }
}

// ===== UI UPDATE FUNCTIONS =====

function updatePlayerUI() {
    document.getElementById('playerLevel').textContent = gameState.playerLevel;
    document.getElementById('currentXP').textContent = gameState.playerXP;
    document.getElementById('maxXP').textContent = gameState.playerXPToNext;
    document.getElementById('goldAmount').textContent = gameState.gold;
    
    const xpPercentage = (gameState.playerXP / gameState.playerXPToNext) * 100;
    document.getElementById('xpFill').style.width = `${xpPercentage}%`;
}

function updateHeroesTab() {
    const heroesTab = document.getElementById('heroes-tab');
    
    heroesTab.innerHTML = `
        <div class="content-header">
            <h1>Heroes Management</h1>
        </div>
        <div class="content-section">
            <div class="section-title">Available Heroes (${gameState.unlockedHeroes.length}/${heroes.length})</div>
            <div class="hero-grid" id="heroGrid">
                ${generateHeroCards()}
            </div>
            
            <div class="section-title">Current Party (${gameState.selectedTeam.length}/6)</div>
            <div class="card">
                <div id="partyDisplay">${generatePartyDisplay()}</div>
            </div>
        </div>
    `;
}

function generateHeroCards() {
    return heroes.map((hero, index) => {
        const isUnlocked = gameState.unlockedHeroes.includes(index);
        const isInParty = gameState.selectedTeam.includes(index);
        
        if (!isUnlocked) {
            return `
                <div class="hero-card locked">
                    <div class="hero-name">🔒 Locked</div>
                    <div class="hero-class">Requires Level ${hero.unlockLevel}</div>
                </div>
            `;
        }
        
        return `
            <div class="hero-card ${isInParty ? 'selected' : ''}" onclick="toggleHeroInParty(${index})">
                <div class="hero-name">${getRoleIcon(hero.role)} ${hero.name}</div>
                <div class="hero-class">${hero.role} - Level ${hero.currentLevel}</div>
                <div class="hero-stats">
                    <div class="stat-row">
                        <span class="stat-label">ATK:</span>
                        <span>${hero.attack}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">HP:</span>
                        <span>${hero.hp}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">SPD:</span>
                        <span>${hero.speed}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">CRIT:</span>
                        <span>${hero.crit}%</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function generatePartyDisplay() {
    if (gameState.selectedTeam.length === 0) {
        return '<p style="text-align: center; color: #a0a0a0; padding: 20px;">No heroes in party. Click on heroes above to add them!</p>';
    }
    
    return `
        <div class="grid-3">
            ${gameState.selectedTeam.map(heroIndex => {
                const hero = heroes[heroIndex];
                return `
                    <div class="card">
                        <div class="hero-name">${getRoleIcon(hero.role)} ${hero.name}</div>
                        <div class="hero-class">${hero.role}</div>
                        <button class="btn btn-danger" onclick="removeFromParty(${heroIndex})">Remove</button>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function updateWorldMapTab() {
    const worldmapTab = document.getElementById('worldmap-tab');
    const currentMapData = worldMaps[gameState.currentMap];
    
    worldmapTab.innerHTML = `
        <div class="content-header">
            <h1>World Map - ${currentMapData.name}</h1>
        </div>
        <div class="content-section">
            <div class="card">
                <div class="card-header">
                    <div class="card-title">Map Knowledge</div>
                </div>
                <div class="progress-text">Knowledge: ${currentMapData.knowledge}/${currentMapData.maxKnowledge}%</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${currentMapData.knowledge}%"></div>
                </div>
            </div>
            
            <div class="section-title">Available Missions</div>
            <div class="grid-2">
                ${generateMissionCards()}
            </div>
        </div>
    `;
}

function generateMissionCards() {
    const currentMapData = worldMaps[gameState.currentMap];
    
    // Filter to show only missions that meet knowledge requirements (SECRET SYSTEM!)
    const visibleMissions = currentMapData.missions.filter(mission => 
        currentMapData.knowledge >= mission.knowledgeRequired
    );
    
    return visibleMissions.map(mission => {
        const canStart = mission.unlocked && gameState.selectedTeam.length > 0;
        
        return `
            <div class="card">
                <div class="card-header">
                    <div class="card-title">⚔️ ${mission.name}</div>
                </div>
                <p>${mission.description}</p>
                <p><strong>Difficulty:</strong> ${mission.difficulty}</p>
                <p><strong>Rewards:</strong> ${mission.goldReward}💰 ${mission.xpReward}⭐ ${mission.knowledgeReward}📖</p>
                ${canStart ? `<button class="btn" onclick="startMission(${mission.id})">Start Mission</button>` : ''}
                ${gameState.selectedTeam.length === 0 ? '<p style="color: #dc2626;">⚠️ No party selected</p>' : ''}
            </div>
        `;
    }).join('');
}

// ===== HERO MANAGEMENT =====

function toggleHeroInParty(heroIndex) {
    if (gameState.selectedTeam.includes(heroIndex)) {
        removeFromParty(heroIndex);
    } else if (gameState.selectedTeam.length < 6) {
        gameState.selectedTeam.push(heroIndex);
        updateHeroesTab();
        updateWorldMapTab(); // Refresh to update mission buttons
    } else {
        alert("Party is full! (Max 6 heroes)");
    }
}

function removeFromParty(heroIndex) {
    gameState.selectedTeam = gameState.selectedTeam.filter(id => id !== heroIndex);
    updateHeroesTab();
    updateWorldMapTab(); // Refresh to update mission buttons
}

function getRoleIcon(role) {
    const icons = {
        "Adventurer": "🗡️",
        "Warrior": "⚔️",
        "Priest": "✨",
        "Mage": "🔮",
        "Hunter": "🏹",
        "Warlock": "🔥",
        "Paladin": "🛡️"
    };
    return icons[role] || "❓";
}

// ===== MISSION SYSTEM =====

function startMission(missionId) {
    const currentMapData = worldMaps[gameState.currentMap];
    const mission = currentMapData.missions.find(m => m.id === missionId);
    
    if (!mission || gameState.selectedTeam.length === 0) return;
    
    console.log(`🚀 Starting mission: ${mission.name}`);
    
    // Mission duration based on difficulty
    const missionDurations = {
        "Easy": 5,    // 5 seconds
        "Medium": 15,  // 15 seconds  
        "Hard": 30     // 30 seconds
    };
    
    const duration = missionDurations[mission.difficulty] || 20;

    // NOUVEAU: Sauvegarder dans gameState
    gameState.missionInProgress = {
        mission,
        startTime: Date.now(),
        duration,
        timer: null
    };
    
    // Show mission in progress
    showMissionProgress(mission, duration);

    // Show floating tracker
    showFloatingMissionTracker(mission, duration);
    
    gameState.missionInProgress.timer = setInterval(updateMissionTracker, 1000);

    // Start mission timer
    setTimeout(() => {
        completeMission(mission);
    }, duration * 1000);
}
function hideFloatingMissionTracker() {
    const tracker = document.getElementById('floatingMissionTracker');
    if (tracker) {
        tracker.classList.add('tracker-sliding-out');
        setTimeout(() => {
            tracker.remove();
        }, 300); // Wait for animation
    }
}

function updateMissionTracker() {
    const tracker = document.getElementById('floatingMissionTracker');
    if (!tracker || !gameState.missionInProgress) return;
    
    const { startTime, duration } = gameState.missionInProgress;
    const elapsed = (Date.now() - startTime) / 1000; // secondes écoulées
    const timeLeft = Math.max(0, duration - elapsed);
    const percentage = Math.min(100, (elapsed / duration) * 100);
    
    // Mettre à jour les éléments
    const timeLeftElement = document.getElementById('trackerTimeLeft');
    const percentageElement = document.getElementById('trackerPercentage');
    const progressFill = document.getElementById('trackerProgressFill');
    
    if (timeLeftElement) timeLeftElement.textContent = `${Math.ceil(timeLeft)}s`;
    if (percentageElement) percentageElement.textContent = `${Math.round(percentage)}%`;
    if (progressFill) progressFill.style.width = `${percentage}%`;
}

function showMissionProgress(mission, duration) {
    const worldmapTab = document.getElementById('worldmap-tab');
    const progressSection = document.createElement('div');
    progressSection.className = 'mission-progress';
    progressSection.id = 'missionProgress';
    
    progressSection.innerHTML = `
        <div class="progress-title">🚀 Mission in Progress</div>
        <div class="progress-description">${mission.name} - ${mission.difficulty}</div>
        <div class="progress-time" id="progressTimer">${duration}s</div>
        <div class="progress-description">Your heroes are fighting...</div>
    `;
    
    // Insert at the top of content-section
    const contentSection = worldmapTab.querySelector('.content-section');
    contentSection.insertBefore(progressSection, contentSection.firstChild);
    
    // Start countdown
    let timeLeft = duration;
    const timer = setInterval(() => {
        timeLeft--;
        document.getElementById('progressTimer').textContent = `${timeLeft}s`;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
        }
    }, 1000);
    
    // Disable mission buttons during combat
    const missionButtons = document.querySelectorAll('.btn');
    missionButtons.forEach(btn => {
        if (btn.textContent.includes('Start Mission')) {
            btn.disabled = true;
            btn.textContent = 'Mission in Progress...';
        }
    });
}

function completeMission(mission) {
    // NOUVEAU: Nettoyer le tracking de mission
    if (gameState.missionInProgress && gameState.missionInProgress.timer) {
        clearInterval(gameState.missionInProgress.timer); // Arrêter le timer de mise à jour
    }
    gameState.missionInProgress = null; // Nettoyer l'état
    
    // NOUVEAU: Cacher la fenêtre flottante
    hideFloatingMissionTracker();
    
    // Remove progress display (existing)
    const progressElement = document.getElementById('missionProgress');
    if (progressElement) {
        progressElement.remove();
    }
    
    // ... rest of the function stays the same
    // Simulate mission combat
    const missionResults = simulateDetailedMission(mission);
    
    // Apply rewards if successful
    if (missionResults.success) {
        gameState.gold += mission.goldReward;
        addPlayerXP(mission.xpReward);
        
        const currentMapData = worldMaps[gameState.currentMap];
        currentMapData.knowledge = Math.min(100, currentMapData.knowledge + mission.knowledgeReward);
        
        // Add XP to heroes
        gameState.selectedTeam.forEach(heroIndex => {
            const hero = heroes[heroIndex];
            const heroXP = Math.floor(mission.xpReward / gameState.selectedTeam.length);
            hero.currentXP += heroXP;
            
            // Level up heroes if needed (simple system for now)
            while (hero.currentXP >= hero.xpToNext) {
                hero.currentXP -= hero.xpToNext;
                hero.currentLevel++;
                hero.xpToNext = Math.floor(hero.xpToNext * 1.2);
            }
        });
        
        // Check for new mission unlocks
        unlockNewMissions();
    }
    
    // Show results modal
    showMissionResults(mission, missionResults);
    
    // Update UI
    updatePlayerUI();
    updateWorldMapTab();
}

function simulateDetailedMission(mission) {
    // Calculate party strength
    const partyStrength = gameState.selectedTeam.reduce((total, heroIndex) => {
        const hero = heroes[heroIndex];
        return total + hero.attack + hero.hp/10 + hero.speed + hero.def;
    }, 0);
    
    const difficultyThreshold = {
        "Easy": 350,
        "Medium": 1000, 
        "Hard": 2000
    };
    
    const requiredStrength = difficultyThreshold[mission.difficulty] || 900;
    const successChance = Math.min(95, (partyStrength / requiredStrength) * 55 + 35);
    
    const success = Math.random() * 100 < successChance;
    
    // Generate detailed combat stats for each hero
    const heroPerformance = gameState.selectedTeam.map(heroIndex => {
        const hero = heroes[heroIndex];
        
        // Simulate damage dealt (based on attack + some randomness)
        const baseDamage = hero.attack * (2 + Math.random() * 3); // 2-5x attack
        const damageDealt = Math.floor(baseDamage * (success ? 1 : 0.7)); // Less damage if failed
        
        // Simulate damage taken (based on mission difficulty)
        const enemyDamage = {
            "Easy": 50 + Math.random() * 100,
            "Medium": 100 + Math.random() * 150,
            "Hard": 200 + Math.random() * 200
        };
        const damageTaken = Math.floor((enemyDamage[mission.difficulty] || 100) * (success ? 0.7 : 1.2));
        
        // Calculate XP gained for this hero
        const heroXP = success ? Math.floor(mission.xpReward / gameState.selectedTeam.length) : Math.floor(mission.xpReward * 0.3 / gameState.selectedTeam.length);
        
        return {
            heroIndex,
            name: hero.name,
            role: hero.role,
            damageDealt,
            damageTaken: Math.min(damageTaken, hero.hp - 1), // Don't let heroes "die"
            xpGained: heroXP,
            criticalHits: Math.floor(Math.random() * 3), // 0-2 crits
            dodges: Math.floor(Math.random() * 2) // 0-1 dodges
        };
    });
    
    // Calculate mission duration (for display)
    const baseDuration = {
        "Easy": 5,
        "Medium": 15,
        "Hard": 30
    };
    const actualDuration = baseDuration[mission.difficulty] + Math.floor(Math.random() * 10 - 5); // ±5 seconds variance
    
    return {
        success,
        duration: Math.max(5, actualDuration), // Minimum 5 seconds
        heroPerformance,
        totalDamageDealt: heroPerformance.reduce((sum, hero) => sum + hero.damageDealt, 0),
        successChance: Math.round(successChance)
    };
}

function showMissionResults(mission, results) {
    // Create modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.id = 'missionModal';
    
    const modalContent = `
        <div class="mission-results-modal">
            <div class="modal-header">
                <div class="modal-title">${results.success ? '🏆 MISSION COMPLETE' : '💀 MISSION FAILED'}</div>
                <div class="modal-subtitle">${mission.name} (${mission.difficulty})</div>
            </div>
            
            <div class="modal-content">
                ${results.success ? generateSuccessContent(mission, results) : generateFailureContent(mission, results)}
                
                <div class="result-section">
                    <div class="section-header">👥 Heroes Performance</div>
                    ${results.heroPerformance.map(hero => `
                        <div class="hero-performance">
                            <div class="hero-name-perf">${getRoleIcon(hero.role)} ${hero.name} (+${hero.xpGained} XP)</div>
                            <div class="hero-stats-grid">
                                <div class="stat-item">
                                    <span>Damage Dealt:</span>
                                    <span style="color: #dc2626;">${hero.damageDealt}</span>
                                </div>
                                <div class="stat-item">
                                    <span>Damage Taken:</span>
                                    <span style="color: #f59e0b;">${hero.damageTaken}</span>
                                </div>
                                <div class="stat-item">
                                    <span>Critical Hits:</span>
                                    <span style="color: #10b981;">${hero.criticalHits}</span>
                                </div>
                                <div class="stat-item">
                                    <span>Dodges:</span>
                                    <span style="color: #6366f1;">${hero.dodges}</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="modal-actions">
                    <button class="modal-btn" onclick="closeMissionModal()">Continue</button>
                </div>
            </div>
        </div>
    `;
    
    modalOverlay.innerHTML = modalContent;
    document.body.appendChild(modalOverlay);
}

function generateSuccessContent(mission, results) {
    return `
        <div class="result-section">
            <div class="section-header">⏱️ Mission Info</div>
            <div class="reward-item">
                <span class="reward-label">Duration:</span>
                <span class="reward-value">${results.duration}s</span>
            </div>
            <div class="reward-item">
                <span class="reward-label">Success Chance:</span>
                <span class="reward-value">${results.successChance}%</span>
            </div>
            <div class="reward-item">
                <span class="reward-label">Total Damage Dealt:</span>
                <span class="reward-value">${results.totalDamageDealt}</span>
            </div>
        </div>
        
        <div class="result-section">
            <div class="section-header">💰 Rewards Earned</div>
            <div class="reward-item">
                <span class="reward-label">💰 Gold:</span>
                <span class="reward-value">+${mission.goldReward}</span>
            </div>
            <div class="reward-item">
                <span class="reward-label">⭐ Experience:</span>
                <span class="reward-value">+${mission.xpReward}</span>
            </div>
            <div class="reward-item">
                <span class="reward-label">📖 Knowledge:</span>
                <span class="reward-value">+${mission.knowledgeReward}%</span>
            </div>
        </div>
    `;
}

function generateFailureContent(mission, results) {
    return `
        <div class="result-section">
            <div class="section-header">💀 Mission Failed</div>
            <div class="reward-item">
                <span class="reward-label">Duration:</span>
                <span class="reward-value">${results.duration}s</span>
            </div>
            <div class="reward-item">
                <span class="reward-label">Success Chance:</span>
                <span class="reward-value">${results.successChance}%</span>
            </div>
            <p style="color: #dc2626; text-align: center; margin: 16px 0;">
                Your heroes need more training or better equipment!
            </p>
        </div>
        
        <div class="result-section">
            <div class="section-header">💰 Consolation Rewards</div>
            <div class="reward-item">
                <span class="reward-label">💰 Gold:</span>
                <span class="reward-value">+${Math.floor(mission.goldReward * 0.2)}</span>
            </div>
            <div class="reward-item">
                <span class="reward-label">⭐ Experience:</span>
                <span class="reward-value">+${Math.floor(mission.xpReward * 0.3)}</span>
            </div>
        </div>
    `;
}

function closeMissionModal() {
    const modal = document.getElementById('missionModal');
    if (modal) {
        modal.remove();
    }
}

function unlockNewMissions() {
    const currentMapData = worldMaps[gameState.currentMap];
    let newMissionsUnlocked = [];
    
    currentMapData.missions.forEach(mission => {
        if (!mission.unlocked && currentMapData.knowledge >= mission.knowledgeRequired) {
            mission.unlocked = true;
            newMissionsUnlocked.push(mission.name);
            console.log(`🆕 New mission unlocked: ${mission.name}`);
        }
    });
    
    // Show discovery notification for new missions
    if (newMissionsUnlocked.length > 0) {
        showMissionDiscoveryNotification(newMissionsUnlocked);
    }
}

function showMissionDiscoveryNotification(missionNames) {
    // Create a temporary notification popup
    const notification = document.createElement('div');
    notification.className = 'discovery-notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
        z-index: 1000;
        font-weight: 600;
        border: 2px solid #34d399;
        max-width: 300px;
    `;
    
    notification.innerHTML = `
        <div style="font-size: 1.1em; margin-bottom: 8px;">🎉 NEW MISSION${missionNames.length > 1 ? 'S' : ''} DISCOVERED!</div>
        ${missionNames.map(name => `<div style="font-size: 0.9em;">⚔️ ${name}</div>`).join('')}
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
        notification.remove();
    }, 4000);
}

function showFloatingMissionTracker(mission, duration) {
    // Remove existing tracker if any
    hideFloatingMissionTracker();
    
    // Create floating tracker
    const tracker = document.createElement('div');
    tracker.className = 'floating-mission-tracker';
    tracker.id = 'floatingMissionTracker';
    
    tracker.innerHTML = `
        <div class="tracker-header">
            <span>⚔️ Mission en cours</span>
        </div>
        <div class="tracker-content">
            <div class="tracker-mission-name">${mission.name} (${mission.difficulty})</div>
            <div class="tracker-progress-bar">
                <div class="tracker-progress-fill" id="trackerProgressFill" style="width: 0%"></div>
            </div>
            <div class="tracker-time-info">
                <span class="tracker-time-left" id="trackerTimeLeft">${duration}s</span>
                <span class="tracker-percentage" id="trackerPercentage">0%</span>
            </div>
            <div class="tracker-description">Your heroes are fighting...</div>
        </div>
    `;
    
    document.body.appendChild(tracker);
}
// ===== PLACEHOLDER FUNCTIONS =====

function updateInventoryTab() {
    const inventoryTab = document.getElementById('inventory-tab');
    inventoryTab.innerHTML = `
        <div class="content-header">
            <h1>Inventory</h1>
        </div>
        <div class="content-section">
            <div class="card">
                <p style="text-align: center; color: #a0a0a0; padding: 40px;">
                    🚧 Inventory system coming soon!<br>
                    Focus on missions and hero management for now.
                </p>
            </div>
        </div>
    `;
}

// ===== INITIALIZE GAME =====
document.addEventListener('DOMContentLoaded', initGame);