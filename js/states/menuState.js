/**
 * Main menu state that shows the title screen and start button
 */
class MenuState extends BaseState {
    constructor(game) {
        super(game);
        
        // Create UI manager for menu elements
        this.uiManager = new UIManager(game.canvas.width, game.canvas.height);
    }
    
    enter() {
        console.log("Entering menu state");
        
        // Create background and ground
        this.background = new Background(this.game.canvas.width, this.game.canvas.height);
        this.ground = new Ground(this.game.canvas.width, this.game.canvas.height);
        
        // Configure UI for main menu
        this.uiManager.setupMainMenu();
    }
    
    update(deltaTime) {
        // Animate background slowly even in menu
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
        
        // Draw menu UI
        this.uiManager.draw(ctx);
    }
    
    onInputDown(position) {
        // Check for button clicks
        if (this.uiManager.handleClick(position.x, position.y)) {
            // Start button was clicked
            this.game.stateManager.changeState('playing');
        }
    }
    
    exit() {
        console.log("Exiting menu state");
    }
}
