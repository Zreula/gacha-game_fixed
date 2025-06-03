// Configuration globale du jeu
const GAME_CONFIG = {
    // Version du jeu
    VERSION: "1.0.0",
    
    // Paramètres d'invocation
    GACHA: {
        SUMMON_COST: 10,                    // Coût d'une invocation x10
        SUMMON_COUNT: 10,                   // Nombre de personnages par invocation
        MAX_CHARACTERS: 100,                // Nombre total de personnages disponibles
        
        // Probabilités par rareté
        RARITY_RATES: {
            legendary: 0.05,                // 5%
            epic: 0.15,                     // 15%
            rare: 0.30,                     // 30%
            common: 0.50                    // 50%
        }
    },
    
    // Paramètres de combat
    COMBAT: {
        MAX_EQUIPPED: 5,                    // Nombre max de personnages équipés
        
        // Durées des missions (en secondes)
        MISSION_DURATIONS: {
            forest: 5,
            mountain: 8,
            desert: 12,
            volcano: 15,
            abyss: 20
        },
        
        // Zones de combat
        ZONES: {
            forest: {
                name: "Forêt Mystique",
                icon: "🌲",
                minPower: 50,
                maxPower: 150,
                baseGold: [10, 30],
                crystalChance: 0.10,
                crystalDrop: [1, 2],
                enemies: ["Loup Sauvage", "Ours des Bois", "Araignée Géante", "Gobelin"]
            },
            mountain: {
                name: "Montagne Rocheuse",
                icon: "⛰️",
                minPower: 300,
                maxPower: 600,
                baseGold: [20, 50],
                crystalChance: 0.12,
                crystalDrop: [1, 2],
                enemies: ["Troll des Montagnes", "Aigle Géant", "Golem de Pierre", "Yéti"]
            },
            desert: {
                name: "Désert Ardent",
                icon: "🏜️",
                minPower: 600,
                maxPower: 1000,
                baseGold: [30, 70],
                crystalChance: 0.15,
                crystalDrop: [1, 2],
                enemies: ["Scorpion Géant", "Serpent du Sable", "Élémentaire de Feu", "Momie"]
            },
            volcano: {
                name: "Volcan Infernal",
                icon: "🌋",
                minPower: 1000,
                maxPower: 1500,
                baseGold: [50, 100],
                crystalChance: 0.18,
                crystalDrop: [2, 4],
                enemies: ["Dragon de Lave", "Phénix Noir", "Démon de Feu", "Salamandre"]
            },
            abyss: {
                name: "Abîme Éternel",
                icon: "🕳️",
                minPower: 1500,
                maxPower: 2500,
                baseGold: [80, 150],
                crystalChance: 0.20,
                crystalDrop: [2, 4],
                enemies: ["Seigneur des Ténèbres", "Démon Ancien", "Ombre Maudite", "Kraken"]
            }
        }
    },
    
    // Paramètres d'équipement
    EQUIPMENT: {
        TYPES: {
            weapon: "⚔️",
            armor: "🛡️",
            accessory: "💍"
        }
    },
    
    // Paramètres de sauvegarde
    SAVE: {
        KEY: "gachaGameSave",               // Clé localStorage
        AUTO_SAVE: true,                    // Sauvegarde automatique activée
        AUTO_SAVE_INTERVAL: 30000,          // Intervalle auto-save (30 secondes)
        NOTIFICATION_DURATION: 3000         // Durée des notifications (3 secondes)
    },
    
    // Paramètres d'interface
    UI: {
        ANIMATION_DURATION: 300,            // Durée des animations (ms)
        CARD_ANIMATION_DELAY: 100,          // Délai entre les cartes (ms)
        MISSION_RESTART_DELAY: 500,         // Délai entre missions idle (ms)
        
        // Classes CSS
        CLASSES: {
            ACTIVE: 'active',
            HIDDEN: 'hidden',
            LOADING: 'loading',
            ERROR: 'error',
            SUCCESS: 'success'
        }
    },
    
    // Éléments et types de personnages
    GAME_DATA: {
        ELEMENTS: [
            "Feu", "Eau", "Terre", "Air", "Lumière", 
            "Ombre", "Foudre", "Glace", "Nature", 
            "Poison", "Arcane", "Neutre"
        ],
        
        TYPES: [
            "Guerrier", "Mage", "Archer", "Assassin", 
            "Clerc", "Paladin", "Berserker", "Druide", 
            "Barde", "Alchimiste", "Espion", "Marchand"
        ],
        
        // Plages de stats par rareté
        STAT_RANGES: {
            legendary: { min: 70, max: 100 },
            epic: { min: 50, max: 85 },
            rare: { min: 35, max: 70 },
            common: { min: 20, max: 50 }
        }
    },
    
    // Mode debug
    DEBUG: {
        ENABLED: false,                     // Activer les logs de debug
        SHOW_PROBABILITIES: false,          // Afficher les probabilités
        FAST_MISSIONS: false,               // Missions accélérées pour test
        UNLIMITED_CRYSTALS: false           // Cristaux illimités pour test
    }
};