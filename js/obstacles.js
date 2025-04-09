/**
 * Obstacle management for the endless runner game
 */
class Obstacle {
    constructor(gameWidth, gameHeight, gameSpeed = 1) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        
        // Obstacle dimensions
        this.width = randomInt(OBSTACLE.MIN_WIDTH, OBSTACLE.MAX_WIDTH);
        this.height = randomInt(OBSTACLE.MIN_HEIGHT, OBSTACLE.MAX_HEIGHT);
        
        // Obstacle position
        this.x = this.gameWidth;
        this.y = this.gameHeight - this.height - GAME.GROUND_HEIGHT; // On ground
        
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
    }
}

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
