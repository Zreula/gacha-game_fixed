export class QuestManager {
    constructor(gameState) {
        this.gameState = gameState;
        this.questTemplates = this.initQuestTemplates();
        this.questRefreshTimer = 0;
        this.questRefreshInterval = 300; // 5 minutes
        this.init();
    }

    init() {
        // Générer des quêtes initiales
        this.generateNewQuests();
    }

    initQuestTemplates() {
        return {
            // Quêtes de récolte
            gather_copper: {
                type: 'gather',
                title: 'Récolte de cuivre',
                description: 'Un forgeron a besoin de minerai de cuivre pour ses créations.',
                requirements: {
                    copper_ore: 10
                },
                rewards: {
                    gold: 50,
                    experience: 25
                },
                duration: 600, // 10 minutes
                difficulty: 'easy',
                profession: 'mining'
            },
            
            gather_herbs: {
                type: 'gather',
                title: 'Cueillette d\'herbes',
                description: 'Un alchimiste recherche des herbes fraîches.',
                requirements: {
                    peacebloom: 8,
                    silverleaf: 5
                },
                rewards: {
                    gold: 40,
                    experience: 20
                },
                duration: 480,
                difficulty: 'easy',
                profession: 'herbalism'
            },

            gather_leather: {
                type: 'gather',
                title: 'Collecte de cuir',
                description: 'Un artisan en cuir a besoin de matériaux.',
                requirements: {
                    light_leather: 6
                },
                rewards: {
                    gold: 35,
                    experience: 18
                },
                duration: 420,
                difficulty: 'easy',
                profession: 'skinning'
            },

            // Quêtes de craft
            craft_weapons: {
                type: 'craft',
                title: 'Forger des armes',
                description: 'La garde de la ville a besoin d\'armes.',
                requirements: {
                    copper_sword: 3,
                    copper_dagger: 2
                },
                rewards: {
                    gold: 120,
                    experience: 50
                },
                duration: 900,
                difficulty: 'medium',
                profession: 'blacksmithing'
            },

            craft_potions: {
                type: 'craft',
                title: 'Préparer des potions',
                description: 'L\'infirmerie manque de potions de soins.',
                requirements: {
                    minor_healing_potion: 5
                },
                rewards: {
                    gold: 80,
                    experience: 40
                },
                duration: 720,
                difficulty: 'medium',
                profession: 'alchemy'
            },

            craft_armor: {
                type: 'craft',
                title: 'Confectionner des équipements',
                description: 'De nouveaux aventuriers ont besoin d\'équipements.',
                requirements: {
                    linen_cloth_gloves: 2,
                    linen_cloth_boots: 2
                },
                rewards: {
                    gold: 70,
                    experience: 35
                },
                duration: 600,
                difficulty: 'medium',
                profession: 'tailoring'
            },

            // Quêtes mixtes
            supply_run: {
                type: 'mixed',
                title: 'Ravitaillement urgent',
                description: 'Un expédition a besoin de supplies variées.',
                requirements: {
                    copper_ore: 5,
                    minor_healing_potion: 3,
                    light_leather: 4
                },
                rewards: {
                    gold: 150,
                    experience: 75,
                    bonus_item: 'linen_cloth'
                },
                duration: 1200,
                difficulty: 'hard',
                profession: 'multiple'
            },

            // Quêtes spéciales (événements)
            weekly_mining: {
                type: 'weekly',
                title: 'Commande Hebdomadaire - Minage',
                description: 'La guilde des mineurs lance une grande commande.',
                requirements: {
                    copper_ore: 50,
                    tin_ore: 25,
                    iron_ore: 10
                },
                rewards: {
                    gold: 500,
                    experience: 200,
                    efficiency_boost: 'mining'
                },
                duration: 10080, // 1 semaine
                difficulty: 'legendary',
                profession: 'mining'
            }
        };
    }

    update(deltaTime) {
        this.questRefreshTimer += deltaTime;
        
        // Actualiser les quêtes disponibles
        if (this.questRefreshTimer >= this.questRefreshInterval) {
            this.questRefreshTimer = 0;
            this.refreshQuests();
        }

        // Mettre à jour les quêtes actives
        this.updateActiveQuests(deltaTime);
    }

    generateNewQuests() {
        const availableTemplates = Object.keys(this.questTemplates);
        const numQuests = Math.min(5, availableTemplates.length);
        
        // Effacer les anciennes quêtes disponibles
        this.gameState.quests.available = [];
        
        // Générer de nouvelles quêtes
        for (let i = 0; i < numQuests; i++) {
            const templateName = availableTemplates[Math.floor(Math.random() * availableTemplates.length)];
            const quest = this.createQuestFromTemplate(templateName);
            
            // Éviter les doublons
            if (!this.gameState.quests.available.find(q => q.templateName === templateName)) {
                this.gameState.quests.available.push(quest);
            }
        }
    }

    createQuestFromTemplate(templateName) {
        const template = this.questTemplates[templateName];
        if (!template) return null;

        return {
            id: this.generateQuestId(),
            templateName: templateName,
            title: template.title,
            description: template.description,
            type: template.type,
            requirements: { ...template.requirements },
            rewards: { ...template.rewards },
            duration: template.duration,
            difficulty: template.difficulty,
            profession: template.profession,
            progress: {},
            timeRemaining: template.duration,
            status: 'available'
        };
    }

    generateQuestId() {
        return 'quest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    acceptQuest(questId) {
        const questIndex = this.gameState.quests.available.findIndex(q => q.id === questId);
        if (questIndex === -1) return false;

        const quest = this.gameState.quests.available[questIndex];
        
        // Vérifier si le joueur peut accepter la quête
        if (this.gameState.quests.active.length >= 3) {
            return { success: false, reason: 'Trop de quêtes actives (max 3)' };
        }

        // Initialiser le progrès
        quest.progress = {};
        for (const requirement in quest.requirements) {
            quest.progress[requirement] = 0;
        }
        
        quest.status = 'active';
        quest.startTime = Date.now();
        
        // Déplacer vers les quêtes actives
        this.gameState.quests.available.splice(questIndex, 1);
        this.gameState.quests.active.push(quest);
        
        return { success: true, quest: quest };
    }

    updateActiveQuests(deltaTime) {
        this.gameState.quests.active.forEach(quest => {
            // Réduire le temps restant
            quest.timeRemaining -= deltaTime;
            
            // Mettre à jour le progrès selon les objets en inventaire
            this.updateQuestProgress(quest);
            
            // Vérifier si la quête est terminée
            if (this.isQuestComplete(quest)) {
                quest.status = 'ready_to_complete';
            }
            
            // Vérifier si la quête a expiré
            if (quest.timeRemaining <= 0) {
                quest.status = 'expired';
            }
        });
    }

    updateQuestProgress(quest) {
        for (const [item, required] of Object.entries(quest.requirements)) {
            let available = 0;
            
            // Vérifier dans les ressources
            if (this.gameState.inventory.resources[item] !== undefined) {
                available = this.gameState.inventory.resources[item];
            }
            // Vérifier dans les objets craftés
            else if (this.gameState.inventory.crafted[item] !== undefined) {
                available = this.gameState.inventory.crafted[item];
            }
            
            quest.progress[item] = Math.min(available, required);
        }
    }

    isQuestComplete(quest) {
        for (const [item, required] of Object.entries(quest.requirements)) {
            if ((quest.progress[item] || 0) < required) {
                return false;
            }
        }
        return true;
    }

    completeQuest(questId) {
        const questIndex = this.gameState.quests.active.findIndex(q => q.id === questId);
        if (questIndex === -1) return false;

        const quest = this.gameState.quests.active[questIndex];
        
        if (!this.isQuestComplete(quest)) {
            return { success: false, reason: 'Quête non terminée' };
        }

        // Consommer les objets requis
        for (const [item, required] of Object.entries(quest.requirements)) {
            if (this.gameState.inventory.resources[item] !== undefined) {
                this.gameState.removeResource(item, required);
            } else if (this.gameState.inventory.crafted[item] !== undefined) {
                this.gameState.removeCraftedItem(item, required);
            }
        }

        // Donner les récompenses
        const rewards = this.giveQuestRewards(quest);
        
        // Marquer comme terminée
        quest.status = 'completed';
        quest.completedTime = Date.now();
        
        // Déplacer vers les quêtes terminées
        this.gameState.quests.active.splice(questIndex, 1);
        this.gameState.quests.completed.push(quest);
        
        return { success: true, quest: quest, rewards: rewards };
    }

    giveQuestRewards(quest) {
        const rewards = [];
        
        // Récompense en or
        if (quest.rewards.gold) {
            this.gameState.addGold(quest.rewards.gold);
            rewards.push({ type: 'gold', amount: quest.rewards.gold });
        }
        
        // Récompense en expérience (pour le joueur)
        if (quest.rewards.experience) {
            // TODO: Ajouter système d'expérience joueur
            rewards.push({ type: 'experience', amount: quest.rewards.experience });
        }
        
        // Objets bonus
        if (quest.rewards.bonus_item) {
            const bonusAmount = Math.floor(Math.random() * 5) + 1;
            this.gameState.addResource(quest.rewards.bonus_item, bonusAmount);
            rewards.push({ 
                type: 'item', 
                item: quest.rewards.bonus_item, 
                amount: bonusAmount 
            });
        }
        
        // Boost d'efficacité temporaire
        if (quest.rewards.efficiency_boost) {
            const profession = quest.rewards.efficiency_boost;
            if (this.gameState.professions[profession]) {
                this.gameState.professions[profession].efficiency += 0.2;
                rewards.push({ 
                    type: 'efficiency_boost', 
                    profession: profession, 
                    amount: 0.2 
                });
            }
        }
        
        return rewards;
    }

    abandonQuest(questId) {
        const questIndex = this.gameState.quests.active.findIndex(q => q.id === questId);
        if (questIndex === -1) return false;

        // Supprimer la quête active
        this.gameState.quests.active.splice(questIndex, 1);
        return true;
    }

    refreshQuests() {
        // Supprimer les quêtes non acceptées anciennes
        const now = Date.now();
        this.gameState.quests.available = this.gameState.quests.available.filter(quest => {
            const age = (now - (quest.generatedTime || now)) / 1000;
            return age < 1800; // Garder pendant 30 minutes max
        });
        
        // Ajouter de nouvelles quêtes si nécessaire
        const currentCount = this.gameState.quests.available.length;
        const targetCount = 5;
        
        if (currentCount < targetCount) {
            const availableTemplates = Object.keys(this.questTemplates);
            const existingTemplates = this.gameState.quests.available.map(q => q.templateName);
            const newTemplates = availableTemplates.filter(t => !existingTemplates.includes(t));
            
            for (let i = currentCount; i < targetCount && newTemplates.length > 0; i++) {
                const templateIndex = Math.floor(Math.random() * newTemplates.length);
                const templateName = newTemplates.splice(templateIndex, 1)[0];
                const quest = this.createQuestFromTemplate(templateName);
                
                if (quest) {
                    quest.generatedTime = now;
                    this.gameState.quests.available.push(quest);
                }
            }
        }
    }

    getQuestsByDifficulty(difficulty) {
        return this.gameState.quests.available.filter(quest => quest.difficulty === difficulty);
    }

    getQuestsByProfession(profession) {
        return this.gameState.quests.available.filter(quest => 
            quest.profession === profession || quest.profession === 'multiple'
        );
    }

    getActiveQuestProgress(questId) {
        const quest = this.gameState.quests.active.find(q => q.id === questId);
        if (!quest) return null;

        const progress = {};
        for (const [item, required] of Object.entries(quest.requirements)) {
            const current = quest.progress[item] || 0;
            progress[item] = {
                current: current,
                required: required,
                percentage: (current / required) * 100
            };
        }
        
        return {
            questId: questId,
            title: quest.title,
            progress: progress,
            timeRemaining: quest.timeRemaining,
            status: quest.status
        };
    }

    getAllActiveQuestProgress() {
        return this.gameState.quests.active.map(quest => 
            this.getActiveQuestProgress(quest.id)
        );
    }

    getQuestRecommendations() {
        const recommendations = [];
        const playerProfessions = this.gameState.professions;
        
        // Recommander des quêtes selon les niveaux des métiers
        for (const [profName, profData] of Object.entries(playerProfessions)) {
            const profQuests = this.getQuestsByProfession(profName);
            
            // Filtrer selon le niveau
            const suitableQuests = profQuests.filter(quest => {
                const difficulty = quest.difficulty;
                const level = profData.level;
                
                if (difficulty === 'easy' && level >= 1) return true;
                if (difficulty === 'medium' && level >= 10) return true;
                if (difficulty === 'hard' && level >= 25) return true;
                if (difficulty === 'legendary' && level >= 50) return true;
                
                return false;
            });
            
            if (suitableQuests.length > 0) {
                recommendations.push({
                    profession: profName,
                    level: profData.level,
                    recommendedQuests: suitableQuests.slice(0, 2) // Max 2 par profession
                });
            }
        }
        
        return recommendations;
    }

    getDifficultyColor(difficulty) {
        const colors = {
            easy: '#4CAF50',
            medium: '#FF9800',
            hard: '#f44336',
            legendary: '#9C27B0'
        };
        return colors[difficulty] || '#666';
    }

    getDifficultyDisplayName(difficulty) {
        const names = {
            easy: 'Facile',
            medium: 'Moyen',
            hard: 'Difficile',
            legendary: 'Légendaire'
        };
        return names[difficulty] || difficulty;
    }

    formatTimeRemaining(seconds) {
        if (seconds <= 0) return 'Expiré';
        
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else if (minutes > 0) {
            return `${minutes}m ${secs}s`;
        } else {
            return `${secs}s`;
        }
    }

    getQuestStats() {
        const completed = this.gameState.quests.completed.length;
        const active = this.gameState.quests.active.length;
        const available = this.gameState.quests.available.length;
        
        // Calculer les récompenses totales gagnées
        let totalGoldEarned = 0;
        let totalExperienceEarned = 0;
        
        this.gameState.quests.completed.forEach(quest => {
            totalGoldEarned += quest.rewards.gold || 0;
            totalExperienceEarned += quest.rewards.experience || 0;
        });
        
        return {
            completed: completed,
            active: active,
            available: available,
            totalGoldEarned: totalGoldEarned,
            totalExperienceEarned: totalExperienceEarned,
            completionRate: completed > 0 ? (completed / (completed + active)) * 100 : 0
        };
    }

    // Système de quêtes journalières
    generateDailyQuests() {
        const dailyTemplates = [
            'gather_copper',
            'gather_herbs',
            'gather_leather',
            'craft_potions'
        ];
        
        const dailyQuests = [];
        const today = new Date().toDateString();
        
        // Vérifier si on a déjà généré les quêtes du jour
        const existingDaily = this.gameState.quests.available.find(q => 
            q.daily === true && q.generatedDate === today
        );
        
        if (!existingDaily) {
            // Générer 2 quêtes journalières
            for (let i = 0; i < 2; i++) {
                const templateName = dailyTemplates[Math.floor(Math.random() * dailyTemplates.length)];
                const quest = this.createQuestFromTemplate(templateName);
                
                if (quest) {
                    quest.daily = true;
                    quest.generatedDate = today;
                    quest.rewards.gold *= 1.5; // Bonus pour les quêtes journalières
                    quest.title = '[Journalière] ' + quest.title;
                    dailyQuests.push(quest);
                }
            }
            
            // Ajouter aux quêtes disponibles
            this.gameState.quests.available.push(...dailyQuests);
        }
        
        return dailyQuests;
    }

    // Nettoyage des anciennes quêtes terminées
    cleanupCompletedQuests() {
        const maxCompleted = 50; // Garder max 50 quêtes terminées
        
        if (this.gameState.quests.completed.length > maxCompleted) {
            // Trier par date de completion et garder les plus récentes
            this.gameState.quests.completed.sort((a, b) => 
                (b.completedTime || 0) - (a.completedTime || 0)
            );
            
            this.gameState.quests.completed = this.gameState.quests.completed.slice(0, maxCompleted);
        }
    }
}