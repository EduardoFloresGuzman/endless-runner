/**
 * Asset management system for the endless runner game
 * Handles loading and storing all game assets (images, sounds, etc.)
 */
class AssetManager {
    constructor() {
        this.images = {};
        this.sounds = {};
        this.totalAssets = 0;
        this.loadedAssets = 0;
        this.onComplete = null;
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
        
        // Set source after registering the event handlers
        img.src = src;
        this.images[key] = img;
        return img;
    }
    
    // Get a loaded image
    getImage(key) {
        return this.images[key];
    }
    
    // Check if an image is ready
    isImageReady(key) {
        return this.images[key] && this.images[key].complete;
    }
    
    // Set a callback for when all assets are loaded
    onAllLoaded(callback) {
        this.onComplete = callback;
        this._checkComplete();
    }
    
    // Check if all assets are loaded
    isLoaded() {
        return this.loadedAssets === this.totalAssets;
    }
    
    // Get loading progress (0-1)
    getProgress() {
        // Ensure we don't divide by zero and progress is between 0-1
        const progress = this.totalAssets > 0 ? this.loadedAssets / this.totalAssets : 0;
        return Math.min(1, Math.max(0, progress));
    }
    
    // Private method to check if loading is complete
    _checkComplete() {
        if (this.isLoaded() && this.onComplete) {
            // Add a slight delay to ensure the loading screen shows completion
            setTimeout(() => {
                this.onComplete();
            }, 200);
        }
    }
}

// Create a single global instance
const ASSETS = new AssetManager();

// Load all game assets
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

// Helper function to load player sprites
function loadPlayerSprites(state, frameCount) {
    for (let i = 0; i < frameCount; i++) {
        ASSETS.loadImage(`player_${state}_${i}`, `assets/player/${state}/${i}.png`);
    }
}

// Initialize asset loading with a small delay to ensure DOM is ready
window.addEventListener('load', () => {
    console.log("Starting asset preloading...");
    setTimeout(() => {
        preloadAssets();
        console.log(`Scheduled loading of ${ASSETS.totalAssets} assets`);
    }, 100);
});
