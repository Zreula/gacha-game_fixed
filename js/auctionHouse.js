export class AuctionHouse {
    constructor(gameState) {
        this.gameState = gameState;
        this.updateTimer = 0;
        this.updateInterval = 60; // Mise à jour des prix toutes les minutes
    }

    update(deltaTime) {
        this.updateTimer += deltaTime;
        
        if (this.updateTimer >= this.updateInterval) {
            this.updateTimer = 0;
            this.updateMarketPrices();
        }
    }

    updateMarketPrices() {
        for (const [item, priceData] of Object.entries(this.gameState.auctionHouse.marketPrices)) {
            // Variation aléatoire des prix (-10% à +10%)
            const variation = (Math.random() - 0.5) * 0.2;
            const newPrice = priceData.base * (1 + variation);
            
            // Garder les prix dans une fourchette raisonnable
            const minPrice = priceData.base * 0.5;
            const maxPrice = priceData.base * 2;
            
            priceData.current = Math.max(minPrice, Math.min(maxPrice, newPrice));
            priceData.trend = newPrice > priceData.current ? 1 : (newPrice < priceData.current ? -1 : 0);
        }
    }

    sellItem(itemName, amount, pricePerUnit) {
        // Vérifier si le joueur a assez d'objets
        let available = 0;
        let isResource = false;
        
        if (this.gameState.inventory.resources[itemName] !== undefined) {
            available = this.gameState.inventory.resources[itemName];
            isResource = true;
        } else if (this.gameState.inventory.crafted[itemName] !== undefined) {
            available = this.gameState.inventory.crafted[itemName];
            isResource = false;
        }
        
        if (available < amount) {
            return { success: false, reason: 'Pas assez d\'objets' };
        }
        
        // Calculer le total
        const totalPrice = amount * pricePerUnit;
        
        // Retirer les objets
        if (isResource) {
            this.gameState.removeResource(itemName, amount);
        } else {
            this.gameState.removeCraftedItem(itemName, amount);
        }
        
        // Ajouter l'or (avec commission de 5%)
        const commission = totalPrice * 0.05;
        const finalPrice = totalPrice - commission;
        this.gameState.addGold(finalPrice);
        
        return { 
            success: true, 
            totalPrice: finalPrice,
            commission: commission 
        };
    }

    quickSell(itemName, amount) {
        const marketPrice = this.gameState.auctionHouse.marketPrices[itemName];
        if (!marketPrice) return { success: false, reason: 'Prix de marché non disponible' };
        
        // Vendre au prix du marché (moins 10% pour vente rapide)
        const quickSellPrice = marketPrice.current * 0.9;
        return this.sellItem(itemName, amount, quickSellPrice);
    }

    getMarketPrice(itemName) {
        return this.gameState.auctionHouse.marketPrices[itemName] || null;
    }

    getRecommendedPrice(itemName) {
        const marketPrice = this.getMarketPrice(itemName);
        if (!marketPrice) return 0;
        
        // Prix recommandé légèrement au-dessus du marché
        return Math.ceil(marketPrice.current * 1.05);
    }
}