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
        
        console.log("Fly powerup activated!");
    }
    
    _onUpdate(deltaTime, player) {
        // Nothing special needed here as player.update() handles the flying physics
    }
    
    _onDeactivate(player) {
        player.exitFlyMode();
        console.log("Fly powerup deactivated!");
    }
}

/**
 * Manages all powerups in the game
 */
class PowerupManager {
    constructor() {
        this.powerups = {
            fly: new FlyPowerup()
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
}
