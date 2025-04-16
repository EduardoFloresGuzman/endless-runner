/**
 * Playing state where the actual gameplay happens
 */
class PlayingState extends BaseState {
    constructor(game) {
        super(game);
        
        // Game systems
        this.collisionSystem = new CollisionSystem();
        this.scoreSystem = new ScoreSystem();
        this.powerupManager = new PowerupManager();
        
        // Game properties
        this.gameSpeed = GAME.STARTING_SPEED;
        
        // Set up keyboard listeners
        this.setupDebugControls();
        this.setupPlayerControls();
    }
    
    enter() {
        console.log("Entering playing state");
        
        // Create game objects
        this.background = new Background(this.game.canvas.width, this.game.canvas.height);
        this.ground = new Ground(this.game.canvas.width, this.game.canvas.height);
        this.player = new Player(this.game.canvas.width, this.game.canvas.height);
        this.obstacleManager = new ObstacleManager(this.game.canvas.width, this.game.canvas.height);
        
        // Give the player a reference to the game for score updates
        this.player.game = this.game;
        
        // Initialize player
        this.player.setState('idle');
        
        // Reset score
        this.scoreSystem.reset();
        
        // Reset game speed
        this.gameSpeed = GAME.STARTING_SPEED;
    }
    
    update(deltaTime) {
        // Get current powerup multipliers
        const powerupSpeedMultiplier = this.powerupManager.getSpeedMultiplier();
        const scoreMultiplier = this.powerupManager.getScoreMultiplier();
        
        // Update background with boosted speed from any active powerup
        this.background.update(this.gameSpeed * powerupSpeedMultiplier);
        
        // Update ground with boosted speed from any active powerup
        this.ground.update(this.gameSpeed * powerupSpeedMultiplier);
        
        // Update player with speed multipliers (handled internally in player.update)
        this.player.update(this.gameSpeed * powerupSpeedMultiplier);
        
        // Update obstacles with boosted speed from any active powerup
        this.obstacleManager.update(deltaTime, this.gameSpeed * powerupSpeedMultiplier);
        
        // Check collisions with obstacles
        if (!this.player.isFlying) {
            const collidedObstacle = this.collisionSystem.checkCollision(this.player, this.obstacleManager);
            
            if (collidedObstacle) {
                // If attacking, destroy the obstacle instead of game over
                if (this.player.isAttacking) {
                    // Pass the current game speed for more realistic destruction animation
                    const currentSpeed = this.gameSpeed * powerupSpeedMultiplier;
                    this.obstacleManager.destroyObstacle(collidedObstacle, currentSpeed);
                    // Award bonus points for destroying obstacle
                    this.scoreSystem.addBonus(50);
                } else {
                    // Normal collision = game over
                    this.gameOver();
                    return;
                }
            }
        }
        
        // Check if player is falling into a hole (skip check when flying)
        if (!this.player.isFlying && 
            this.player.isOnGround() && 
            !this.player.isFalling &&
            this.ground.isOverGap(this.player.x, this.player.width)) {
            
            this.player.fall();
            setTimeout(() => {
                this.gameOver();
            }, 500); // Small delay before game over for falling animation
            return;
        }
        
        // Update score with boosted multiplier when in fly mode
        this.scoreSystem.updateScore(deltaTime, scoreMultiplier);
        
        // REMOVED: Progressive game speed increase based on score
        // Now the game speed remains constant at GAME.STARTING_SPEED
        // Only the flying power-up will affect the game speed
        
        // Update powerups
        this.powerupManager.update(deltaTime, this.player);
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
        ctx.fillText(`Flying: ${this.player.isFlying ? 'YES' : 'NO'} (Press T to toggle)`, 10, 120);
        
        // Consolidated redundant code for displaying speed/score multipliers
        const yOffset = 140;
        if (this.player.isFlying || this.player.isAttacking) {
            // Show speed and score boosts (same for both powerups)
            ctx.fillText(`Speed Boost: ${this.powerupManager.getSpeedMultiplier().toFixed(1)}x`, 10, yOffset);
            ctx.fillText(`Score Boost: ${this.powerupManager.getScoreMultiplier().toFixed(1)}x`, 10, yOffset + 20);
            
            // Show active powerup states
            let textLine = yOffset + 40;
            if (this.player.isFlying) {
                ctx.fillText(`Flying Mode: ACTIVE (Press T to toggle)`, 10, textLine);
                textLine += 20;
            }
            if (this.player.isAttacking) {
                ctx.fillText(`Attack Mode: ACTIVE (Press A to toggle)`, 10, textLine);
            }
        }
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
    
    setupPlayerControls() {
        // Add event listener for the 'T' key to toggle flying mode
        document.addEventListener('keydown', (event) => {
            if (event.key === 't' || event.key === 'T') {
                if (this.player) {
                    if (this.powerupManager.isActive('fly')) {
                        this.powerupManager.cancel('fly', this.player);
                    } else {
                        this.powerupManager.activate('fly', this.player);
                    }
                    console.log(`Flying mode: ${this.player.isFlying ? 'ON' : 'OFF'}`);
                }
            }
            
            // Add listener for 'A' key to toggle attack mode
            if (event.key === 'a' || event.key === 'A') {
                if (this.player) {
                    if (this.powerupManager.isActive('attack')) {
                        this.powerupManager.cancel('attack', this.player);
                    } else {
                        this.powerupManager.activate('attack', this.player);
                    }
                    console.log(`Attack mode: ${this.player.isAttacking ? 'ON' : 'OFF'}`);
                }
            }
        });
    }
}
