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
        this.background = new Background(this.canvas.width, this.canvas.height);
        this.ground = new Ground(this.canvas.width, this.canvas.height);
        
        // Menu system - replaces HTML menu
        this.menuManager = new MenuManager(this.canvas.width, this.canvas.height);
        
        // Event listeners
        this.setupEventListeners();
        
        // Start the game loop immediately (not waiting for game to start)
        this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this));
        
        console.log("Game initialized - Menu should be visible");
    }
    
    setupEventListeners() {
        // Mouse controls for jumping
        this.canvas.addEventListener('mousedown', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            if (!this.running) {
                // Handle menu click
                if (this.menuManager.handleClick(x, y)) {
                    this.start();
                }
            } else {
                // Handle jump
                this.player.startJump();
            }
        });
        
        this.canvas.addEventListener('mouseup', () => {
            if (this.running) {
                this.player.endJump();
            }
        });
        
        // Handle case where mouse leaves canvas while held
        this.canvas.addEventListener('mouseleave', () => {
            if (this.running) {
                this.player.endJump();
            }
        });
    }
    
    start() {
        this.running = true;
        this.score = 0;
        this.gameSpeed = GAME.STARTING_SPEED;
        
        // Hide menu
        this.menuManager.hide();
        
        // Reset game objects
        this.player = new Player(this.canvas.width, this.canvas.height);
        this.player.setState('idle');
        this.obstacleManager = new ObstacleManager(this.canvas.width, this.canvas.height);
        this.background = new Background(this.canvas.width, this.canvas.height);
        this.ground = new Ground(this.canvas.width, this.canvas.height);
        
        // We're already running the game loop, so no need to start it again
        console.log("Game started - Menu should be hidden now");
    }
    
    gameOver() {
        this.running = false;
        
        // Update and show game over menu
        this.menuManager.setScore(Math.floor(this.score / GAME.SCORE_DIVIDER));
        this.menuManager.show('gameover');
    }
    
    update(deltaTime) {
        // Only update game objects when the game is running
        if (this.running) {
            // Update background
            this.background.update(this.gameSpeed);
            
            // Update player
            this.player.update(this.gameSpeed);
            
            // Update obstacles
            this.obstacleManager.update(deltaTime, this.gameSpeed);
            
            // Check collisions
            if (this.obstacleManager.checkCollision(this.player)) {
                this.gameOver();
            }
            
            // Update score and game speed
            this.score += 1;
            // Update the canvas-rendered score instead of HTML element
            this.menuManager.updateScore(Math.floor(this.score / GAME.SCORE_DIVIDER));
            
            // Increase game speed over time
            this.gameSpeed = GAME.STARTING_SPEED + 
                Math.floor(this.score / GAME.SPEED_INCREMENT_SCORE) * GAME.SPEED_INCREMENT;
        }
    }
    
    draw() {
        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background
        this.background.draw(this.ctx);
        
        // Draw ground
        this.ground.draw(this.ctx);
        
        // Draw player
        this.player.draw(this.ctx);
        
        // Draw obstacles
        this.obstacleManager.draw(this.ctx);
        
        // Draw menu if visible
        this.menuManager.draw(this.ctx);
    }
    
    gameLoop(timestamp) {
        // Calculate deltaTime
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;
        
        // Update and draw the game
        this.update(deltaTime);
        this.draw();
        
        // Continue the game loop
        this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this));
    }
}

// Initialize the game when the page loads
window.addEventListener('load', () => {
    const game = new Game();
});
