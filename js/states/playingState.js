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
        
        // Set up keyboard listener for debug toggle
        this.setupDebugControls();
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
        
        // Update ground - pass game speed for scrolling
        this.ground.update(this.gameSpeed);
        
        // Update player
        this.player.update(this.gameSpeed);
        
        // Update obstacles
        this.obstacleManager.update(deltaTime, this.gameSpeed);
        
        // Check collisions with obstacles
        if (this.collisionSystem.checkCollision(this.player, this.obstacleManager)) {
            this.gameOver();
            return;
        }
        
        // Check if player is falling into a hole
        if (this.player.isOnGround() && 
            !this.player.isFalling &&
            this.ground.isOverGap(this.player.x, this.player.width)) {
            
            this.player.fall();
            setTimeout(() => {
                this.gameOver();
            }, 500); // Small delay before game over for falling animation
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
        
        // Debug overlay text
        if (DEBUG.ENABLED) {
            this.drawDebugInfo(ctx);
        }
    }
    
    drawDebugInfo(ctx) {
        ctx.font = '16px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText('DEBUG MODE: Press D to toggle', 10, 60);
        ctx.fillText(`Game Speed: ${this.gameSpeed.toFixed(2)}`, 10, 80);
        ctx.fillText(`Gaps Enabled: ${DEBUG.GAPS_ENABLED ? 'YES' : 'NO'} (Press G to toggle)`, 10, 100);
    }
    
    onInputDown() {
        // Start player jump (only if not falling)
        if (this.player && !this.player.isFalling) {
            this.player.startJump();
        }
    }
    
    onInputUp() {
        // End player jump (for variable jump height)
        if (this.player && !this.player.isFalling) {
            this.player.endJump();
        }
    }
    
    onInputCancel() {
        // Handle cases like mouse leaving canvas
        if (this.player && !this.player.isFalling) {
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
    
    setupDebugControls() {
        // Add event listener for the 'D' key to toggle debug mode
        document.addEventListener('keydown', (event) => {
            if (event.key === 'd' || event.key === 'D') {
                DEBUG.ENABLED = !DEBUG.ENABLED;
                console.log(`Debug mode: ${DEBUG.ENABLED ? 'ON' : 'OFF'}`);
            }
            
            // Toggle ground gaps with the 'G' key when in debug mode
            if (DEBUG.ENABLED && (event.key === 'g' || event.key === 'G')) {
                DEBUG.GAPS_ENABLED = !DEBUG.GAPS_ENABLED;
                console.log(`Ground gaps: ${DEBUG.GAPS_ENABLED ? 'ON' : 'OFF'}`);
                
                // Re-initialize ground with new gap setting if needed
                if (this.ground) {
                    // Create a new ground with current settings
                    const oldGround = this.ground;
                    this.ground = new Ground(this.game.canvas.width, this.game.canvas.height);
                    
                    // Keep the existing segments for continuity
                    // but don't generate any new gaps if disabled
                    if (!DEBUG.GAPS_ENABLED) {
                        this.ground.segments = oldGround.segments.filter(segment => !segment.isGap);
                    }
                }
            }
        });
    }
}
