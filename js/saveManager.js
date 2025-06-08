export class SaveManager {
    constructor(gameState) {
        this.gameState = gameState;
        this.saveKey = 'wow_idle_save';
        this.lastSaveTime = Date.now();
    }

    saveGame() {
        try {
            const saveData = {
                ...this.gameState.toJSON(),
                lastSaveTime: Date.now(),
                version: '1.0.0'
            };
            
            const jsonData = JSON.stringify(saveData);
            // Note: Dans un environnement réel, on utiliserait localStorage
            // Ici on simule juste la sauvegarde
            console.log('Jeu sauvegardé:', saveData);
            this.lastSaveTime = Date.now();
            return true;
        } catch (error) {
            console.error('Erreur de sauvegarde:', error);
            return false;
        }
    }

    loadGame() {
        try {
            // Note: Dans un environnement réel, on chargerait depuis localStorage
            // Ici on simule juste le chargement
            console.log('Tentative de chargement...');
            
            // Pour l'instant, on garde les valeurs par défaut
            return false;
        } catch (error) {
            console.error('Erreur de chargement:', error);
            return false;
        }
    }

    getOfflineTime() {
        const now = Date.now();
        const offlineTime = (now - this.lastSaveTime) / 1000;
        return Math.max(0, offlineTime);
    }

    exportSave() {
        const saveData = this.gameState.toJSON();
        const jsonString = JSON.stringify(saveData, null, 2);
        
        // Créer un blob et télécharger
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `wow_idle_save_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
    }

    importSave(jsonString) {
        try {
            const saveData = JSON.parse(jsonString);
            this.gameState.fromJSON(saveData);
            return true;
        } catch (error) {
            console.error('Erreur d\'import:', error);
            return false;
        }
    }
}