// ===== LOOT SYSTEM =====

// Loot Tables pour chaque mission
const lootTables = {
    // ===== ELWYNN FOREST =====
    "elwynn_0": [ // Kobold Menace
        { itemId: "linen_cloth", dropChance: 70, minQuantity: 1, maxQuantity: 3 },
        { itemId: "rough_stone", dropChance: 40, minQuantity: 1, maxQuantity: 2 },
        { itemId: "copper_ore", dropChance: 20, minQuantity: 1, maxQuantity: 1 },
        { itemId: "bread", dropChance: 30, minQuantity: 1, maxQuantity: 2 }
    ],
    
    "elwynn_1": [ // Wolf Pack Hunt  
        { itemId: "leather_scraps", dropChance: 60, minQuantity: 1, maxQuantity: 3 },
        { itemId: "linen_cloth", dropChance: 45, minQuantity: 1, maxQuantity: 2 },
        { itemId: "minor_potion", dropChance: 25, minQuantity: 1, maxQuantity: 1 },
        { itemId: "rough_stone", dropChance: 30, minQuantity: 1, maxQuantity: 1 }
    ],
    
    "elwynn_2": [ // Bandit Hideout
        { itemId: "linen_cloth", dropChance: 80, minQuantity: 2, maxQuantity: 4 },
        { itemId: "leather_scraps", dropChance: 50, minQuantity: 1, maxQuantity: 3 },
        { itemId: "iron_sword", dropChance: 15, minQuantity: 1, maxQuantity: 1 },
        { itemId: "bread", dropChance: 60, minQuantity: 1, maxQuantity: 3 },
        { itemId: "minor_potion", dropChance: 35, minQuantity: 1, maxQuantity: 2 }
    ],
    
    "elwynn_3": [ // Murloc Investigation
        { itemId: "rough_stone", dropChance: 55, minQuantity: 2, maxQuantity: 4 },
        { itemId: "linen_cloth", dropChance: 40, minQuantity: 1, maxQuantity: 2 },
        { itemId: "leather_boots", dropChance: 12, minQuantity: 1, maxQuantity: 1 },
        { itemId: "minor_potion", dropChance: 30, minQuantity: 1, maxQuantity: 1 }
    ],
    
    "elwynn_4": [ // Rare Herb Collection
        { itemId: "minor_potion", dropChance: 90, minQuantity: 2, maxQuantity: 4 },
        { itemId: "strength_elixir", dropChance: 40, minQuantity: 1, maxQuantity: 2 },
        { itemId: "linen_cloth", dropChance: 50, minQuantity: 1, maxQuantity: 2 },
        { itemId: "bread", dropChance: 70, minQuantity: 2, maxQuantity: 4 }
    ],
    
    "elwynn_5": [ // Elite: Hogger Hunt
        { itemId: "iron_sword", dropChance: 35, minQuantity: 1, maxQuantity: 1 },
        { itemId: "chainmail_vest", dropChance: 20, minQuantity: 1, maxQuantity: 1 },
        { itemId: "leather_scraps", dropChance: 80, minQuantity: 3, maxQuantity: 6 },
        { itemId: "minor_potion", dropChance: 60, minQuantity: 2, maxQuantity: 4 },
        { itemId: "strength_elixir", dropChance: 45, minQuantity: 1, maxQuantity: 2 }
    ],
    
    "elwynn_6": [ // Ancient Ruins Exploration
        { itemId: "rough_stone", dropChance: 75, minQuantity: 3, maxQuantity: 5 },
        { itemId: "copper_ore", dropChance: 60, minQuantity: 2, maxQuantity: 4 },
        { itemId: "iron_sword", dropChance: 25, minQuantity: 1, maxQuantity: 1 },
        { itemId: "minor_potion", dropChance: 40, minQuantity: 1, maxQuantity: 2 }
    ],
    
    // ===== WESTFALL (Better loot, higher quantities) =====
    "westfall_0": [ // Stray Defias
        { itemId: "linen_cloth", dropChance: 60, minQuantity: 2, maxQuantity: 4 },
        { itemId: "leather_scraps", dropChance: 45, minQuantity: 1, maxQuantity: 3 },
        { itemId: "bread", dropChance: 40, minQuantity: 1, maxQuantity: 2 },
        { itemId: "copper_ore", dropChance: 25, minQuantity: 1, maxQuantity: 2 }
    ],
    
    "westfall_1": [ // Wild Boar Problem
        { itemId: "leather_scraps", dropChance: 75, minQuantity: 2, maxQuantity: 5 },
        { itemId: "linen_cloth", dropChance: 50, minQuantity: 1, maxQuantity: 3 },
        { itemId: "minor_potion", dropChance: 35, minQuantity: 1, maxQuantity: 2 },
        { itemId: "bread", dropChance: 60, minQuantity: 2, maxQuantity: 4 }
    ],
    
    "westfall_2": [ // Defias Scout Patrol
        { itemId: "linen_cloth", dropChance: 70, minQuantity: 3, maxQuantity: 5 },
        { itemId: "leather_scraps", dropChance: 55, minQuantity: 2, maxQuantity: 4 },
        { itemId: "iron_sword", dropChance: 20, minQuantity: 1, maxQuantity: 1 },
        { itemId: "minor_potion", dropChance: 45, minQuantity: 1, maxQuantity: 3 }
    ],
    
    "westfall_3": [ // Abandoned Farmstead
        { itemId: "bread", dropChance: 85, minQuantity: 3, maxQuantity: 6 },
        { itemId: "linen_cloth", dropChance: 60, minQuantity: 2, maxQuantity: 4 },
        { itemId: "leather_boots", dropChance: 18, minQuantity: 1, maxQuantity: 1 },
        { itemId: "minor_potion", dropChance: 40, minQuantity: 1, maxQuantity: 2 }
    ],
    
    "westfall_4": [ // Mine Entrance Patrol
        { itemId: "copper_ore", dropChance: 80, minQuantity: 3, maxQuantity: 6 },
        { itemId: "rough_stone", dropChance: 70, minQuantity: 2, maxQuantity: 5 },
        { itemId: "iron_sword", dropChance: 15, minQuantity: 1, maxQuantity: 1 },
        { itemId: "linen_cloth", dropChance: 45, minQuantity: 1, maxQuantity: 3 }
    ],
    
    "westfall_5": [ // Defias Encampment
        { itemId: "linen_cloth", dropChance: 80, minQuantity: 3, maxQuantity: 6 },
        { itemId: "leather_scraps", dropChance: 65, minQuantity: 2, maxQuantity: 5 },
        { itemId: "chainmail_vest", dropChance: 12, minQuantity: 1, maxQuantity: 1 },
        { itemId: "minor_potion", dropChance: 50, minQuantity: 2, maxQuantity: 3 },
        { itemId: "strength_elixir", dropChance: 30, minQuantity: 1, maxQuantity: 2 }
    ],
    
    "westfall_6": [ // Harvest Watcher Hunt
        { itemId: "copper_ore", dropChance: 75, minQuantity: 4, maxQuantity: 7 },
        { itemId: "iron_sword", dropChance: 25, minQuantity: 1, maxQuantity: 1 },
        { itemId: "chainmail_vest", dropChance: 15, minQuantity: 1, maxQuantity: 1 },
        { itemId: "rough_stone", dropChance: 60, minQuantity: 3, maxQuantity: 5 }
    ],
    
    "westfall_7": [ // Murloc Coast Raid
        { itemId: "leather_scraps", dropChance: 70, minQuantity: 3, maxQuantity: 6 },
        { itemId: "minor_potion", dropChance: 55, minQuantity: 2, maxQuantity: 4 },
        { itemId: "leather_boots", dropChance: 20, minQuantity: 1, maxQuantity: 1 },
        { itemId: "rough_stone", dropChance: 50, minQuantity: 2, maxQuantity: 4 }
    ],
    
    "westfall_8": [ // Defias Messenger
        { itemId: "linen_cloth", dropChance: 85, minQuantity: 4, maxQuantity: 7 },
        { itemId: "iron_sword", dropChance: 30, minQuantity: 1, maxQuantity: 1 },
        { itemId: "strength_elixir", dropChance: 40, minQuantity: 1, maxQuantity: 3 },
        { itemId: "minor_potion", dropChance: 60, minQuantity: 2, maxQuantity: 4 }
    ],
    
    "westfall_9": [ // Deep Mine Exploration
        { itemId: "copper_ore", dropChance: 90, minQuantity: 5, maxQuantity: 8 },
        { itemId: "rough_stone", dropChance: 80, minQuantity: 4, maxQuantity: 7 },
        { itemId: "iron_sword", dropChance: 20, minQuantity: 1, maxQuantity: 1 },
        { itemId: "chainmail_vest", dropChance: 18, minQuantity: 1, maxQuantity: 1 }
    ],
    
    "westfall_10": [ // Defias Lieutenant
        { itemId: "iron_sword", dropChance: 40, minQuantity: 1, maxQuantity: 2 },
        { itemId: "chainmail_vest", dropChance: 25, minQuantity: 1, maxQuantity: 1 },
        { itemId: "leather_scraps", dropChance: 75, minQuantity: 4, maxQuantity: 8 },
        { itemId: "strength_elixir", dropChance: 50, minQuantity: 2, maxQuantity: 4 },
        { itemId: "minor_potion", dropChance: 70, minQuantity: 3, maxQuantity: 5 }
    ],
    
    "westfall_11": [ // The Jangolode Mine
        { itemId: "copper_ore", dropChance: 95, minQuantity: 6, maxQuantity: 10 },
        { itemId: "rough_stone", dropChance: 85, minQuantity: 5, maxQuantity: 8 },
        { itemId: "iron_sword", dropChance: 35, minQuantity: 1, maxQuantity: 2 },
        { itemId: "chainmail_vest", dropChance: 20, minQuantity: 1, maxQuantity: 1 }
    ],
    
    "westfall_12": [ // Defias Captain Raid
        { itemId: "iron_sword", dropChance: 50, minQuantity: 1, maxQuantity: 2 },
        { itemId: "chainmail_vest", dropChance: 35, minQuantity: 1, maxQuantity: 1 },
        { itemId: "leather_boots", dropChance: 30, minQuantity: 1, maxQuantity: 1 },
        { itemId: "strength_elixir", dropChance: 60, minQuantity: 2, maxQuantity: 4 },
        { itemId: "linen_cloth", dropChance: 80, minQuantity: 5, maxQuantity: 9 }
    ],
    
    "westfall_13": [ // Deadmines Entrance
        { itemId: "iron_sword", dropChance: 45, minQuantity: 1, maxQuantity: 2 },
        { itemId: "chainmail_vest", dropChance: 30, minQuantity: 1, maxQuantity: 1 },
        { itemId: "copper_ore", dropChance: 80, minQuantity: 4, maxQuantity: 7 },
        { itemId: "strength_elixir", dropChance: 55, minQuantity: 2, maxQuantity: 3 },
        { itemId: "minor_potion", dropChance: 70, minQuantity: 3, maxQuantity: 5 }
    ],
    
    "westfall_14": [ // The Deadmines (EPIC LOOT!)
        { itemId: "iron_sword", dropChance: 80, minQuantity: 2, maxQuantity: 3 },
        { itemId: "chainmail_vest", dropChance: 60, minQuantity: 1, maxQuantity: 2 },
        { itemId: "leather_boots", dropChance: 50, minQuantity: 1, maxQuantity: 2 },
        { itemId: "strength_elixir", dropChance: 90, minQuantity: 3, maxQuantity: 6 },
        { itemId: "copper_ore", dropChance: 100, minQuantity: 8, maxQuantity: 12 },
        { itemId: "minor_potion", dropChance: 85, minQuantity: 4, maxQuantity: 7 }
    ]
};

// Fonction pour calculer les loots d'une mission
function calculateMissionLoot(mapIndex, missionIndex, missionSuccess = true) {
    const lootKey = `${mapIndex === 0 ? 'elwynn' : 'westfall'}_${missionIndex}`;
    const lootTable = lootTables[lootKey];
    
    if (!lootTable) {
        console.warn(`No loot table found for ${lootKey}`);
        return [];
    }
    
    const lootReceived = [];
    
    // Pour chaque item possible dans la table
    lootTable.forEach(lootEntry => {
        let dropChance = lootEntry.dropChance;
        
        // Réduire les chances si mission échouée
        if (!missionSuccess) {
            dropChance = Math.floor(dropChance * 0.3); // 30% des chances normales
        }
        
        // Roll pour voir si l'item drop
        if (Math.random() * 100 < dropChance) {
            // Calculer la quantité aléatoire
            const quantity = Math.floor(
                Math.random() * (lootEntry.maxQuantity - lootEntry.minQuantity + 1)
            ) + lootEntry.minQuantity;
            
            // Réduire la quantité si mission échouée
            const finalQuantity = missionSuccess ? quantity : Math.max(1, Math.floor(quantity * 0.5));
            
            lootReceived.push({
                itemId: lootEntry.itemId,
                quantity: finalQuantity,
                name: itemDatabase[lootEntry.itemId]?.name || lootEntry.itemId
            });
        }
    });
    
    return lootReceived;
}

// Fonction pour ajouter les loots à l'inventaire
function addLootToInventory(lootArray) {
    const addedItems = [];
    const failedItems = [];
    
    lootArray.forEach(loot => {
        const success = addItemToInventory(loot.itemId, loot.quantity);
        if (success) {
            addedItems.push(loot);
        } else {
            failedItems.push(loot);
        }
    });
    
    return { addedItems, failedItems };
}

// Fonction pour formater l'affichage des loots
function formatLootDisplay(lootArray) {
    if (lootArray.length === 0) {
        return "No items obtained";
    }
    
    return lootArray.map(loot => 
        `+${loot.quantity} ${loot.name}`
    ).join(', ');
}

// Fonction pour obtenir un aperçu des loots possibles d'une mission (pour l'UI future)
function getMissionLootPreview(mapIndex, missionIndex) {
    const lootKey = `${mapIndex === 0 ? 'elwynn' : 'westfall'}_${missionIndex}`;
    const lootTable = lootTables[lootKey];
    
    if (!lootTable) return [];
    
    return lootTable.map(entry => ({
        itemName: itemDatabase[entry.itemId]?.name || entry.itemId,
        dropChance: entry.dropChance,
        quantity: `${entry.minQuantity}-${entry.maxQuantity}`,
        type: itemDatabase[entry.itemId]?.type || "unknown"
    }));
}