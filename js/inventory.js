const inventory = {
    render() {
        const container = document.getElementById('inventory-grid');
        container.innerHTML = '';
        const inv = game.player.inventory;
        if (Object.keys(inv).length === 0) {
            container.textContent = 'Inventory is empty.';
            return;
        }
        // Fusionne toutes les ressources pour retrouver leur icône
        const allResources = [
            ...(game.data.mining?.resources || []),
            ...(game.data.herbalism?.resources || []),
            ...(game.data.crafting?.resources || []),
            ...(game.data.smithing?.items || [])
        ];
        for (const [itemId, qty] of Object.entries(inv)) {
            const res = allResources.find(r => r.id === itemId);
            const icon = res?.icon ? `<span class="inventory-icon">${res.icon}</span>` : '';
            const name = res?.name || itemId;
            const div = document.createElement('div');
            div.className = 'inventory-item';
            div.innerHTML = `
                ${icon}
                <strong>${name}</strong>
                <span class="inventory-qty">x${qty}</span>
            `;
            container.appendChild(div);
        }
    }
};

document.addEventListener('game-ready', () => inventory.render());