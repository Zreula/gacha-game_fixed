// ===== INVENTORY SYSTEM =====

function addItemToInventory(itemId, quantity = 1) {
    const itemData = itemDatabase[itemId];
    if (!itemData) {
        console.error(`Item ${itemId} not found in database`);
        return false;
    }
    
    // Check if item already exists in inventory
    const existingItem = gameState.inventory.items.find(item => item.id === itemId);
    
    if (existingItem) {
        // Stack with existing item
        const canAdd = Math.min(quantity, itemData.maxStack - existingItem.quantity);
        existingItem.quantity += canAdd;
        
        // If couldn't add all, create new stack
        if (canAdd < quantity) {
            const remaining = quantity - canAdd;
            return addItemToInventory(itemId, remaining);
        }
        return true;
    } else {
        // Check if we have inventory space
        if (gameState.inventory.items.length >= gameState.inventory.maxSlots) {
            console.log("Inventory full!");
            return false;
        }
        
        // Add new item
        const toAdd = Math.min(quantity, itemData.maxStack);
        gameState.inventory.items.push({
            id: itemId,
            quantity: toAdd
        });
        
        // If couldn't add all, try to add remaining
        if (toAdd < quantity) {
            return addItemToInventory(itemId, quantity - toAdd);
        }
        return true;
    }
}

function getInventoryItemsFiltered(filter = "all") {
    return gameState.inventory.items
        .map(item => ({
            ...item,
            ...itemDatabase[item.id]
        }))
        .filter(item => filter === "all" || item.type === filter)
        .sort((a, b) => {
            // Sort by type first, then by name
            if (a.type !== b.type) {
                const typeOrder = { "equipment": 0, "consumable": 1, "resource": 2 };
                return typeOrder[a.type] - typeOrder[b.type];
            }
            return a.name.localeCompare(b.name);
        });
}

function getInventorySlotsUsed() {
    return gameState.inventory.items.length;
}

function removeItemFromInventory(itemId, quantity = 1) {
    const itemIndex = gameState.inventory.items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) return false;
    
    const item = gameState.inventory.items[itemIndex];
    if (item.quantity <= quantity) {
        // Remove entire stack
        gameState.inventory.items.splice(itemIndex, 1);
    } else {
        // Reduce quantity
        item.quantity -= quantity;
    }
    return true;
}

function updateInventoryTab() {
    const inventoryTab = document.getElementById('inventory-tab');
    
    inventoryTab.innerHTML = `
        <div class="content-header">
            <h1>Inventory</h1>
        </div>
        <div class="content-section">
            <div class="card">
                <div class="card-header">
                    <div class="card-title">Items (${getInventorySlotsUsed()}/${gameState.inventory.maxSlots})</div>
                </div>
                
                <!-- Filter Tabs -->
                <div class="inventory-filters">
                    ${generateInventoryFilters()}
                </div>
                
                <!-- Items List -->
                <div class="inventory-content">
                    ${generateInventoryItems()}
                </div>
            </div>
        </div>
    `;
}

function generateInventoryFilters() {
    const filters = [
        { id: "all", name: "All Items", icon: "📦" },
        { id: "equipment", name: "Equipment", icon: "⚔️" },
        { id: "consumable", name: "Consumables", icon: "🧪" },
        { id: "resource", name: "Resources", icon: "🧵" }
    ];
    
    return `
        <div class="filter-tabs">
            ${filters.map(filter => `
                <button class="filter-tab ${gameState.inventory.currentFilter === filter.id ? 'active' : ''}"
                        onclick="setInventoryFilter('${filter.id}')">
                    ${filter.icon} ${filter.name}
                </button>
            `).join('')}
        </div>
    `;
}

function generateInventoryItems() {
    const filteredItems = getInventoryItemsFiltered(gameState.inventory.currentFilter);
    
    if (filteredItems.length === 0) {
        return `
            <div class="empty-inventory">
                <p style="text-align: center; color: #a0a0a0; padding: 40px;">
                    ${gameState.inventory.currentFilter === "all" 
                        ? "📦 Your inventory is empty" 
                        : `No ${gameState.inventory.currentFilter} items`}
                </p>
            </div>
        `;
    }
    
    return `
        <div class="inventory-list">
            ${filteredItems.map(item => `
                <div class="inventory-item">
                    <div class="item-info">
                        <div class="item-name">${getItemTypeIcon(item.type)} ${item.name}</div>
                        <div class="item-description">${item.description}</div>
                    </div>
                    <div class="item-quantity">
                        <span class="quantity">${item.quantity}/${item.maxStack}</span>
                        <span class="item-type">${item.type}</span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function getItemTypeIcon(type) {
    const icons = {
        "equipment": "⚔️",
        "consumable": "🧪", 
        "resource": "🧵"
    };
    return icons[type] || "📦";
}

function setInventoryFilter(filter) {
    gameState.inventory.currentFilter = filter;
    updateInventoryTab();
}