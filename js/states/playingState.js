/**
 * Playing state where the actual gameplay happens
 */
class PlayingState extends BaseState {
    constructor(game) {
        super(game);
        
        // Game systems
        this.collisionSystem = new CollisionSystem();
        this.scoreSystem = new ScoreSystem();
        
        // Reset when entering state
        this.background = null;
        this.ground = null;
        this.player = null;
        this.obstacleManager = null;
        
        // Game properties
        this.gameSpeed = GAME.STARTING_SPEED;
    }
    
    enter() {
        console.log("Entering playing state");
        
        // Create game objects
        this.background = new Background(this.game.canvas.width, this.game.canvas.height);
        this.ground = new Ground(this.game.canvas.width, this.game.canvas.height);
        this.player = new Player(this.game.canvas.width, this.game.canvas.height);
        this.obstacleManager = new ObstacleManager(this.game.canvas.width, this.game.canvas.height);
        
        // Initialize player
        this.player.setState('idle');
        
        // Reset score
        this.scoreSystem.reset();
        
        // Reset game speed
        this.gameSpeed = GAME.STARTING_SPEED;
    }
    
    update(deltaTime) {
        // Update background
        this.background.update(this.gameSpeed);
        
        // Update player
        this.player.update(this.gameSpeed);
        
        // Update obstacles
        this.obstacleManager.update(deltaTime, this.gameSpeed);
        
        // Check collisions
        if (this.collisionSystem.checkCollision(this.player, this.obstacleManager)) {
            this.gameOver();
            return;
        }
        
        // Update score and game speed
        this.scoreSystem.updateScore(deltaTime);
        
        // Increase game speed over time
        this.gameSpeed = GAME.STARTING_SPEED + 
            Math.floor(this.scoreSystem.score / GAME.SPEED_INCREMENT_SCORE) * GAME.SPEED_INCREMENT;
    }
    
    render(ctx) {
        // Draw background
        this.background.draw(ctx);
        
        // Draw ground
        this.ground.draw(ctx);
        
        // Draw obstacles
        this.obstacleManager.draw(ctx);
        
        // Draw player
        this.player.draw(ctx);
        
        // Draw score
        this.scoreSystem.draw(ctx);
    }
    
    onInputDown() {
        // Start player jump
        if (this.player) {
            this.player.startJump();
        }
    }
    
    onInputUp() {
        // End player jump (for variable jump height)
        if (this.player) {
            this.player.endJump();
        }
    }
    
    onInputCancel() {
        // Handle cases like mouse leaving canvas
        if (this.player) {
            this.player.endJump();
        }
    }
    
    gameOver() {
        // Set final score and transition to game over state
        const finalScore = this.scoreSystem.getFinalScore();
        this.game.stateManager.changeState('gameOver', { finalScore });
    }
    
    exit() {
        console.log("Exiting playing state");
    }
}
