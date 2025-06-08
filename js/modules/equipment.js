// Module EquipmentSystem - Gestion de l'équipement des personnages
const EquipmentSystem = {
    // Base de données des équipements
    equipmentDB: {
        // ARMES
        weapons: {
            // Commun
            'rusty_sword': {
                id: 'rusty_sword',
                name: 'Épée Rouillée',
                type: 'weapon',
                rarity: 'common',
                icon: '⚔️',
                stats: { attack: 5, defense: 0, speed: 0, magic: 0 },
                price: 100,
                description: 'Une épée basique et rouillée, mais fonctionnelle.'
            },
            'wooden_staff': {
                id: 'wooden_staff',
                name: 'Bâton de Bois',
                type: 'weapon',
                rarity: 'common',
                icon: '🏒',
                stats: { attack: 2, defense: 0, speed: 0, magic: 8 },
                price: 120,
                description: 'Un simple bâton de bois pour débuter en magie.'
            },
            
            // Rare
            'steel_blade': {
                id: 'steel_blade',
                name: 'Lame d\'Acier',
                type: 'weapon',
                rarity: 'rare',
                icon: '⚔️',
                stats: { attack: 15, defense: 2, speed: 3, magic: 0 },
                price: 500,
                description: 'Une épée d\'acier bien forgée, tranchante et équilibrée.'
            },
            'crystal_wand': {
                id: 'crystal_wand',
                name: 'Baguette de Cristal',
                type: 'weapon',
                rarity: 'rare',
                icon: '🪄',
                stats: { attack: 5, defense: 0, speed: 5, magic: 20 },
                price: 600,
                description: 'Une baguette ornée d\'un cristal amplifiant la magie.'
            },
            
            // Épique
            'flamebrand': {
                id: 'flamebrand',
                name: 'Lame de Flamme',
                type: 'weapon',
                rarity: 'epic',
                icon: '🔥',
                stats: { attack: 30, defense: 5, speed: 8, magic: 12 },
                price: 2000,
                description: 'Une épée enflammée qui brûle d\'un feu éternel.'
            },
            'void_staff': {
                id: 'void_staff',
                name: 'Sceptre du Vide',
                type: 'weapon',
                rarity: 'epic',
                icon: '🌑',
                stats: { attack: 10, defense: 8, speed: 10, magic: 35 },
                price: 2200,
                description: 'Un sceptre qui puise sa force dans les ténèbres du vide.'
            },
            
            // Légendaire
            'excalibur': {
                id: 'excalibur',
                name: 'Excalibur',
                type: 'weapon',
                rarity: 'legendary',
                icon: '⚡',
                stats: { attack: 50, defense: 15, speed: 20, magic: 25 },
                price: 10000,
                description: 'L\'épée légendaire des rois, symbole de justice et de pouvoir.'
            }
        },
        
        // ARMURES
        armors: {
            // Commun
            'leather_vest': {
                id: 'leather_vest',
                name: 'Gilet de Cuir',
                type: 'armor',
                rarity: 'common',
                icon: '🦺',
                stats: { attack: 0, defense: 8, speed: -1, magic: 0 },
                price: 80,
                description: 'Une protection basique en cuir souple.'
            },
            'cloth_robe': {
                id: 'cloth_robe',
                name: 'Robe de Tissu',
                type: 'armor',
                rarity: 'common',
                icon: '👘',
                stats: { attack: 0, defense: 3, speed: 2, magic: 5 },
                price: 90,
                description: 'Une robe légère favorisant la concentration magique.'
            },
            
            // Rare
            'chainmail': {
                id: 'chainmail',
                name: 'Cotte de Mailles',
                type: 'armor',
                rarity: 'rare',
                icon: '🛡️',
                stats: { attack: 2, defense: 18, speed: -3, magic: 0 },
                price: 400,
                description: 'Une armure de mailles offrant une bonne protection.'
            },
            'mage_robes': {
                id: 'mage_robes',
                name: 'Robes de Mage',
                type: 'armor',
                rarity: 'rare',
                icon: '🧙‍♂️',
                stats: { attack: 0, defense: 8, speed: 5, magic: 15 },
                price: 450,
                description: 'Des robes enchantées qui amplifient les pouvoirs magiques.'
            },
            
            // Épique
            'dragon_scale': {
                id: 'dragon_scale',
                name: 'Armure d\'Écailles',
                type: 'armor',
                rarity: 'epic',
                icon: '🐉',
                stats: { attack: 8, defense: 35, speed: 0, magic: 10 },
                price: 1800,
                description: 'Une armure forgée à partir d\'écailles de dragon.'
            },
            'archmage_vestments': {
                id: 'archmage_vestments',
                name: 'Habits d\'Archimage',
                type: 'armor',
                rarity: 'epic',
                icon: '✨',
                stats: { attack: 5, defense: 15, speed: 12, magic: 30 },
                price: 2000,
                description: 'Les vêtements sacrés des plus grands mages.'
            },
            
            // Légendaire
            'titan_plate': {
                id: 'titan_plate',
                name: 'Armure de Titan',
                type: 'armor',
                rarity: 'legendary',
                icon: '⚱️',
                stats: { attack: 15, defense: 60, speed: -5, magic: 15 },
                price: 8000,
                description: 'Une armure légendaire portée par les titans d\'autrefois.'
            }
        },
        
        // ACCESSOIRES
        accessories: {
            // Commun
            'copper_ring': {
                id: 'copper_ring',
                name: 'Anneau de Cuivre',
                type: 'accessory',
                rarity: 'common',
                icon: '💍',
                stats: { attack: 2, defense: 1, speed: 1, magic: 1 },
                price: 60,
                description: 'Un simple anneau de cuivre aux propriétés magiques mineures.'
            },
            'health_amulet': {
                id: 'health_amulet',
                name: 'Amulette de Vitalité',
                type: 'accessory',
                rarity: 'common',
                icon: '🔮',
                stats: { attack: 0, defense: 5, speed: 0, magic: 2 },
                price: 70,
                description: 'Une amulette qui renforce légèrement la vitalité.'
            },
            
            // Rare
            'silver_pendant': {
                id: 'silver_pendant',
                name: 'Pendentif d\'Argent',
                type: 'accessory',
                rarity: 'rare',
                icon: '📿',
                stats: { attack: 5, defense: 3, speed: 7, magic: 8 },
                price: 350,
                description: 'Un pendentif d\'argent béni qui équilibre toutes les capacités.'
            },
            'power_gauntlet': {
                id: 'power_gauntlet',
                name: 'Gantelet de Force',
                type: 'accessory',
                rarity: 'rare',
                icon: '🧤',
                stats: { attack: 12, defense: 5, speed: -2, magic: 0 },
                price: 380,
                description: 'Un gantelet magique qui décuple la force physique.'
            },
            
            // Épique
            'dragon_heart': {
                id: 'dragon_heart',
                name: 'Cœur de Dragon',
                type: 'accessory',
                rarity: 'epic',
                icon: '❤️',
                stats: { attack: 20, defense: 15, speed: 10, magic: 20 },
                price: 1500,
                description: 'Le cœur cristallisé d\'un ancien dragon, source de pouvoir immense.'
            },
            'time_crystal': {
                id: 'time_crystal',
                name: 'Cristal Temporel',
                type: 'accessory',
                rarity: 'epic',
                icon: '⏳',
                stats: { attack: 10, defense: 10, speed: 25, magic: 15 },
                price: 1600,
                description: 'Un cristal qui manipule le flux du temps, accélérant son porteur.'
            },
            
            // Légendaire
            'infinity_stone': {
                id: 'infinity_stone',
                name: 'Pierre d\'Infinité',
                type: 'accessory',
                rarity: 'legendary',
                icon: '💎',
                stats: { attack: 30, defense: 25, speed: 20, magic: 35 },
                price: 15000,
                description: 'Une gemme cosmique aux pouvoirs illimités.'
            }
        }
    },
    
    // Initialisation du module
    init() {
        console.log('⚔️ Initialisation du système d\'équipement...');
        this.validateEquipmentDB();
    },
    
    // Validation de la base de données d'équipements
    validateEquipmentDB() {
        let totalItems = 0;
        Object.values(this.equipmentDB).forEach(category => {
            totalItems += Object.keys(category).length;
        });
        console.log(`📦 ${totalItems} équipements chargés`);
    },
    
    // Obtenir tous les équipements d'un type
    getEquipmentByType(type) {
        const typeMap = {
            'weapon': 'weapons',
            'armor': 'armors',
            'accessory': 'accessories'
        };
        
        const categoryKey = typeMap[type];
        return categoryKey ? Object.values(this.equipmentDB[categoryKey]) : [];
    },
    
    // Obtenir un équipement par son ID
    getEquipmentById(id) {
        for (const category of Object.values(this.equipmentDB)) {
            if (category[id]) {
                return category[id];
            }
        }
        return null;
    },
    
    // Obtenir tous les équipements
    getAllEquipment() {
        const allEquipment = [];
        Object.values(this.equipmentDB).forEach(category => {
            allEquipment.push(...Object.values(category));
        });
        return allEquipment;
    },
    
    // Équiper un objet à un personnage
    equipItem(characterName, equipmentId, slot) {
        const equipment = this.getEquipmentById(equipmentId);
        if (!equipment) {
            console.error(`❌ Équipement non trouvé: ${equipmentId}`);
            return false;
        }
        
        // Vérifier que le slot correspond au type d'équipement
        if (equipment.type !== slot) {
            console.error(`❌ Type d'équipement incorrect: ${equipment.type} ≠ ${slot}`);
            return false;
        }
        
        // Initialiser l'équipement du personnage si nécessaire
        if (!gameState.characterEquipment[characterName]) {
            gameState.characterEquipment[characterName] = {};
        }
        
        // Équiper l'objet
        gameState.characterEquipment[characterName][slot] = equipmentId;
        
        console.log(`✅ ${characterName} équipé avec ${equipment.name}`);
        return true;
    },
    
    // Déséquiper un objet
    unequipItem(characterName, slot) {
        if (gameState.characterEquipment[characterName] && 
            gameState.characterEquipment[characterName][slot]) {
            
            const equipmentId = gameState.characterEquipment[characterName][slot];
            const equipment = this.getEquipmentById(equipmentId);
            
            delete gameState.characterEquipment[characterName][slot];
            
            console.log(`❌ ${characterName} a déséquipé ${equipment ? equipment.name : equipmentId}`);
            return true;
        }
        return false;
    },
    
    // Calculer les stats totales d'un personnage avec équipement
    calculateCharacterStats(characterName) {
        const character = findCharacterByName(characterName);
        if (!character) return { attack: 0, defense: 0, speed: 0, magic: 0 };
        
        // Stats de base du personnage
        const baseStats = { ...character.stats };
        
        // Ajouter les bonus d'équipement
        const equipment = gameState.characterEquipment[characterName] || {};
        
        Object.values(equipment).forEach(equipmentId => {
            const item = this.getEquipmentById(equipmentId);
            if (item && item.stats) {
                baseStats.attack += item.stats.attack || 0;
                baseStats.defense += item.stats.defense || 0;
                baseStats.speed += item.stats.speed || 0;
                baseStats.magic += item.stats.magic || 0;
            }
        });
        
        // S'assurer que les stats ne descendent pas en dessous de 1
        Object.keys(baseStats).forEach(stat => {
            baseStats[stat] = Math.max(1, baseStats[stat]);
        });
        
        return baseStats;
    },
    
    // Calculer la puissance totale d'un personnage équipé
    calculateCharacterPower(characterName) {
        const stats = this.calculateCharacterStats(characterName);
        return stats.attack + stats.defense + stats.speed + stats.magic;
    },
    
    // Générer un drop d'équipement aléatoire
    generateRandomDrop(zoneKey) {
        const zone = GAME_CONFIG.COMBAT.ZONES[zoneKey];
        if (!zone) return null;
        
        // Taux de drop basé sur la difficulté de la zone
        const dropChance = this.calculateDropChance(zone);
        
        if (Math.random() > dropChance) {
            return null; // Pas de drop
        }
        
        // Déterminer la rareté du drop
        const rarity = this.determineDropRarity(zone);
        
        // Sélectionner un équipement aléatoire de cette rareté
        const availableEquipment = this.getAllEquipment().filter(item => item.rarity === rarity);
        
        if (availableEquipment.length === 0) return null;
        
        const droppedItem = availableEquipment[Math.floor(Math.random() * availableEquipment.length)];
        
        console.log(`📦 Drop: ${droppedItem.name} (${droppedItem.rarity})`);
        return droppedItem;
    },
    
    // Calculer le taux de drop selon la zone
    calculateDropChance(zone) {
        // Taux de base : 20-30% selon la difficulté
        if (zone.maxPower <= 500) return 0.15;      // Zones faciles: 15%
        if (zone.maxPower <= 1500) return 0.20;     // Zones moyennes: 20%
        if (zone.maxPower <= 3000) return 0.25;     // Zones difficiles: 25%
        return 0.30;                                 // Zones extrêmes: 30%
    },
    
    // Déterminer la rareté du drop
    determineDropRarity(zone) {
        let rarityRates;
        
        // Taux de rareté selon la difficulté de la zone
        if (zone.maxPower <= 500) {
            // Zones faciles: beaucoup de commun
            rarityRates = { common: 0.70, rare: 0.25, epic: 0.05, legendary: 0.00 };
        } else if (zone.maxPower <= 1500) {
            // Zones moyennes: plus de rare
            rarityRates = { common: 0.50, rare: 0.35, epic: 0.14, legendary: 0.01 };
        } else if (zone.maxPower <= 3000) {
            // Zones difficiles: épique possible
            rarityRates = { common: 0.30, rare: 0.40, epic: 0.25, legendary: 0.05 };
        } else {
            // Zones extrêmes: légendaire possible
            rarityRates = { common: 0.15, rare: 0.35, epic: 0.35, legendary: 0.15 };
        }
        
        const rand = Math.random();
        let cumulative = 0;
        
        for (const [rarity, rate] of Object.entries(rarityRates)) {
            cumulative += rate;
            if (rand <= cumulative) {
                return rarity;
            }
        }
        
        return 'common'; // Fallback
    },
    
    // Obtenir les équipements par rareté
    getEquipmentByRarity(rarity) {
        return this.getAllEquipment().filter(item => item.rarity === rarity);
    },
    
    // Obtenir les statistiques de l'inventaire d'équipement
    getEquipmentStats() {
        // Cette fonction sera utile plus tard pour l'inventaire
        const allEquipment = this.getAllEquipment();
        const stats = {
            total: allEquipment.length,
            byType: {},
            byRarity: {}
        };
        
        allEquipment.forEach(item => {
            // Par type
            stats.byType[item.type] = (stats.byType[item.type] || 0) + 1;
            
            // Par rareté
            stats.byRarity[item.rarity] = (stats.byRarity[item.rarity] || 0) + 1;
        });
        
        return stats;
    }
};

console.log('⚔️ Module EquipmentSystem chargé');