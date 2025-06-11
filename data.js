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
        maxKnowledge: 200,
        missions: [
            {
                id: 0,
                name: "Stray Defias",
                description: "Hunt down stray Defias scouts roaming the fields",
                difficulty: "Easy",
                knowledgeRequired: 0,
                knowledgeReward: 4,
                goldReward: 8,
                xpReward: 12,
                unlocked: true,
                completed: false
            },
            {
                id: 1,
                name: "Wild Boar Problem",
                description: "Thin out the aggressive boar population threatening crops",
                difficulty: "Easy",
                knowledgeRequired: 0,
                knowledgeReward: 3,
                goldReward: 6,
                xpReward: 10,
                unlocked: true,
                completed: false
            },
            {
                id: 2,
                name: "Defias Scout Patrol",
                description: "Eliminate Defias scouts gathering intelligence",
                difficulty: "Medium",
                knowledgeRequired: 15,
                knowledgeReward: 5,
                goldReward: 12,
                xpReward: 18,
                unlocked: false,
                completed: false
            },
            {
                id: 3,
                name: "Abandoned Farmstead",
                description: "Clear out the undead infesting the old Furlbrow farm",
                difficulty: "Medium",
                knowledgeRequired: 25,
                knowledgeReward: 4,
                goldReward: 15,
                xpReward: 20,
                unlocked: false,
                completed: false
            },
            {
                id: 4,
                name: "Mine Entrance Patrol",
                description: "Secure the entrance to the old Westfall mines",
                difficulty: "Medium",
                knowledgeRequired: 35,
                knowledgeReward: 6,
                goldReward: 18,
                xpReward: 25,
                unlocked: false,
                completed: false
            },
            {
                id: 5,
                name: "Defias Encampment",
                description: "Raid a small Defias camp hidden in the hills",
                difficulty: "Medium",
                knowledgeRequired: 50,
                knowledgeReward: 5,
                goldReward: 22,
                xpReward: 28,
                unlocked: false,
                completed: false
            },
            {
                id: 6,
                name: "Harvest Watcher Hunt",
                description: "Destroy the mechanical Harvest Watchers terrorizing farmers",
                difficulty: "Hard",
                knowledgeRequired: 65,
                knowledgeReward: 4,
                goldReward: 25,
                xpReward: 30,
                unlocked: false,
                completed: false
            },
            {
                id: 7,
                name: "Murloc Coast Raid",
                description: "Clear the murloc settlements along the western shore",
                difficulty: "Medium",
                knowledgeRequired: 80,
                knowledgeReward: 3,
                goldReward: 20,
                xpReward: 22,
                unlocked: false,
                completed: false
            },
            {
                id: 8,
                name: "Defias Messenger",
                description: "Intercept a Defias messenger carrying important documents",
                difficulty: "Hard",
                knowledgeRequired: 95,
                knowledgeReward: 6,
                goldReward: 35,
                xpReward: 40,
                unlocked: false,
                completed: false
            },
            {
                id: 9,
                name: "Deep Mine Exploration",
                description: "Venture deep into the mine shafts to clear out kobolds",
                difficulty: "Hard",
                knowledgeRequired: 110,
                knowledgeReward: 4,
                goldReward: 30,
                xpReward: 35,
                unlocked: false,
                completed: false
            },
            {
                id: 10,
                name: "Defias Lieutenant",
                description: "Eliminate a Defias Lieutenant planning raids on Stormwind",
                difficulty: "Hard",
                knowledgeRequired: 125,
                knowledgeReward: 5,
                goldReward: 45,
                xpReward: 50,
                unlocked: false,
                completed: false
            },
            {
                id: 11,
                name: "The Jangolode Mine",
                description: "Investigate strange activities in the deepest mine shaft",
                difficulty: "Hard",
                knowledgeRequired: 145,
                knowledgeReward: 4,
                goldReward: 40,
                xpReward: 45,
                unlocked: false,
                completed: false
            },
            {
                id: 12,
                name: "Defias Captain Raid",
                description: "Assault the main Defias stronghold and capture their captain",
                difficulty: "Hard",
                knowledgeRequired: 165,
                knowledgeReward: 6,
                goldReward: 60,
                xpReward: 70,
                unlocked: false,
                completed: false
            },
            {
                id: 13,
                name: "Deadmines Entrance",
                description: "Scout the entrance to the infamous Deadmines",
                difficulty: "Hard",
                knowledgeRequired: 180,
                knowledgeReward: 3,
                goldReward: 50,
                xpReward: 60,
                unlocked: false,
                completed: false
            },
            {
                id: 14,
                name: "The Deadmines",
                description: "Face Van Cleef and his Defias Brotherhood in their stronghold",
                difficulty: "Very Hard",
                knowledgeRequired: 195,
                knowledgeReward: 5,
                goldReward: 150,
                xpReward: 200,
                unlocked: false,
                completed: false
            }
        ]
    }
];

// Item Database - Tous les items possibles du jeu
const itemDatabase = {
    // === RESOURCES ===
    "linen_cloth": { 
        name: "Linen Cloth", 
        type: "resource", 
        maxStack: 50, 
        description: "Soft fabric used in basic crafting" 
    },
    "rough_stone": { 
        name: "Rough Stone", 
        type: "resource", 
        maxStack: 20, 
        description: "Basic stone material" 
    },
    "copper_ore": { 
        name: "Copper Ore", 
        type: "resource", 
        maxStack: 30, 
        description: "Raw copper from mines" 
    },
    "leather_scraps": { 
        name: "Leather Scraps", 
        type: "resource", 
        maxStack: 40, 
        description: "Pieces of leather from defeated enemies" 
    },
    
    // === EQUIPMENT ===
    "iron_sword": { 
        name: "Iron Sword", 
        type: "equipment", 
        maxStack: 1, 
        description: "A sturdy iron blade (+5 Attack)" 
    },
    "leather_boots": { 
        name: "Leather Boots", 
        type: "equipment", 
        maxStack: 1, 
        description: "Basic leather footwear (+2 Speed)" 
    },
    "chainmail_vest": { 
        name: "Chainmail Vest", 
        type: "equipment", 
        maxStack: 1, 
        description: "Metal armor providing good protection (+8 Defense)" 
    },
    
    // === CONSUMABLES ===
    "minor_potion": { 
        name: "Minor Health Potion", 
        type: "consumable", 
        maxStack: 10, 
        description: "Restores a small amount of health" 
    },
    "bread": { 
        name: "Bread", 
        type: "consumable", 
        maxStack: 20, 
        description: "Simple food that provides energy" 
    },
    "strength_elixir": { 
        name: "Strength Elixir", 
        type: "consumable", 
        maxStack: 5, 
        description: "Temporarily increases attack power" 
    }
};