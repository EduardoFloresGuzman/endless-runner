/**
 * Game over state that shows the score and retry button
 */
class GameOverState extends BaseState {
    constructor(game) {
        super(game);
        
        // UI manager for game over screen
        this.uiManager = new UIManager(game.canvas.width, game.canvas.height);
        
        // Background objects that continue to animate
        this.background = null;
        this.ground = null;
        
        // Final score
        this.finalScore = 0;
    }
    
    enter(data) {
        console.log("Entering game over state");
        
        // Store the final score
        this.finalScore = data && data.finalScore ? data.finalScore : 0;
        
        // Create background and ground if they don't exist
        if (!this.background) {
            this.background = new Background(this.game.canvas.width, this.game.canvas.height);
        }
        
        if (!this.ground) {
            this.ground = new Ground(this.game.canvas.width, this.game.canvas.height);
        }
        
        // Configure UI for game over screen
        this.uiManager.setupGameOver(this.finalScore);
    }
    
    update(deltaTime) {
        // Animate background slowly in game over screen
        if (this.background) {
            this.background.update(GAME.STARTING_SPEED * 0.3);
        }
    }
    
    render(ctx) {
        // Draw background
        if (this.background) {
            this.background.draw(ctx);
        }
        
        // Draw ground
        if (this.ground) {
            this.ground.draw(ctx);
        }
        
        // Draw game over UI
        this.uiManager.draw(ctx);
    }
    
    onInputDown(position) {
        // Check for button clicks
        if (this.uiManager.handleClick(position.x, position.y)) {
            // Try again button was clicked
            this.game.stateManager.changeState('playing');
        }
    }
    
    exit() {
        console.log("Exiting game over state");
    }
}
