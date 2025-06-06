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
            abyss: 20,
            void: 30,
            nexus_corruption: { base: 35, variance: 10 },
            citadel_shadow: { base: 45, variance: 12 },
            realm_chaos: { base: 60, variance: 15 },
            void_station: { base: 75, variance: 18 },
            godforge_pinnacle: { base: 90, variance: 20 },
            infinity_gate: { base: 120, variance: 25 }
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
                minPower: 700,
                maxPower: 1000,
                baseGold: [30, 70],
                crystalChance: 0.15,
                crystalDrop: [1, 2],
                enemies: ["Scorpion Géant", "Serpent du Sable", "Élémentaire de Feu", "Momie"]
            },
            volcano: {
                name: "Volcan Infernal",
                icon: "🌋",
                minPower: 1100,
                maxPower: 1500,
                baseGold: [50, 100],
                crystalChance: 0.18,
                crystalDrop: [2, 4],
                enemies: ["Dragon de Lave", "Phénix Noir", "Démon de Feu", "Salamandre"]
            },
            abyss: {
                name: "Abîme Éternel",
                icon: "🕳️",
                minPower: 1600,
                maxPower: 2500,
                baseGold: [80, 150],
                crystalChance: 0.20,
                crystalDrop: [2, 4],
                enemies: ["Seigneur des Ténèbres", "Démon Ancien", "Ombre Maudite", "Kraken"]
            },
            void: {
                name: "The Void",
                icon: "🕳️",
                minPower: 2600,
                maxPower: 3500,
                baseGold: [300, 450],
                cryystalChance: [0,20],
                CrystalDrop: [2, 4],
                enemies: ["Void Infernal", "Void Knight", "Void Whisper", "Lord of the Void"]
            },
            // Nouvelles zones - Difficulté EXTRÊME
            nexus_corruption: {
                name: "Nexus Corrompu",
                icon: "🌀",
                minPower: 3600,
                maxPower: 4500,
                baseGold: [200, 400],
                crystalChance: 0.35,
                crystalDrop: [5, 10],
                enemies: ["Entité du Vide", "Gardien Corrompu", "Essence Chaotique", "Dévoreur d'Âmes"],
                unlockLevel: 35,
                description: "Un nexus dimensionnel où la réalité se déforme. Seuls les héros les mieux équipés survivent.",
                background: "linear-gradient(135deg, #6a0dad, #4b0082)",
                difficulty: "CAUCHEMAR"
            },
            citadel_shadow: {
                name: "Citadelle des Ombres",
                icon: "🏰",
                minPower: 4600,
                maxPower: 6000,
                baseGold: [300, 600],
                crystalChance: 0.40,
                crystalDrop: [8, 15],
                enemies: ["Seigneur Ombre", "Chevalier Noir", "Spectre Ancien", "Wraith Légendaire"],
                unlockLevel: 40,
                description: "Une forteresse où règnent les ténèbres absolues. L'équipement devient une nécessité vitale.",
                background: "linear-gradient(135deg, #000000, #2c2c2c)",
                difficulty: "APOCALYPTIQUE"
            },
            realm_chaos: {
                name: "Royaume du Chaos",
                icon: "⚡",
                minPower: 6100,
                maxPower: 8000,
                baseGold: [500, 1000],
                crystalChance: 0.45,
                crystalDrop: [10, 20],
                enemies: ["Archéon Chaotique", "Démiurge Fou", "Avatar de Destruction", "Cauchemar Primordial"],
                unlockLevel: 45,
                description: "Un plan d'existence où les lois de la physique n'existent plus. La puissance brute ne suffit plus.",
                background: "linear-gradient(135deg, #ff0080, #8000ff)",
                difficulty: "IMPOSSIBLE"
            },

            void_station: {
                name: "Station du Néant",
                icon: "🛸",
                minPower: 8100,
                maxPower: 10000,
                baseGold: [800, 1500],
                crystalChance: 0.50,
                crystalDrop: [15, 30],
                enemies: ["IA Transcendante", "Drone Quantique", "Collecteur Stellaire", "Entité Numérique"],
                unlockLevel: 50,
                description: "Une station spatiale abandonnée aux confins de l'univers. Technologie et magie s'affrontent.",
                background: "linear-gradient(135deg, #001122, #003366)",
                difficulty: "TRANSCENDANT"
            },
            godforge_pinnacle: {
                name: "Forge des Dieux",
                icon: "⚒️",
                minPower: 11000,
                maxPower: 15000,
                baseGold: [1200, 2500],
                crystalChance: 0.60,
                crystalDrop: [20, 40],
                enemies: ["Titan Forgeron", "Esprit de la Forge", "Gardien Divin", "Maître des Éléments"],
                unlockLevel: 55,
                description: "Là où les dieux forgent les armes légendaires. Chaque combat exige l'équipement parfait.",
                background: "linear-gradient(135deg, #ffd700, #ff8c00)",
                difficulty: "DIVIN"
            },
            infinity_gate: {
                name: "Porte de l'Infini",
                icon: "∞",
                minPower: 16000,
                maxPower: 35000,
                baseGold: [2000, 4000],
                crystalChance: 0.75,
                crystalDrop: [30, 60],
                enemies: ["Gardien de l'Infini", "Echo Temporel", "Paradoxe Vivant", "Créateur Ultime"],
                unlockLevel: 60,
                description: "Le seuil vers l'éternité. Seuls les héros avec l'équipement ultime osent franchir cette porte.",
                background: "linear-gradient(135deg, #ffffff, #ffff00)",
                difficulty: "∞ INFINI"
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