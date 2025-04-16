/**
 * Powerup system for the endless runner game
 */

/**
 * Base Powerup class that defines common functionality
 */
class Powerup {
    constructor(duration = 5000) {
        this.isActive = false;
        this.duration = duration; // Duration in milliseconds
        this.timeRemaining = 0;
    }

    /**
     * Apply this powerup to the player
     * @param {Player} player - The player to apply this powerup to
     */
    apply(player) {
        if (!this.isActive) {
            this.isActive = true;
            this.timeRemaining = this.duration;
            this._onActivate(player);
        }
    }

    /**
     * Update powerup status
     * @param {number} deltaTime - Time elapsed since last update
     * @param {Player} player - The player object
     */
    update(deltaTime, player) {
        if (this.isActive) {
            this.timeRemaining -= deltaTime;
            
            // If the powerup has expired
            if (this.timeRemaining <= 0) {
                this._onDeactivate(player);
                this.isActive = false;
            } else {
                // Continue applying powerup effect
                this._onUpdate(deltaTime, player);
            }
        }
    }
    
    /**
     * Cancel the powerup effect
     * @param {Player} player - The player object
     */
    cancel(player) {
        if (this.isActive) {
            this._onDeactivate(player);
            this.isActive = false;
            this.timeRemaining = 0;
        }
    }
    
    // Protected methods to override in child classes
    _onActivate(player) {}
    _onUpdate(deltaTime, player) {}
    _onDeactivate(player) {}
}

/**
 * Fly Powerup - Allows player to fly
 */
class FlyPowerup extends Powerup {
    constructor(duration = 5000, targetYRatio = 0.5) {
        super(duration);
        this.targetYRatio = targetYRatio; // Position as ratio of screen height
        this.active = false;
        this.speedBoostFactor = 3.0; // How much faster everything moves during fly mode
        this.scoreMultiplier = 8.0; // Increased score multiplier to make it more noticeable
        this.bonusPoints = 100; // Instant bonus points when activating
    }
    
    _onActivate(player) {
        // Calculate target Y position based on screen height
        const targetY = player.gameHeight * this.targetYRatio;
        
        // Store original player state to restore later
        this.originalState = {
            isJumping: player.isJumping,
            isFalling: player.isFalling
        };
        
        // Set flying state
        player.isFlying = true;
        player.isJumping = false;
        player.targetFlyY = targetY - player.height/2;
        player.setState('jumping'); // Use jumping sprite for flying
        
        // Apply speed boost effect to player
        player.flySpeedMultiplier = this.speedBoostFactor;
        player.flyScoreMultiplier = this.scoreMultiplier;
        
        // Add immediate score bonus when activating fly mode
        if (player.game && player.game.scoreSystem) {
            player.game.scoreSystem.addBonus(this.bonusPoints);
        }
        
        console.log(`Fly powerup activated! Speed: ${this.speedBoostFactor}x, Score: ${this.scoreMultiplier}x`);
    }
    
    _onUpdate(deltaTime, player) {
        // Create particle trail effect or other visual feedback during fly mode
        // This would be implemented if we had a particle system
    }
    
    _onDeactivate(player) {
        // Reset speed multipliers
        player.flySpeedMultiplier = 1.0;
        player.flyScoreMultiplier = 1.0;
        
        player.exitFlyMode();
        console.log("Fly powerup deactivated!");
    }
}

/**
 * Attack Powerup - Allows player to destroy obstacles
 */
class AttackPowerup extends Powerup {
    constructor(duration = 5000) {
        super(duration);
        this.active = false;
        this.pointsPerObstacle = 50; // Points awarded for destroying an obstacle
        this.attackEffectDuration = 300; // How long the destruction animation lasts
        this.speedBoostFactor = 2.0; // Speed boost when in attack mode (slightly less than flying)
        this.scoreMultiplier = 3.0; // Score multiplier when attacking
    }
    
    _onActivate(player) {
        // Store original player state to restore later
        this.originalState = {
            isAttacking: player.isAttacking || false
        };
        
        // Set attacking state
        player.isAttacking = true;
        
        // Apply speed and score multipliers
        player.attackSpeedMultiplier = this.speedBoostFactor;
        player.attackScoreMultiplier = this.scoreMultiplier;
        
        // Visual indication player has attack power
        player.attackGlowIntensity = 1.0;
        
        console.log(`Attack powerup activated! Speed: ${this.speedBoostFactor}x, Score: ${this.scoreMultiplier}x`);
    }
    
    _onUpdate(deltaTime, player) {
        // Pulsate attack glow effect
        if (player.attackGlowIntensity !== undefined) {
            player.attackGlowIntensity = 0.7 + Math.sin(Date.now() / 200) * 0.3;
        }
        
        // Add timer warning when powerup is about to expire
        if (this.timeRemaining < 1000) {
            player.attackGlowIntensity = Math.random() > 0.5 ? 1.0 : 0.3; // Flicker effect
        }
    }
    
    _onDeactivate(player) {
        player.isAttacking = this.originalState.isAttacking;
        // Reset the multipliers
        player.attackSpeedMultiplier = 1.0;
        player.attackScoreMultiplier = 1.0;
        player.attackGlowIntensity = 0;
        console.log("Attack powerup deactivated!");
    }
}

/**
 * Manages all powerups in the game
 */
class PowerupManager {
    constructor() {
        this.powerups = {
            fly: new FlyPowerup(),
            attack: new AttackPowerup()
        };
    }
    
    /**
     * Activate a powerup by name
     * @param {string} powerupName - Name of the powerup to activate
     * @param {Player} player - Player to apply powerup to
     */
    activate(powerupName, player) {
        if (this.powerups[powerupName]) {
            this.powerups[powerupName].apply(player);
            return true;
        }
        return false;
    }
    
    /**
     * Cancel a powerup by name
     * @param {string} powerupName - Name of the powerup to cancel
     * @param {Player} player - Player to remove powerup from
     */
    cancel(powerupName, player) {
        if (this.powerups[powerupName] && this.powerups[powerupName].isActive) {
            this.powerups[powerupName].cancel(player);
            return true;
        }
        return false;
    }
    
    /**
     * Check if a powerup is currently active
     * @param {string} powerupName - Name of the powerup to check
     */
    isActive(powerupName) {
        return this.powerups[powerupName] && this.powerups[powerupName].isActive;
    }
    
    /**
     * Update all active powerups
     * @param {number} deltaTime - Time elapsed since last update
     * @param {Player} player - The player object
     */
    update(deltaTime, player) {
        Object.values(this.powerups).forEach(powerup => {
            powerup.update(deltaTime, player);
        });
    }
    
    /**
     * Get the current combined speed multiplier from all active powerups
     */
    getSpeedMultiplier() {
        let multiplier = 1.0;
        Object.values(this.powerups).forEach(powerup => {
            if (powerup.isActive) {
                if (powerup instanceof FlyPowerup) {
                    multiplier *= powerup.speedBoostFactor;
                } else if (powerup instanceof AttackPowerup) {
                    multiplier *= powerup.speedBoostFactor;
                }
            }
        });
        return multiplier;
    }
    
    /**
     * Get the current combined score multiplier from all active powerups
     */
    getScoreMultiplier() {
        let multiplier = 1.0;
        Object.values(this.powerups).forEach(powerup => {
            if (powerup.isActive) {
                if (powerup instanceof FlyPowerup) {
                    multiplier *= powerup.scoreMultiplier;
                } else if (powerup instanceof AttackPowerup) {
                    multiplier *= powerup.scoreMultiplier;
                }
            }
        });
        return multiplier;
    }
}
