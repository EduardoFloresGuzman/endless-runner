/**
 * Menu system for the endless runner game
 * Handles main menu, game over, and other UI elements
 */
class MenuManager {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.menuState = 'main'; // 'main', 'paused', 'gameover'
        this.visible = true;
        
        // Pre-load images
        this.playerImage = new Image();
        this.playerImage.src = 'assets/menu/player.png';
        
        // Add start button image
        this.buttonImage = new Image();
        this.buttonImage.src = 'assets/menu/start-button.png';
        
        // Add event listeners to verify image loading
        this.playerImage.onload = () => {
            console.log("Menu player image loaded successfully");
        };
        
        this.buttonImage.onload = () => {
            console.log("Start button image loaded successfully");
            // Use the dimensions from constants
            this.startButton.width = MENU.BUTTON.WIDTH;
            this.startButton.height = MENU.BUTTON.HEIGHT;
        };
        
        this.playerImage.onerror = (e) => {
            console.error("Error loading menu player image:", e);
        };
        
        this.buttonImage.onerror = (e) => {
            console.error("Error loading button image:", e);
        };
        
        // Button areas for click detection
        this.startButton = {
            x: width * 0.2, // Aligned with the title text
            y: height * 0.4, // Positioned below the title (title is at 0.3)
            width: 200,  // Default size, will be overridden when image loads
            height: 60,  // Default size, will be overridden when image loads
            text: 'Start Game'
        };
        
        // Score tracking for game over screen
        this.finalScore = 0;

        // Score display properties
        this.currentScore = 0;
        this.scorePosition = {
            x: 20,
            y: 40
        };
        
        console.log("MenuManager initialized - Should be visible by default");
    }
    
    show(state = 'main') {
        this.menuState = state;
        this.visible = true;
    }
    
    hide() {
        this.visible = false;
    }
    
    setScore(score) {
        this.finalScore = score;
    }

    // Update the current score
    updateScore(score) {
        this.currentScore = score;
    }
    
    handleClick(x, y) {
        if (!this.visible) return false;
        
        // Check if click is on the start button
        if (x > this.startButton.x && 
            x < this.startButton.x + this.startButton.width &&
            y > this.startButton.y && 
            y < this.startButton.y + this.startButton.height) {
            
            // Return true to indicate button was clicked
            return true;
        }
        
        return false;
    }
    
    drawScore(ctx) {
        ctx.font = 'bold 24px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'left';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        
        // Draw text shadow/outline for better visibility against any background
        ctx.strokeText(`Score: ${Math.floor(this.currentScore)}`, this.scorePosition.x, this.scorePosition.y);
        ctx.fillText(`Score: ${Math.floor(this.currentScore)}`, this.scorePosition.x, this.scorePosition.y);
    }
    
    draw(ctx) {
        if (!this.visible) {
            // Draw only the score when the menu is hidden (during gameplay)
            if (this.currentScore > 0) {
                this.drawScore(ctx);
            }
            return;
        }
        
        // Semi-transparent overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, this.width, this.height);
        
        if (this.menuState === 'main') {
            this.drawMainMenu(ctx);
        } else if (this.menuState === 'gameover') {
            this.drawGameOver(ctx);
        }
    }
    
    drawMainMenu(ctx) {
        // Draw title
        ctx.font = 'bold 64px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'left';
        ctx.fillText('Endless Runner', this.width * 0.2, this.height * 0.3);
        
        // Draw start button
        this.drawButton(ctx, this.startButton);
        
        // Draw player image on the right
        if (this.playerImage.complete) {
            // Use original size or cap at a maximum height that fits well
            let imgWidth, imgHeight;
            
            // If we know the original size (566x626)
            const originalWidth = 566;
            const originalHeight = 626;
            
            // Calculate dimensions that preserve aspect ratio but fit nicely in the menu
            const maxHeight = this.height * 0.7; // 70% of the canvas height
            
            if (originalHeight > maxHeight) {
                // Scale down proportionally if too large
                imgHeight = maxHeight;
                imgWidth = (originalWidth / originalHeight) * imgHeight;
            } else {
                // Use original size if it fits well
                imgWidth = originalWidth;
                imgHeight = originalHeight;
            }
            
            ctx.drawImage(
                this.playerImage,
                this.width * 0.6, // Position on right side
                this.height * 0.65 - imgHeight / 2, // Centered vertically
                imgWidth,
                imgHeight
            );
        }
    }
    
    drawGameOver(ctx) {
        // Draw game over text
        ctx.font = 'bold 64px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over', this.width * 0.5, this.height * 0.3);
        
        // Draw score
        ctx.font = '32px Arial';
        ctx.fillText(`Score: ${Math.floor(this.finalScore)}`, this.width * 0.5, this.height * 0.4);
        
        // Update button text and use smaller dimensions for game over button
        this.startButton.text = 'Try Again';
        this.startButton.width = MENU.GAMEOVER_BUTTON.WIDTH;
        this.startButton.height = MENU.GAMEOVER_BUTTON.HEIGHT;
        this.startButton.x = this.width * 0.5 - this.startButton.width / 2; // Center horizontally
        
        // Draw button
        this.drawButton(ctx, this.startButton);
    }
    
    drawButton(ctx, button) {
        // Use the image only for the main menu screen, not game over
        if (this.buttonImage && this.buttonImage.complete && this.menuState !== 'gameover') {
            // Draw the button using the image
            ctx.drawImage(
                this.buttonImage,
                button.x,
                button.y,
                button.width,
                button.height
            );
        } else {
            // Styled button for game over screen or fallback
            // Button background
            ctx.fillStyle = '#4CAF50';
            ctx.fillRect(button.x, button.y, button.width, button.height);
            
            // Button border
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.strokeRect(button.x, button.y, button.width, button.height);
            
            // Button text
            ctx.font = 'bold 24px Arial';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(button.text, button.x + button.width / 2, button.y + button.height / 2);
        }
    }
}
