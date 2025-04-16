/**
 * Obstacle entity for the endless runner game
 */
class Obstacle extends Entity {
    constructor(gameWidth, gameHeight, gameSpeed = 1) {
        // Generate random dimensions
        const width = randomInt(OBSTACLE.MIN_WIDTH, OBSTACLE.MAX_WIDTH);
        const height = randomInt(OBSTACLE.MIN_HEIGHT, OBSTACLE.MAX_HEIGHT);
        
        // Initialize with position at the right edge of the screen
        super(
            gameWidth,
            gameHeight - height - GAME.GROUND_HEIGHT,
            width,
            height
        );
        
        // Obstacle speed
        this.baseSpeedX = OBSTACLE.BASE_SPEED;
        this.speedX = this.baseSpeedX * gameSpeed;

        // Properties for destruction animation
        this.isDestroyed = false;
        this.destroyAnimTime = 0;
        this.destroyAnimDuration = 500; // milliseconds
        this.rotationAngle = 0;
        this.yVelocity = 0;
        this.xVelocity = 0;
        this.rotationSpeed = 0;
    }
    
    update(gameSpeed = 1) {
        // Update speed based on current game speed
        this.speedX = this.baseSpeedX * gameSpeed;
        
        if (this.isDestroyed) {
            // Destruction animation physics
            this.destroyAnimTime += 16; // Approximate for a frame
            this.rotationAngle += this.rotationSpeed;
            
            // Apply gravity to y velocity
            this.yVelocity += 0.3; // Gravity effect
            
            // Update position based on velocities
            this.y += this.yVelocity;
            this.x += this.xVelocity;
            
            // Fade out by adjusting alpha
            this.alpha = Math.max(0, 1 - (this.destroyAnimTime / this.destroyAnimDuration));
        } else {
            // Normal movement
            this.x += this.speedX;
        }
    }
    
    draw(ctx) {
        if (this.isDestroyed) {
            // Save context for rotation
            ctx.save();
            
            // Set up rotation point at center of obstacle
            ctx.translate(this.x + this.width/2, this.y + this.height/2);
            ctx.rotate(this.rotationAngle);
            ctx.globalAlpha = this.alpha;
            
            // Draw the rotated and fading obstacle
            ctx.fillStyle = '#e74c3c';
            ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
            
            // Restore context
            ctx.globalAlpha = 1.0;
            ctx.restore();
        } else {
            // Draw the obstacle normally
            ctx.fillStyle = '#e74c3c';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        
        // Draw debug hitbox
        if (DEBUG.ENABLED && DEBUG.SHOW_HITBOXES && !this.isDestroyed) {
            this.drawHitbox(ctx);
        }
    }
    
    destroy(gameSpeed = 1) {
        this.isDestroyed = true;
        this.alpha = 1.0;
        
        // Scale destruction effects based on game speed
        const speedFactor = Math.max(1, gameSpeed);
        
        // More dramatic upward velocity when hit at high speeds
        this.yVelocity = -10 * speedFactor;
        
        // Add horizontal velocity in direction of player's movement
        // Faster horizontal movement when player is moving faster
        this.xVelocity = this.baseSpeedX * 0.5 * speedFactor;
        
        // Rotate faster at higher speeds
        this.rotationSpeed = 0.2 * speedFactor;
        
        // Shorter animation duration at higher speeds for snappier feel
        this.destroyAnimDuration = Math.max(300, 500 / speedFactor);
    }
    
    // Draw hitbox for debugging
    drawHitbox(ctx) {
        ctx.strokeStyle = DEBUG.HITBOX_COLOR;
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        
        // Fill hitbox with semi-transparent color
        ctx.fillStyle = DEBUG.HITBOX_COLOR;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

/**
 * Manages the creation and update of obstacles
 */
class ObstacleManager {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.obstacles = [];
        this.timer = 0;
        this.interval = OBSTACLE.SPAWN_INTERVAL;
        this.destroyedObstacles = []; // Track obstacles being destroyed
    }
    
    update(deltaTime, gameSpeed) {
        // Increase spawn rate with game speed
        if (this.timer > this.interval / gameSpeed) {
            this.obstacles.push(new Obstacle(this.gameWidth, this.gameHeight, gameSpeed));
            this.timer = 0;
        } else {
            this.timer += deltaTime;
        }
        
        // Update all obstacles
        this.obstacles.forEach(obstacle => {
            obstacle.update(gameSpeed);
        });
        
        // Update destroyed obstacles
        this.destroyedObstacles.forEach(obstacle => {
            obstacle.update(gameSpeed);
        });
        
        // Remove obstacles that have gone off screen
        this.obstacles = this.obstacles.filter(obstacle => obstacle.x > -obstacle.width);
        
        // Remove completely faded destroyed obstacles
        this.destroyedObstacles = this.destroyedObstacles.filter(obstacle => 
            obstacle.x > -obstacle.width && obstacle.destroyAnimTime < obstacle.destroyAnimDuration);
    }
    
    draw(ctx) {
        // Draw active obstacles
        this.obstacles.forEach(obstacle => {
            obstacle.draw(ctx);
        });
        
        // Draw obstacles being destroyed
        this.destroyedObstacles.forEach(obstacle => {
            obstacle.draw(ctx);
        });
    }
    
    destroyObstacle(obstacle, gameSpeed = 1) {
        // Find the obstacle's index
        const index = this.obstacles.indexOf(obstacle);
        if (index !== -1) {
            // Remove from active obstacles list
            const [removedObstacle] = this.obstacles.splice(index, 1);
            
            // Start destruction animation with current game speed
            removedObstacle.destroy(gameSpeed);
            
            // Add to destroyed obstacles for animation
            this.destroyedObstacles.push(removedObstacle);
            
            return true;
        }
        return false;
    }
    
    checkCollision(player) {
        // Get player's hitbox for collision detection
        const playerHitbox = player.getHitbox();
        
        for (const obstacle of this.obstacles) {
            if (checkCollision(playerHitbox, obstacle)) {
                return obstacle; // Return the actual obstacle object, not just true/false
            }
        }
        
        return null;
    }
}
