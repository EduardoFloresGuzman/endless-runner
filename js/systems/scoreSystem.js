/**
 * System that handles scoring and score display
 */
class ScoreSystem {
    constructor() {
        this.score = 0;
        this.displayScore = 0;
        this.isScoreMultiplied = false;
        this.currentMultiplier = 1.0;
        this.scoreFlashTimer = 0;
        this.scoreFlashDuration = 0;
        
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
    
    /**
     * Add an immediate bonus to the score
     */
    addBonus(amount) {
        this.score += amount * 10; // Convert to internal score units
        this.scoreFlashTimer = 60; // Show visual feedback for 1 second (60 frames)
        this.scoreFlashDuration = 60;
    }
    
    updateScore(deltaTime, multiplier = 1.0) {
        // Remember if we're using a multiplier for visual effects
        this.isScoreMultiplied = multiplier > 1.0;
        this.currentMultiplier = multiplier;
        
        // Increase score over time, using the multiplier
        this.score += 1 * multiplier;
        
        // Decrease flash timer
        if (this.scoreFlashTimer > 0) {
            this.scoreFlashTimer--;
        }
        
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
            
            // Determine text color based on state
            if (this.isScoreMultiplied || this.scoreFlashTimer > 0) {
                // Pulsating bright color for multiplied score
                const flashIntensity = this.scoreFlashTimer > 0 ? 
                    Math.sin(this.scoreFlashTimer / this.scoreFlashDuration * Math.PI) :
                    Math.sin(Date.now() / 200) * 0.3 + 0.7;
                
                ctx.fillStyle = `rgba(255, 255, ${this.isScoreMultiplied ? 0 : 255}, ${flashIntensity})`;
                
                // Draw multiplier indicator if score is multiplied
                if (this.isScoreMultiplied) {
                    ctx.font = 'bold 22px Arial';
                    ctx.fillStyle = '#FFD700'; // Gold color
                    ctx.textAlign = 'left';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(`x${this.currentMultiplier.toFixed(1)}`, 
                        MENU.SCORE.POSITION_X + scoreWidth + 60, 
                        MENU.SCORE.POSITION_Y + scoreHeight / 1.7);
                }
            } else {
                ctx.fillStyle = 'white';
            }
            
            // Draw the score text overlaid on the image
            ctx.font = 'bold 32px Arial';
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
