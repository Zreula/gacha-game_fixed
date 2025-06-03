// Base de données des personnages
const CHARACTERS_DB = [
    // Personnage de départ
    { 
        name: "George le Noob", 
        rarity: "common", 
        emoji: "🤓",
        stats: { attack: 30, defense: 25, speed: 28, magic: 28 },
        element: "Neutre", 
        type: "Débutant", 
        description: "Le héros débutant qui commence son aventure. Faible mais plein de potentiel !" 
    },
    
    // Légendaires (5%)
    { 
        name: "Drakon le Destructeur", 
        rarity: "legendary", 
        emoji: "🐉", 
        stats: { attack: 95, defense: 80, speed: 70, magic: 90 },
        element: "Feu", 
        type: "Dragon", 
        description: "Le dragon légendaire qui détruit tout sur son passage. Sa rage brûlante consume ses ennemis." 
    },
    { 
        name: "Seraphina l'Ange", 
        rarity: "legendary", 
        emoji: "👼",
        stats: { attack: 75, defense: 85, speed: 90, magic: 95 },
        element: "Lumière", 
        type: "Céleste", 
        description: "Un ange gardien aux pouvoirs divins. Sa lumière purificatrice soigne les alliés et aveugle les ennemis." 
    },
    { 
        name: "Merlin l'Archimage", 
        rarity: "legendary", 
        emoji: "🧙‍♂️",
        stats: { attack: 60, defense: 70, speed: 80, magic: 100 },
        element: "Arcane", 
        type: "Mage", 
        description: "Le plus grand magicien de tous les temps. Maîtrise tous les sorts et secrets de la magie ancienne." 
    },
    { 
        name: "Athena la Guerrière", 
        rarity: "legendary", 
        emoji: "⚔️",
        stats: { attack: 90, defense: 95, speed: 85, magic: 65 },
        element: "Terre", 
        type: "Guerrier", 
        description: "Déesse de la guerre et de la stratégie. Invincible au combat, elle mène ses troupes à la victoire." 
    },
    { 
        name: "Phoenix le Renaissant", 
        rarity: "legendary", 
        emoji: "🔥",
        stats: { attack: 85, defense: 60, speed: 95, magic: 85 },
        element: "Feu", 
        type: "Mystique", 
        description: "L'oiseau immortel qui renaît de ses cendres. Chaque mort le rend plus puissant." 
    },
    
    // Épiques (15%)
    { 
        name: "Gandor le Chevalier", 
        rarity: "epic", 
        emoji: "🛡️",
        stats: { attack: 75, defense: 85, speed: 60, magic: 45 },
        element: "Lumière", 
        type: "Paladin", 
        description: "Noble chevalier protecteur des innocents. Son bouclier sacré repousse le mal." 
    },
    { 
        name: "Luna la Sorcière", 
        rarity: "epic", 
        emoji: "🌙",
        stats: { attack: 55, defense: 60, speed: 70, magic: 80 },
        element: "Ombre", 
        type: "Sorcière", 
        description: "Maîtresse de la magie lunaire. Ses sorts s'amplifient sous la pleine lune." 
    },
    { 
        name: "Thor le Tonnerre", 
        rarity: "epic", 
        emoji: "⚡",
        stats: { attack: 80, defense: 70, speed: 75, magic: 60 },
        element: "Foudre", 
        type: "Dieu", 
        description: "Dieu du tonnerre brandissant son marteau légendaire. Ses éclairs fendent le ciel." 
    },
    { 
        name: "Iris l'Archère", 
        rarity: "epic", 
        emoji: "🏹",
        stats: { attack: 70, defense: 50, speed: 85, magic: 55 },
        element: "Vent", 
        type: "Ranger", 
        description: "Archère légendaire qui ne rate jamais sa cible. Ses flèches percent l'âme." 
    },
    { 
        name: "Blade l'Assassin", 
        rarity: "epic", 
        emoji: "🗡️",
        stats: { attack: 85, defense: 45, speed: 90, magic: 40 },
        element: "Ombre", 
        type: "Assassin", 
        description: "Tueur silencieux des ténèbres. Frappe vite et disparaît sans laisser de trace." 
    },
    { 
        name: "Frost le Mage", 
        rarity: "epic", 
        emoji: "❄️",
        stats: { attack: 50, defense: 65, speed: 60, magic: 85 },
        element: "Glace", 
        type: "Mage", 
        description: "Maître des glaces éternelles. Ses sorts figent le temps et l'espace." 
    },
    { 
        name: "Ruby la Prêtresse", 
        rarity: "epic", 
        emoji: "💎",
        stats: { attack: 45, defense: 75, speed: 55, magic: 80 },
        element: "Lumière", 
        type: "Clerc", 
        description: "Prêtresse aux pouvoirs de guérison divins. Son cristal rouge amplifie sa magie." 
    },
    { 
        name: "Venom l'Empoisonneur", 
        rarity: "epic", 
        emoji: "🐍",
        stats: { attack: 65, defense: 55, speed: 75, magic: 70 },
        element: "Poison", 
        type: "Alchimiste", 
        description: "Maître des toxines mortelles. Ses poisons s'infiltrent partout." 
    },
    { 
        name: "Storm la Tempête", 
        rarity: "epic", 
        emoji: "🌪️",
        stats: { attack: 70, defense: 60, speed: 80, magic: 75 },
        element: "Vent", 
        type: "Élémentaire", 
        description: "Incarnation de la tempête. Ses vents destructeurs balaient tout." 
    },
    { 
        name: "Sage l'Érudit", 
        rarity: "epic", 
        emoji: "📚",
        stats: { attack: 40, defense: 70, speed: 50, magic: 90 },
        element: "Arcane", 
        type: "Savant", 
        description: "Détenteur de tous les savoirs anciens. Sa connaissance est son arme." 
    },
    
    // Rares (30%) - Exemples détaillés
    { 
        name: "Marcus le Soldat", 
        rarity: "rare", 
        emoji: "👨‍💼",
        stats: { attack: 65, defense: 70, speed: 55, magic: 30 },
        element: "Neutre", 
        type: "Soldat", 
        description: "Vétéran de nombreuses batailles. Sa discipline et son courage inspirent ses alliés." 
    },
    { 
        name: "Elena la Guérisseuse", 
        rarity: "rare", 
        emoji: "🩺",
        stats: { attack: 35, defense: 60, speed: 50, magic: 75 },
        element: "Lumière", 
        type: "Soigneur", 
        description: "Médecin aux mains bénies. Ses soins redonnent espoir aux plus désespérés." 
    },
    { 
        name: "Rex le Berserker", 
        rarity: "rare", 
        emoji: "🪓",
        stats: { attack: 80, defense: 45, speed: 65, magic: 25 },
        element: "Feu", 
        type: "Berserker", 
        description: "Guerrier sauvage à la rage incontrôlable. Plus il est blessé, plus il devient fort." 
    },
    { 
        name: "Ivy la Druidesse", 
        rarity: "rare", 
        emoji: "🌿",
        stats: { attack: 50, defense: 65, speed: 60, magic: 70 },
        element: "Nature", 
        type: "Druide", 
        description: "Gardienne de la forêt ancestrale. Commande aux plantes et aux animaux." 
    },
    { 
        name: "Dante l'Aventurier", 
        rarity: "rare", 
        emoji: "🎒",
        stats: { attack: 60, defense: 55, speed: 70, magic: 50 },
        element: "Neutre", 
        type: "Explorateur", 
        description: "Aventurier intrépide parcourant le monde. Chaque voyage lui apporte de nouvelles compétences." 
    },
    
    // Communs (50%) - Exemples détaillés
    { 
        name: "Tom l'Apprenti", 
        rarity: "common", 
        emoji: "👨‍🎓",
        stats: { attack: 30, defense: 35, speed: 40, magic: 45 },
        element: "Neutre", 
        type: "Apprenti", 
        description: "Jeune apprenti plein d'espoir. Ses capacités limitées cachent un potentiel immense." 
    },
    { 
        name: "Anna la Marchande", 
        rarity: "common", 
        emoji: "👩‍💼",
        stats: { attack: 25, defense: 40, speed: 50, magic: 35 },
        element: "Neutre", 
        type: "Marchand", 
        description: "Commerçante astucieuse aux multiples contacts. Sait toujours où trouver ce qu'il faut." 
    },
    { 
        name: "Bob le Fermier", 
        rarity: "common", 
        emoji: "👨‍🌾",
        stats: { attack: 40, defense: 50, speed: 30, magic: 20 },
        element: "Terre", 
        type: "Fermier", 
        description: "Fermier robuste habitué au dur labeur. Sa force vient de années de travail aux champs." 
    },
    { 
        name: "Lisa la Cuisinière", 
        rarity: "common", 
        emoji: "👩‍🍳",
        stats: { attack: 35, defense: 45, speed: 40, magic: 30 },
        element: "Feu", 
        type: "Cuisinier", 
        description: "Chef talentueuse aux plats revigorants. Ses repas redonnent force et moral aux aventuriers." 
    },
    { 
        name: "Max le Garde", 
        rarity: "common", 
        emoji: "💂‍♂️",
        stats: { attack: 50, defense: 60, speed: 35, magic: 25 },
        element: "Neutre", 
        type: "Garde", 
        description: "Garde loyal et discipliné. Protège fidèlement son poste contre vents et marées." 
    }
];

// Générer automatiquement les personnages restants
function generateRemainingCharacters() {
    const remainingNames = [
        // Rares restants
        "Zara la Danseuse", "Kai le Moine", "Nora l'Espionne", "Leo le Barde", 
        "Maya l'Alchimiste", "Jin le Samouraï", "Cora la Pirate", "Finn le Pêcheur", 
        "Lila la Voyante", "Owen le Forgeron",
        
        // Communs restants
        "Rose la Fleuriste", "Paul le Mineur", "Eva l'Herboriste", "Sam le Messager", 
        "Mia la Tisserande", "Joe le Bucheron", "Amy la Bibliothécaire", "Ben le Porteur", 
        "Sue la Blanchisseuse", "Dan le Balayeur", "Joy la Danseuse", "Roy le Gardien", 
        "Fay la Conteuse", "Guy le Palefrenier", "Liv la Chanteuse", "Art le Peintre", 
        "Sky le Messager", "Dot la Couturière", "Ray le Chasseur", "May la Jardinière", 
        "Jay le Musicien", "Kay la Serveuse", "Wil le Réparateur", "Bea l'Apicultrice", 
        "Ian le Scribe", "Zoe la Fleuriste", "Tim le Berger", "Sal la Couturière",
        "Vic le Forgeron", "Uma la Tisserande", "Ned le Mineur", "Ora la Voyante",
        "Pat le Pêcheur", "Quin l'Archer", "Rex le Chasseur", "Sara la Barde",
        "Ted le Moine", "Val la Guerrière", "Wade l'Éclaireur", "Xara l'Espionne",
        "Yale le Savant", "Zara l'Enchanteresse", "Abel le Paladin", "Beth la Prêtresse",
        "Carl le Berserker", "Dana la Druide", "Earl le Chevalier", "Faye la Sorcière",
        "Glen le Ranger", "Hope l'Ange", "Ivan le Démon", "Jade l'Élémentaire",
        "Kent le Guerrier", "Luna la Magicienne", "Mark l'Assassin", "Nina la Voleuse",
        "Oscar le Barde", "Piper la Danseuse", "Quinn le Mage", "Ruby l'Alchimiste",
        "Sean le Soldat", "Tara la Guérisseuse", "Uri le Mystique", "Vera la Sage",
        "Will l'Aventurier", "Xena la Gladiatrice", "York le Gardien", "Zoe l'Exploratrice"
    ];
    
    const emojis = [
        "💃", "🥋", "🕵️‍♀️", "🎵", "⚗️", "⚔️", "🏴‍☠️", "🎣", "🔮", "🔨",
        "🌹", "⛏️", "🌱", "📨", "🧵", "🪵", "📖", "📦", "🧺", "🧹",
        "💃", "🛡️", "📜", "🐎", "🎤", "🎨", "🕊️", "✂️", "🏹", "🌻",
        "🎸", "🍽️", "🔧", "🐝", "✒️", "🌺", "🐑", "🪡", "⚒️", "🧶",
        "⛏️", "🔮", "🎣", "🏹", "🏹", "🎵", "🥋", "⚔️", "🗡️", "🕵️‍♀️",
        "📚", "✨", "🛡️", "🙏", "🪓", "🌿", "⚔️", "🌙", "🏹", "👼",
        "😈", "🌊", "⚔️", "🔮", "🗡️", "🦹‍♀️", "🎵", "💃", "🧙‍♂️", "⚗️",
        "👨‍💼", "🩺", "🔮", "📚", "🎒", "🏛️", "🛡️", "🌍"
    ];
    
    let charIndex = CHARACTERS_DB.length;
    
    remainingNames.forEach((name, index) => {
        // Déterminer la rareté
        let rarity;
        if (charIndex < 15) rarity = 'rare';      // Compléter les rares
        else rarity = 'common';                   // Le reste en commun
        
        const character = {
            name: name,
            rarity: rarity,
            emoji: emojis[index] || "👤",
            stats: generateRandomStats(rarity),
            element: GAME_CONFIG.GAME_DATA.ELEMENTS[Math.floor(Math.random() * GAME_CONFIG.GAME_DATA.ELEMENTS.length)],
            type: GAME_CONFIG.GAME_DATA.TYPES[Math.floor(Math.random() * GAME_CONFIG.GAME_DATA.TYPES.length)],
            description: `Un ${GAME_CONFIG.GAME_DATA.TYPES[Math.floor(Math.random() * GAME_CONFIG.GAME_DATA.TYPES.length)].toLowerCase()} ${rarity === 'rare' ? 'rare' : 'commun'} spécialisé dans l'élément ${GAME_CONFIG.GAME_DATA.ELEMENTS[Math.floor(Math.random() * GAME_CONFIG.GAME_DATA.ELEMENTS.length)]}.`
        };
        
        CHARACTERS_DB.push(character);
        charIndex++;
    });
}

// Fonction pour générer des stats aléatoires selon la rareté
function generateRandomStats(rarity) {
    const range = GAME_CONFIG.GAME_DATA.STAT_RANGES[rarity];
    return {
        attack: Math.floor(Math.random() * (range.max - range.min + 1)) + range.min,
        defense: Math.floor(Math.random() * (range.max - range.min + 1)) + range.min,
        speed: Math.floor(Math.random() * (range.max - range.min + 1)) + range.min,
        magic: Math.floor(Math.random() * (range.max - range.min + 1)) + range.min
    };
}

// Générer les personnages restants au chargement
generateRemainingCharacters();

// Fonction utilitaire pour trouver un personnage
function findCharacterByName(name) {
    return CHARACTERS_DB.find(char => char.name === name);
}

// Fonction utilitaire pour obtenir les personnages par rareté
function getCharactersByRarity(rarity) {
    return CHARACTERS_DB.filter(char => char.rarity === rarity);
}

// Fonction utilitaire pour obtenir un personnage aléatoire par rareté
function getRandomCharacterByRarity(rarity, excludeNames = []) {
    const chars = CHARACTERS_DB.filter(char => 
        char.rarity === rarity && 
        !excludeNames.includes(char.name)
    );
    return chars[Math.floor(Math.random() * chars.length)];
}

console.log(`📊 Base de données chargée: ${CHARACTERS_DB.length} personnages`);