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
        
        // Button areas for click detection
        this.startButton = {
            x: width * 0.3,
            y: height * MENU.START_GAME_BUTTON.POSITION_Y,
            width: MENU.START_GAME_BUTTON.WIDTH,  // Use constants directly
            height: MENU.START_GAME_BUTTON.HEIGHT,
            text: 'Start Game'
        };
        
        // Score tracking for game over screen
        this.finalScore = 0;
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
        if (ASSETS.isImageReady('scoreText')) {
            // Calculate score image dimensions
            const scoreHeight = this.height * MENU.SCORE.HEIGHT_RATIO;
            const scoreWidth = this.width * MENU.SCORE.WIDTH_RATIO;
            
            // Draw the score image
            ctx.drawImage(
                ASSETS.getImage('scoreText'),
                MENU.SCORE.POSITION_X,
                MENU.SCORE.POSITION_Y,
                scoreWidth,
                scoreHeight
            );
            
            // Draw the score text overlaid on the image
            ctx.font = 'bold 32px Arial';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${Math.floor(this.currentScore)}`, 
                MENU.SCORE.POSITION_X + scoreWidth, // Position text after "Score:" part of image
                MENU.SCORE.POSITION_Y + scoreHeight / 1.7); // Centered vertically
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
        if (ASSETS.isImageReady('title')) {
            // Calculate dimensions using both WIDTH_RATIO and HEIGHT_RATIO
            const titleHeight = this.height * MENU.TITLE.HEIGHT_RATIO;
            const titleWidth = this.width * MENU.TITLE.WIDTH_RATIO;
            
            ctx.drawImage(
                ASSETS.getImage('title'),
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
        if (ASSETS.isImageReady('menuPlayer')) {
            // Use original size or cap at a maximum height that fits well
            let imgWidth, imgHeight;
            const playerImg = ASSETS.getImage('menuPlayer');
            
            // Calculate dimensions that preserve aspect ratio
            const originalWidth = playerImg.width || 566;
            const originalHeight = playerImg.height || 626;
            const maxHeight = this.height * 0.7; // 70% of canvas height
            
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
                playerImg,
                this.width * 0.6, // Position on right side
                this.height * 0.65 - imgHeight / 2, // Centered vertically
                imgWidth,
                imgHeight
            );
        }
    }
    
    drawGameOver(ctx) {
        // Draw game over image instead of text
        if (ASSETS.isImageReady('gameOver')) {
            // Updated to use WIDTH_RATIO
            const gameOverHeight = this.height * MENU.GAMEOVER.HEIGHT_RATIO;
            const gameOverWidth = this.width * MENU.GAMEOVER.WIDTH_RATIO;
            
            ctx.drawImage(
                ASSETS.getImage('gameOver'),
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
        if (ASSETS.isImageReady('scoreText')) {
            // Calculate score image dimensions
            const scoreHeight = this.height * MENU.GAMEOVER_SCORE.HEIGHT_RATIO;
            const scoreWidth = this.width * MENU.GAMEOVER_SCORE.WIDTH_RATIO;
            
            // Draw the score image centered below game over text
            ctx.drawImage(
                ASSETS.getImage('scoreText'),
                this.width * 0.5 - scoreWidth / 1.5, // Center horizontally
                this.height * MENU.GAMEOVER_SCORE.POSITION_Y,
                scoreWidth,
                scoreHeight
            );
            
            // Draw the score text overlaid on the image
            ctx.font = 'bold 120px Arial';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${Math.floor(this.finalScore)}`, 
                (this.width * 0.5 - scoreWidth / 3.5) + scoreWidth * 0.65,
                this.height * MENU.GAMEOVER_SCORE.POSITION_Y + scoreHeight / 1.75);
        } else {
            // Fallback to text if image isn't loaded
            ctx.font = '32px Arial';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.fillText(`Score: ${Math.floor(this.finalScore)}`, this.width * 0.5, this.height * 0.4);
        }
        
        // Update button properties - removed commented out unused code
        this.startButton.width = MENU.TRY_AGAIN.WIDTH;
        this.startButton.height = MENU.TRY_AGAIN.HEIGHT;
        this.startButton.x = this.width * 0.5 - this.startButton.width / 2; // Center horizontally
        this.startButton.y = this.height * MENU.TRY_AGAIN.POSITION_Y;
        
        // Draw button
        this.drawButton(ctx, this.startButton);
    }
    
    drawButton(ctx, button) {
        if (this.menuState === 'main' && ASSETS.isImageReady('startButton')) {
            // Draw the start button using its image
            ctx.drawImage(
                ASSETS.getImage('startButton'),
                button.x,
                button.y,
                button.width,
                button.height
            );
        } else if (this.menuState === 'gameover' && ASSETS.isImageReady('tryAgainButton')) {
            // Draw the try again button using its image
            ctx.drawImage(
                ASSETS.getImage('tryAgainButton'),
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
