/**
 * Asset management system for the game
 * Singleton class to handle loading and storing all game assets
 */
class AssetManager {
    constructor() {
        if (AssetManager.instance) {
            return AssetManager.instance;
        }
        
        this.images = {};
        this.sounds = {};
        this.totalAssets = 0;
        this.loadedAssets = 0;
        this.onComplete = null;
        
        AssetManager.instance = this;
    }
    
    static getInstance() {
        if (!AssetManager.instance) {
            AssetManager.instance = new AssetManager();
        }
        return AssetManager.instance;
    }

    // Load an image asset
    loadImage(key, src) {
        this.totalAssets++;
        
        const img = new Image();
        
        img.onload = () => {
            console.log(`Loaded image: ${key}`);
            this.loadedAssets++;
            this._checkComplete();
        };
        
        img.onerror = (err) => {
            console.error(`Error loading image ${key} from ${src}`);
            this.loadedAssets++;
            this._checkComplete();
        };
        
        img.src = src;
        this.images[key] = img;
        return img;
    }
    
    getImage(key) {
        return this.images[key];
    }
    
    isImageReady(key) {
        return this.images[key] && this.images[key].complete;
    }
    
    onAllLoaded(callback) {
        this.onComplete = callback;
        this._checkComplete();
    }
    
    isLoaded() {
        return this.loadedAssets === this.totalAssets;
    }
    
    getProgress() {
        const progress = this.totalAssets > 0 ? this.loadedAssets / this.totalAssets : 0;
        return Math.min(1, Math.max(0, progress));
    }
    
    _checkComplete() {
        if (this.isLoaded() && this.onComplete) {
            setTimeout(() => {
                this.onComplete();
            }, 200);
        }
    }
}

// Create global instance
const ASSETS = AssetManager.getInstance();

// Helper function to load player sprites
function loadPlayerSprites(state, frameCount) {
    for (let i = 0; i < frameCount; i++) {
        ASSETS.loadImage(`player_${state}_${i}`, `assets/player/${state}/${i}.png`);
    }
}

// Define asset preloading
function preloadAssets() {
    // Menu assets
    ASSETS.loadImage('menuPlayer', 'assets/menu/player.png');
    ASSETS.loadImage('title', 'assets/menu/title.png');
    ASSETS.loadImage('startButton', 'assets/menu/start-game-button.png');
    ASSETS.loadImage('scoreText', 'assets/menu/score-text.png');
    ASSETS.loadImage('gameOver', 'assets/menu/game-over-text.png');
    ASSETS.loadImage('tryAgainButton', 'assets/menu/try-again-button.png');
    
    // Background assets
    ASSETS.loadImage('bgFar', 'assets/background/far.jpg');
    ASSETS.loadImage('bgMid', 'assets/background/mid.png');
    ASSETS.loadImage('bgNear', 'assets/background/ner.png');
    
    // Player sprites
    loadPlayerSprites('idle', PLAYER.FRAMES.IDLE);
    loadPlayerSprites('running', PLAYER.FRAMES.RUNNING);
    loadPlayerSprites('jumping', PLAYER.FRAMES.JUMPING);
    loadPlayerSprites('idle-to-running', PLAYER.FRAMES.IDLE_TO_RUNNING);
}
