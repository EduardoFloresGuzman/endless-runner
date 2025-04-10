/**
 * Manages UI elements for different game screens
 */
class UIManager {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.visible = true;
        this.currentScreen = 'main'; // 'main', 'gameOver'
        
        // Button areas for click detection
        this.buttons = [];
        this.finalScore = 0;
        
        console.log("UIManager initialized");
    }
    
    setupMainMenu() {
        this.currentScreen = 'main';
        this.buttons = [];
        
        // Add start game button
        this.buttons.push({
            id: 'startGame',
            x: this.width * 0.3,
            y: this.height * MENU.START_GAME_BUTTON.POSITION_Y,
            width: MENU.START_GAME_BUTTON.WIDTH,
            height: MENU.START_GAME_BUTTON.HEIGHT,
            text: 'Start Game'
        });
    }
    
    setupGameOver(finalScore) {
        this.currentScreen = 'gameOver';
        this.finalScore = finalScore;
        this.buttons = [];
        
        // Add try again button
        this.buttons.push({
            id: 'tryAgain',
            x: this.width * 0.5 - MENU.TRY_AGAIN.WIDTH / 2, // Center horizontally
            y: this.height * MENU.TRY_AGAIN.POSITION_Y,
            width: MENU.TRY_AGAIN.WIDTH,
            height: MENU.TRY_AGAIN.HEIGHT,
            text: 'Try Again'
        });
    }
    
    handleClick(x, y) {
        // Check if click is on any button
        for (const button of this.buttons) {
            if (x > button.x && x < button.x + button.width &&
                y > button.y && y < button.y + button.height) {
                return true; // Button was clicked
            }
        }
        return false;
    }
    
    draw(ctx) {
        // Semi-transparent overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, this.width, this.height);
        
        if (this.currentScreen === 'main') {
            this.drawMainMenu(ctx);
        } else if (this.currentScreen === 'gameOver') {
            this.drawGameOver(ctx);
        }
    }
    
    drawMainMenu(ctx) {
        // Draw title image
        if (ASSETS.isImageReady('title')) {
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
            // Fallback
            ctx.font = 'bold 64px Arial';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'left';
            ctx.fillText('Endless Runner', this.width * 0.2, this.height * 0.3);
        }
        
        // Draw start button
        this.drawButton(ctx, this.buttons[0]);
        
        // Draw player image on the right
        if (ASSETS.isImageReady('menuPlayer')) {
            const playerImg = ASSETS.getImage('menuPlayer');
            const originalWidth = playerImg.width || 566;
            const originalHeight = playerImg.height || 626;
            const maxHeight = this.height * 0.7;
            
            let imgWidth, imgHeight;
            if (originalHeight > maxHeight) {
                imgHeight = maxHeight;
                imgWidth = (originalWidth / originalHeight) * imgHeight;
            } else {
                imgWidth = originalWidth;
                imgHeight = originalHeight;
            }
            
            ctx.drawImage(
                playerImg,
                this.width * 0.6,
                this.height * 0.65 - imgHeight / 2,
                imgWidth,
                imgHeight
            );
        }
    }
    
    drawGameOver(ctx) {
        // Draw game over image
        if (ASSETS.isImageReady('gameOver')) {
            const gameOverHeight = this.height * MENU.GAMEOVER.HEIGHT_RATIO;
            const gameOverWidth = this.width * MENU.GAMEOVER.WIDTH_RATIO;
            
            ctx.drawImage(
                ASSETS.getImage('gameOver'),
                this.width * 0.5 - gameOverWidth / 2,
                this.height * MENU.GAMEOVER.POSITION_Y,
                gameOverWidth,
                gameOverHeight
            );
        } else {
            // Fallback
            ctx.font = 'bold 64px Arial';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.fillText('Game Over', this.width * 0.5, this.height * 0.3);
        }
        
        // Draw score
        if (ASSETS.isImageReady('scoreText')) {
            const scoreHeight = this.height * MENU.GAMEOVER_SCORE.HEIGHT_RATIO;
            const scoreWidth = this.width * MENU.GAMEOVER_SCORE.WIDTH_RATIO;
            
            ctx.drawImage(
                ASSETS.getImage('scoreText'),
                this.width * 0.5 - scoreWidth / 1.5,
                this.height * MENU.GAMEOVER_SCORE.POSITION_Y,
                scoreWidth,
                scoreHeight
            );
            
            ctx.font = 'bold 120px Arial';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${this.finalScore}`, 
                (this.width * 0.5 - scoreWidth / 3.5) + scoreWidth * 0.65,
                this.height * MENU.GAMEOVER_SCORE.POSITION_Y + scoreHeight / 1.75);
        } else {
            // Fallback
            ctx.font = '32px Arial';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.fillText(`Score: ${this.finalScore}`, this.width * 0.5, this.height * 0.4);
        }
        
        // Draw try again button
        this.drawButton(ctx, this.buttons[0]);
    }
    
    drawButton(ctx, button) {
        // Draw button based on current screen
        if (this.currentScreen === 'main' && ASSETS.isImageReady('startButton')) {
            ctx.drawImage(
                ASSETS.getImage('startButton'),
                button.x,
                button.y,
                button.width,
                button.height
            );
        } else if (this.currentScreen === 'gameOver' && ASSETS.isImageReady('tryAgainButton')) {
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
