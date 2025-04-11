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
    }
    
    update(gameSpeed = 1) {
        // Update speed based on current game speed
        this.speedX = this.baseSpeedX * gameSpeed;
        this.x += this.speedX;
    }
    
    draw(ctx) {
        // Draw the obstacle (simple rectangle for now)
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw debug hitbox
        if (DEBUG.ENABLED && DEBUG.SHOW_HITBOXES) {
            this.drawHitbox(ctx);
        }
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
        
        // Remove obstacles that have gone off screen
        this.obstacles = this.obstacles.filter(obstacle => obstacle.x > -obstacle.width);
    }
    
    draw(ctx) {
        this.obstacles.forEach(obstacle => {
            obstacle.draw(ctx);
        });
    }
    
    checkCollision(player) {
        // Get player's hitbox for collision detection
        const playerHitbox = player.getHitbox();
        
        return this.obstacles.some(obstacle => 
            checkCollision(playerHitbox, obstacle)
        );
    }
    
    reset() {
        this.obstacles = [];
    }
}
