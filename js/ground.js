/**
 * Ground class for the endless runner game
 */
class Ground {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.height = GAME.GROUND_HEIGHT;
        this.y = this.gameHeight - this.height;
        this.color = 'white';
        this.borderColor = '#f0f0f0';
    }
    
    update() {
        // No updates needed for static ground in basic implementation
        // Could be extended for scrolling patterns or parallax effects
    }
    
    draw(ctx) {
        // Draw main ground fill
        ctx.fillStyle = this.color;
        ctx.fillRect(0, this.y, this.gameWidth, this.height);
        
        // Add subtle top border to enhance white appearance
        ctx.strokeStyle = this.borderColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, this.y);
        ctx.lineTo(this.gameWidth, this.y);
        ctx.stroke();
    }
    
    // Get the Y position where objects should rest on the ground
    getGroundYPosition(objectHeight) {
        return this.y - objectHeight;
    }
}
