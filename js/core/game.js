/**
 * Main game engine that controls the game loop and state management
 */
class Game {
    constructor() {
        // Set up canvas
        this.canvas = document.createElement('canvas');
        this.canvas.width = CANVAS.WIDTH;
        this.canvas.height = CANVAS.HEIGHT;
        document.getElementById('game-canvas').appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        // Initialize managers
        this.assetManager = AssetManager.getInstance();
        this.stateManager = new StateManager(this);
        this.inputManager = new InputManager(this);
        
        // Register game states
        this.registerStates();
        
        // Start with loading state
        this.stateManager.changeState('loading');
        
        // Game loop variables
        this.lastTime = 0;
        this.animationFrameId = null;
        
        // Start the game loop
        this.startGameLoop();
    }
    
    registerStates() {
        this.stateManager.registerState('loading', new LoadingState(this));
        this.stateManager.registerState('menu', new MenuState(this));
        this.stateManager.registerState('playing', new PlayingState(this));
        this.stateManager.registerState('gameOver', new GameOverState(this));
    }
    
    startGameLoop() {
        this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this));
    }
    
    gameLoop(timestamp) {
        // Calculate delta time
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;
        
        // Update and render the current state
        this.stateManager.update(deltaTime);
        this.stateManager.render(this.ctx);
        
        // Continue the game loop
        this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this));
    }
}

// Initialize the game when the page is loaded
window.addEventListener('load', () => {
    window.game = new Game();
});
