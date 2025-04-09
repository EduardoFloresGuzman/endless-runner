/**
 * Main game class for the endless runner
 */
class Game {
    constructor() {
        // Set up canvas
        this.canvas = document.createElement('canvas');
        this.canvas.width = CANVAS.WIDTH;
        this.canvas.height = CANVAS.HEIGHT;
        document.getElementById('game-canvas').appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        // Game properties
        this.running = false;
        this.score = 0;
        this.gameSpeed = GAME.STARTING_SPEED;
        this.lastTime = 0;
        
        // Game objects
        this.player = new Player(this.canvas.width, this.canvas.height);
        this.player.setState('idle'); // Start player in idle state
        this.obstacleManager = new ObstacleManager(this.canvas.width, this.canvas.height);
        
        // Event listeners
        this.setupEventListeners();
        
        // Start button
        document.getElementById('start-button').addEventListener('click', () => {
            this.start();
        });
    }
    
    setupEventListeners() {
        // Mouse controls only for variable height jumping
        this.canvas.addEventListener('mousedown', () => {
            if (this.running) {
                this.player.startJump();
            }
        });
        
        this.canvas.addEventListener('mouseup', () => {
            this.player.endJump();
        });
        
        // Handle case where mouse leaves canvas while held
        this.canvas.addEventListener('mouseleave', () => {
            this.player.endJump();
        });
    }
    
    start() {
        if (!this.running) {
            this.running = true;
            this.score = 0;
            this.gameSpeed = GAME.STARTING_SPEED;
            this.player = new Player(this.canvas.width, this.canvas.height);
            this.player.setState('idle'); // Start player in idle state
            this.obstacleManager = new ObstacleManager(this.canvas.width, this.canvas.height);
            document.getElementById('start-button').textContent = "Restart";
            
            // Start the game loop
            requestAnimationFrame(this.gameLoop.bind(this));
        } else {
            // Restart the game
            this.score = 0;
            this.gameSpeed = GAME.STARTING_SPEED;
            this.player = new Player(this.canvas.width, this.canvas.height);
            this.player.setState('idle'); // Start player in idle state
            this.obstacleManager.reset();
        }
    }
    
    update(deltaTime) {
        // Update player
        this.player.update();
        
        // Update obstacles
        this.obstacleManager.update(deltaTime, this.gameSpeed);
        
        // Check collisions
        if (this.obstacleManager.checkCollision(this.player)) {
            this.running = false;
            document.getElementById('start-button').textContent = "Try Again";
        }
        
        // Update score and game speed
        if (this.running) {
            this.score += 1;
            document.getElementById('score').textContent = `Score: ${Math.floor(this.score / GAME.SCORE_DIVIDER)}`;
            
            // Increase game speed over time
            this.gameSpeed = GAME.STARTING_SPEED + 
                Math.floor(this.score / GAME.SPEED_INCREMENT_SCORE) * GAME.SPEED_INCREMENT;
        }
    }
    
    draw() {
        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw ground
        this.ctx.fillStyle = '#2ecc71';
        this.ctx.fillRect(0, this.canvas.height - GAME.GROUND_HEIGHT, this.canvas.width, GAME.GROUND_HEIGHT);
        
        // Draw player
        this.player.draw(this.ctx);
        
        // Draw obstacles
        this.obstacleManager.draw(this.ctx);
        
        // Draw game over message
        if (!this.running && this.score > 0) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.ctx.font = '48px Arial';
            this.ctx.fillStyle = 'white';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Game Over', this.canvas.width / 2, this.canvas.height / 2);
            
            this.ctx.font = '24px Arial';
            this.ctx.fillText(`Score: ${Math.floor(this.score / GAME.SCORE_DIVIDER)}`, this.canvas.width / 2, this.canvas.height / 2 + 40);
        }
    }
    
    gameLoop(timestamp) {
        // Calculate deltaTime
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;
        
        // Update and draw the game
        this.update(deltaTime);
        this.draw();
        
        // Continue the game loop if the game is running
        if (this.running) {
            requestAnimationFrame(this.gameLoop.bind(this));
        }
    }
}

// Initialize the game when the page loads
window.addEventListener('load', () => {
    const game = new Game();
});
