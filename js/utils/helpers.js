// Fonctions utilitaires globales
const GameHelpers = {
    
    // Utilitaires mathématiques
    math: {
        // Générer un nombre aléatoire entre min et max (inclus)
        randomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        
        // Générer un nombre aléatoire avec distribution normale
        randomNormal(mean = 0, stdDev = 1) {
            let u = 0, v = 0;
            while (u === 0) u = Math.random(); // Éviter 0
            while (v === 0) v = Math.random();
            
            const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
            return z * stdDev + mean;
        },
        
        // Arrondir à n décimales
        round(value, decimals = 2) {
            return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
        },
        
        // Clamp une valeur entre min et max
        clamp(value, min, max) {
            return Math.min(Math.max(value, min), max);
        },
        
        // Interpolation linéaire
        lerp(start, end, factor) {
            return start + (end - start) * factor;
        },
        
        // Calculer un pourcentage
        percentage(value, total) {
            return total === 0 ? 0 : (value / total) * 100;
        }
    },
    
    // Utilitaires de formatage
    format: {
        // Formater un nombre avec des séparateurs
        number(num) {
            return new Intl.NumberFormat('fr-FR').format(num);
        },
        
        // Formater une durée en secondes
        duration(seconds) {
            if (seconds < 60) {
                return `${seconds}s`;
            } else if (seconds < 3600) {
                const minutes = Math.floor(seconds / 60);
                const remainingSeconds = seconds % 60;
                return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
            } else {
                const hours = Math.floor(seconds / 3600);
                const minutes = Math.floor((seconds % 3600) / 60);
                return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
            }
        },
        
        // Formater une date
        date(timestamp) {
            return new Date(timestamp).toLocaleString('fr-FR');
        },
        
        // Formater une date relative
        relativeTime(timestamp) {
            const now = Date.now();
            const diff = now - timestamp;
            const seconds = Math.floor(diff / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);
            
            if (days > 0) return `il y a ${days} jour(s)`;
            if (hours > 0) return `il y a ${hours} heure(s)`;
            if (minutes > 0) return `il y a ${minutes} minute(s)`;
            return `il y a ${seconds} seconde(s)`;
        },
        
        // Formater la taille d'un fichier
        fileSize(bytes) {
            const sizes = ['octets', 'Ko', 'Mo', 'Go'];
            if (bytes === 0) return '0 octet';
            const i = Math.floor(Math.log(bytes) / Math.log(1024));
            return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
        }
    },
    
    // Utilitaires de validation
    validate: {
        // Vérifier si une valeur est un nombre valide
        isNumber(value) {
            return typeof value === 'number' && !isNaN(value) && isFinite(value);
        },
        
        // Vérifier si une chaîne est vide ou contient seulement des espaces
        isEmptyString(str) {
            return typeof str !== 'string' || str.trim().length === 0;
        },
        
        // Vérifier si un objet est vide
        isEmptyObject(obj) {
            return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
        },
        
        // Vérifier si une valeur est dans une plage
        inRange(value, min, max) {
            return this.isNumber(value) && value >= min && value <= max;
        },
        
        // Vérifier la structure d'une sauvegarde
        saveData(data) {
            if (!data || typeof data !== 'object') return false;
            
            const required = ['version', 'timestamp', 'gameState'];
            return required.every(field => data.hasOwnProperty(field));
        }
    },
    
    // Utilitaires de manipulation de données
    data: {
        // Cloner profondément un objet
        deepClone(obj) {
            if (obj === null || typeof obj !== 'object') return obj;
            if (obj instanceof Date) return new Date(obj.getTime());
            if (obj instanceof Array) return obj.map(item => this.deepClone(item));
            if (typeof obj === 'object') {
                const clonedObj = {};
                for (const key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        clonedObj[key] = this.deepClone(obj[key]);
                    }
                }
                return clonedObj;
            }
        },
        
        // Fusionner deux objets
        merge(target, source) {
            const result = { ...target };
            
            Object.keys(source).forEach(key => {
                if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                    result[key] = this.merge(result[key] || {}, source[key]);
                } else {
                    result[key] = source[key];
                }
            });
            
            return result;
        },
        
        // Grouper un tableau par une propriété
        groupBy(array, key) {
            return array.reduce((groups, item) => {
                const group = item[key];
                groups[group] = groups[group] || [];
                groups[group].push(item);
                return groups;
            }, {});
        },
        
        // Compter les occurrences dans un tableau
        countBy(array, key) {
            return array.reduce((counts, item) => {
                const value = typeof key === 'function' ? key(item) : item[key];
                counts[value] = (counts[value] || 0) + 1;
                return counts;
            }, {});
        },
        
        // Trier un tableau par plusieurs critères
        sortBy(array, ...criteria) {
            return array.sort((a, b) => {
                for (const criterion of criteria) {
                    let result = 0;
                    
                    if (typeof criterion === 'string') {
                        result = a[criterion] - b[criterion];
                    } else if (typeof criterion === 'function') {
                        result = criterion(a) - criterion(b);
                    }
                    
                    if (result !== 0) return result;
                }
                return 0;
            });
        }
    },
    
    // Utilitaires de performance
    performance: {
        // Débounce une fonction
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },
        
        // Throttle une fonction
        throttle(func, limit) {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },
        
        // Mesurer le temps d'exécution d'une fonction
        measureTime(func, name = 'Function') {
            const start = performance.now();
            const result = func();
            const end = performance.now();
            
            if (GAME_CONFIG.DEBUG.ENABLED) {
                console.log(`⏱️ ${name} executed in ${(end - start).toFixed(2)}ms`);
            }
            
            return result;
        },
        
        // Cache simple avec TTL
        createCache(ttl = 5000) {
            const cache = new Map();
            
            return {
                get(key) {
                    const item = cache.get(key);
                    if (!item) return null;
                    
                    if (Date.now() > item.expiry) {
                        cache.delete(key);
                        return null;
                    }
                    
                    return item.value;
                },
                
                set(key, value) {
                    cache.set(key, {
                        value,
                        expiry: Date.now() + ttl
                    });
                },
                
                clear() {
                    cache.clear();
                }
            };
        }
    },
    
    // Utilitaires spécifiques au jeu
    game: {
        // Calculer la puissance totale d'un personnage
        calculatePower(character) {
            if (!character || !character.stats) return 0;
            return character.stats.attack + character.stats.defense + 
                   character.stats.speed + character.stats.magic;
        },
        
        // Générer une couleur basée sur la rareté
        getRarityColor(rarity) {
            const colors = {
                common: '#95a5a6',
                rare: '#3498db',
                epic: '#9b59b6',
                legendary: '#f1c40f'
            };
            return colors[rarity] || colors.common;
        },
        
        // Obtenir l'emoji basé sur l'élément
        getElementEmoji(element) {
            const emojis = {
                'Feu': '🔥',
                'Eau': '💧',
                'Terre': '🌍',
                'Air': '💨',
                'Lumière': '✨',
                'Ombre': '🌑',
                'Foudre': '⚡',
                'Glace': '❄️',
                'Nature': '🌿',
                'Poison': '☠️',
                'Arcane': '🔮',
                'Neutre': '⚪'
            };
            return emojis[element] || '❓';
        },
        
        // Calculer l'efficacité d'un élément contre un autre
        getElementEffectiveness(attackElement, defendElement) {
            const effectiveness = {
                'Feu': { weak: ['Eau', 'Terre'], strong: ['Nature', 'Glace'] },
                'Eau': { weak: ['Foudre', 'Nature'], strong: ['Feu', 'Terre'] },
                'Terre': { weak: ['Eau', 'Nature'], strong: ['Foudre', 'Poison'] },
                'Nature': { weak: ['Feu', 'Poison'], strong: ['Eau', 'Terre'] },
                'Foudre': { weak: ['Terre'], strong: ['Eau', 'Air'] },
                'Lumière': { weak: ['Ombre'], strong: ['Ombre'] },
                'Ombre': { weak: ['Lumière'], strong: ['Lumière'] }
            };
            
            const element = effectiveness[attackElement];
            if (!element) return 1.0; // Neutre
            
            if (element.strong && element.strong.includes(defendElement)) return 1.5;
            if (element.weak && element.weak.includes(defendElement)) return 0.75;
            return 1.0;
        },
        
        // Générer des noms aléatoires pour les personnages
        generateRandomName() {
            const prefixes = ['Brave', 'Swift', 'Mighty', 'Silent', 'Golden', 'Dark', 'Light', 'Storm'];
            const names = ['Aria', 'Zeph', 'Luna', 'Rex', 'Nova', 'Kai', 'Zara', 'Orion'];
            const suffixes = ['walker', 'blade', 'heart', 'soul', 'fist', 'eye', 'wing', 'star'];
            
            const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
            const name = names[Math.floor(Math.random() * names.length)];
            const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
            
            return `${prefix} ${name}${Math.random() > 0.5 ? suffix : ''}`;
        }
    },
    
    // Utilitaires de debug
    debug: {
        // Logger avec couleurs
        log(message, type = 'info') {
            if (!GAME_CONFIG.DEBUG.ENABLED) return;
            
            const styles = {
                info: 'color: #3498db',
                success: 'color: #27ae60',
                warning: 'color: #f39c12',
                error: 'color: #e74c3c',
                debug: 'color: #9b59b6'
            };
            
            const emoji = {
                info: 'ℹ️',
                success: '✅',
                warning: '⚠️',
                error: '❌',
                debug: '🐛'
            };
            
            console.log(`%c${emoji[type]} ${message}`, styles[type]);
        },
        
        // Afficher l'état du jeu
        dumpGameState() {
            if (!GAME_CONFIG.DEBUG.ENABLED) return;
            
            console.group('🎮 État du jeu');
            console.log('Personnages possédés:', gameState.ownedCharacters.size);
            console.log('Personnages équipés:', gameState.equippedCharacters.size);
            console.log('Cristaux:', gameState.crystals);
            console.log('Or:', gameState.playerGold);
            console.log('Invocations totales:', gameState.totalSummons);
            console.log('Missions actives:', Object.keys(gameState.activeMissions));
            console.log('Missions idle:', Object.keys(gameState.idleMissions));
            console.groupEnd();
        },
        
        // Créer un profil de performance
        createProfiler() {
            const startTimes = new Map();
            
            return {
                start(label) {
                    startTimes.set(label, performance.now());
                },
                
                end(label) {
                    const startTime = startTimes.get(label);
                    if (startTime) {
                        const duration = performance.now() - startTime;
                        this.log(`${label}: ${duration.toFixed(2)}ms`, 'debug');
                        startTimes.delete(label);
                        return duration;
                    }
                    return 0;
                },
                
                log: this.log
            };
        }
    },
    
    // Utilitaires d'événements
    events: {
        // Créer un système d'événements simple
        createEventSystem() {
            const listeners = new Map();
            
            return {
                on(event, callback) {
                    if (!listeners.has(event)) {
                        listeners.set(event, []);
                    }
                    listeners.get(event).push(callback);
                },
                
                off(event, callback) {
                    if (listeners.has(event)) {
                        const callbacks = listeners.get(event);
                        const index = callbacks.indexOf(callback);
                        if (index > -1) {
                            callbacks.splice(index, 1);
                        }
                    }
                },
                
                emit(event, ...args) {
                    if (listeners.has(event)) {
                        listeners.get(event).forEach(callback => {
                            try {
                                callback(...args);
                            } catch (error) {
                                console.error(`Erreur dans l'événement ${event}:`, error);
                            }
                        });
                    }
                }
            };
        }
    }
};

// Exporter les utilitaires vers l'objet global pour faciliter l'accès
window.GameHelpers = GameHelpers;

console.log('🔧 Module GameHelpers chargé');