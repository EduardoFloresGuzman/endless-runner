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
        
        // Add title image
        this.titleImage = new Image();
        this.titleImage.src = 'assets/menu/title.png';
        
        // Add start button image
        this.buttonImage = new Image();
        this.buttonImage.src = 'assets/menu/start-game-button.png';
        
        // Add score image
        this.scoreImage = new Image();
        this.scoreImage.src = 'assets/menu/score-text.png';
        
        // Add game over image
        this.gameOverImage = new Image();
        this.gameOverImage.src = 'assets/menu/game-over-text.png';
        
        // Add try again button image
        this.tryAgainImage = new Image();
        this.tryAgainImage.src = 'assets/menu/try-again-button.png';
        
        // Add event listeners to verify image loading
        this.playerImage.onload = () => {
            console.log("Menu player image loaded successfully");
        };
        
        this.titleImage.onload = () => {
            console.log("Title image loaded successfully");
        };
        
        this.buttonImage.onload = () => {
            console.log("Start button image loaded successfully");
            // Use the dimensions from constants - updated reference
            this.startButton.width = MENU.START_GAME_BUTTON.WIDTH;
            this.startButton.height = MENU.START_GAME_BUTTON.HEIGHT;
        };
        
        this.scoreImage.onload = () => {
            console.log("Score image loaded successfully");
        };
        
        this.gameOverImage.onload = () => {
            console.log("Game over image loaded successfully");
        };
        
        this.tryAgainImage.onload = () => {
            console.log("Try again button image loaded successfully");
        };
        
        this.playerImage.onerror = (e) => {
            console.error("Error loading menu player image:", e);
        };
        
        this.buttonImage.onerror = (e) => {
            console.error("Error loading button image:", e);
        };
        
        // Button areas for click detection
        this.startButton = {
            x: width * 0.3, // Aligned with the title text
            y: height * MENU.START_GAME_BUTTON.POSITION_Y, // Updated reference
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
        if (this.scoreImage && this.scoreImage.complete) {
            // Calculate score image dimensions - updated to use WIDTH_RATIO
            const scoreHeight = this.height * MENU.SCORE.HEIGHT_RATIO;
            const scoreWidth = this.width * MENU.SCORE.WIDTH_RATIO;
            
            // Draw the score image
            ctx.drawImage(
                this.scoreImage,
                MENU.SCORE.POSITION_X,
                MENU.SCORE.POSITION_Y,
                scoreWidth,
                scoreHeight
            );
            
            // Draw the score text overlaid on the image
            ctx.font = 'bold 24px Arial';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${Math.floor(this.currentScore)}`, 
                MENU.SCORE.POSITION_X + scoreWidth * 0.6, // Position text after "Score:" part of image
                MENU.SCORE.POSITION_Y + scoreHeight/2);
        } else {
            // Fallback to original text method
            ctx.font = 'bold 24px Arial';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'left';
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 3;
            
            ctx.strokeText(`Score: ${Math.floor(this.currentScore)}`, this.scorePosition.x, this.scorePosition.y);
            ctx.fillText(`Score: ${Math.floor(this.currentScore)}`, this.scorePosition.x, this.scorePosition.y);
        }
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
        // Draw title image instead of text
        if (this.titleImage && this.titleImage.complete) {
            // Calculate dimensions using both WIDTH_RATIO and HEIGHT_RATIO
            const titleHeight = this.height * MENU.TITLE.HEIGHT_RATIO;
            const titleWidth = this.width * MENU.TITLE.WIDTH_RATIO;
            
            ctx.drawImage(
                this.titleImage,
                this.width * 0.2,
                this.height * MENU.TITLE.POSITION_Y,
                titleWidth,
                titleHeight
            );
        } else {
            // Fallback to text if image isn't loaded
            ctx.font = 'bold 64px Arial';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'left';
            ctx.fillText('Endless Runner', this.width * 0.2, this.height * 0.3);
        }
        
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
        // Draw game over image instead of text
        if (this.gameOverImage && this.gameOverImage.complete) {
            // Updated to use WIDTH_RATIO
            const gameOverHeight = this.height * MENU.GAMEOVER.HEIGHT_RATIO;
            const gameOverWidth = this.width * MENU.GAMEOVER.WIDTH_RATIO;
            
            ctx.drawImage(
                this.gameOverImage,
                this.width * 0.5 - gameOverWidth / 2, // Center horizontally
                this.height * MENU.GAMEOVER.POSITION_Y,
                gameOverWidth,
                gameOverHeight
            );
        } else {
            // Fallback to text if image isn't loaded
            ctx.font = 'bold 64px Arial';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.fillText('Game Over', this.width * 0.5, this.height * 0.3);
        }
        
        // Draw score image instead of text
        if (this.scoreImage && this.scoreImage.complete) {
            // Calculate score image dimensions
            const scoreHeight = this.height * MENU.GAMEOVER_SCORE.HEIGHT_RATIO;
            const scoreWidth = this.width * MENU.GAMEOVER_SCORE.WIDTH_RATIO;
            
            // Draw the score image centered below game over text
            ctx.drawImage(
                this.scoreImage,
                this.width * 0.5 - scoreWidth / 2, // Center horizontally
                this.height * MENU.GAMEOVER_SCORE.POSITION_Y,
                scoreWidth,
                scoreHeight
            );
            
            // Draw the score text overlaid on the image
            ctx.font = 'bold 24px Arial';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${Math.floor(this.finalScore)}`, 
                (this.width * 0.5 - scoreWidth / 2) + scoreWidth * 0.6, // Position text after "Score:" part of image
                this.height * MENU.GAMEOVER_SCORE.POSITION_Y + scoreHeight/2);
        } else {
            // Fallback to text if image isn't loaded
            ctx.font = '32px Arial';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.fillText(`Score: ${Math.floor(this.finalScore)}`, this.width * 0.5, this.height * 0.4);
        }
        
        // Update button properties
        this.startButton.text = 'Try Again';
        this.startButton.width = MENU.TRY_AGAIN.WIDTH;
        this.startButton.height = MENU.TRY_AGAIN.HEIGHT;
        this.startButton.x = this.width * 0.5 - this.startButton.width / 2; // Center horizontally
        this.startButton.y = this.height * MENU.TRY_AGAIN.POSITION_Y;
        
        // Draw button
        this.drawButton(ctx, this.startButton);
    }
    
    drawButton(ctx, button) {
        if (this.menuState === 'main' && this.buttonImage && this.buttonImage.complete) {
            // Draw the start button using its image
            ctx.drawImage(
                this.buttonImage,
                button.x,
                button.y,
                button.width,
                button.height
            );
        } else if (this.menuState === 'gameover' && this.tryAgainImage && this.tryAgainImage.complete) {
            // Draw the try again button using its image
            ctx.drawImage(
                this.tryAgainImage,
                button.x,
                button.y,
                button.width,
                button.height
            );
        } else {
            // Fallback to styled button
            ctx.fillStyle = '#4CAF50';
            ctx.fillRect(button.x, button.y, button.width, button.height);
            
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.strokeRect(button.x, button.y, button.width, button.height);
            
            ctx.font = 'bold 24px Arial';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(button.text, button.x + button.width / 2, button.y + button.height / 2);
        }
    }
}
