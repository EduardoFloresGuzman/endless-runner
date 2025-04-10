/**
 * System that handles scoring and score display
 */
class ScoreSystem {
    constructor() {
        this.score = 0;
        this.displayScore = 0;
        
        // Position for score display
        this.scorePosition = {
            x: 20,
            y: 40
        };
        
        console.log("ScoreSystem initialized");
    }
    
    reset() {
        this.score = 0;
        this.displayScore = 0;
    }
    
    updateScore(deltaTime) {
        // Increase score over time
        this.score += 1;
        
        // Smoothly update display score
        this.displayScore += (this.score - this.displayScore) * 0.1;
    }
    
    draw(ctx) {
        // Draw score on screen
        if (ASSETS.isImageReady('scoreText')) {
            // Calculate score image dimensions
            const scoreHeight = ctx.canvas.height * MENU.SCORE.HEIGHT_RATIO;
            const scoreWidth = ctx.canvas.width * MENU.SCORE.WIDTH_RATIO;
            
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
            ctx.fillText(`${Math.floor(this.displayScore / GAME.SCORE_DIVIDER)}`, 
                MENU.SCORE.POSITION_X + scoreWidth, 
                MENU.SCORE.POSITION_Y + scoreHeight / 1.7);
        } else {
            // Fallback to text if image isn't loaded
            ctx.font = 'bold 24px Arial';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'left';
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 3;
            
            const scoreText = `Score: ${Math.floor(this.displayScore / GAME.SCORE_DIVIDER)}`;
            ctx.strokeText(scoreText, this.scorePosition.x, this.scorePosition.y);
            ctx.fillText(scoreText, this.scorePosition.x, this.scorePosition.y);
        }
    }
    
    getFinalScore() {
        return Math.floor(this.score / GAME.SCORE_DIVIDER);
    }
}
