/**
 * Ground entity for the endless runner game
 */
class Ground extends Entity {
    constructor(gameWidth, gameHeight) {
        super(0, gameHeight - GAME.GROUND_HEIGHT, gameWidth, GAME.GROUND_HEIGHT);
        
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.color = 'white';
        this.borderColor = '#f0f0f0';
        
        // Ground segments and gaps
        this.segments = [];
        this.segmentWidth = 200; // Width of each ground segment
        this.minGapWidth = 80;   // Minimum gap width
        this.maxGapWidth = 150;  // Maximum gap width
        this.scrollSpeed = 0;    // Will be updated from game speed
        
        // Initial setup of segments to cover the screen
        this.initSegments();
    }
    
    initSegments() {
        let x = 0;
        
        // Add segments to cover the initial screen plus some buffer
        while (x < this.gameWidth + this.segmentWidth * 2) {
            // Always start with a safe platform at the beginning
            if (x === 0) {
                // Create a safe starting platform
                this.segments.push({
                    x: x,
                    width: this.segmentWidth * 2,
                    isGap: false
                });
                x += this.segmentWidth * 2;
            } else {
                // Add a normal segment
                this.segments.push({
                    x: x,
                    width: this.segmentWidth,
                    isGap: false
                });
                x += this.segmentWidth;
                
                // Maybe add a gap after the segment (but not at the very start)
                // Only if gaps are enabled in debug settings
                if (DEBUG.GAPS_ENABLED && Math.random() < 0.4) { // 40% chance of a gap
                    const gapWidth = randomInt(this.minGapWidth, this.maxGapWidth);
                    this.segments.push({
                        x: x,
                        width: gapWidth,
                        isGap: true
                    });
                    x += gapWidth;
                }
            }
        }
    }
    
    update(gameSpeed) {
        this.scrollSpeed = OBSTACLE.BASE_SPEED * gameSpeed;
        
        // Move all segments to the left
        for (let i = 0; i < this.segments.length; i++) {
            this.segments[i].x += this.scrollSpeed;
        }
        
        // Remove segments that have gone off screen
        while (this.segments.length > 0 && this.segments[0].x + this.segments[0].width < 0) {
            this.segments.shift();
        }
        
        // Add new segments as needed
        this.generateNewSegments();
    }
    
    generateNewSegments() {
        // If the rightmost segment doesn't extend enough, add more segments
        if (this.segments.length > 0) {
            const lastSegment = this.segments[this.segments.length - 1];
            const lastX = lastSegment.x + lastSegment.width;
            
            if (lastX < this.gameWidth + this.segmentWidth * 2) {
                // Add a new segment
                const newSegmentX = lastX;
                
                this.segments.push({
                    x: newSegmentX,
                    width: this.segmentWidth,
                    isGap: false
                });
                
                // Maybe add a gap after this new segment (if gaps are enabled)
                if (DEBUG.GAPS_ENABLED && Math.random() < 0.4) { // 40% chance of a gap
                    const gapWidth = randomInt(this.minGapWidth, this.maxGapWidth);
                    this.segments.push({
                        x: newSegmentX + this.segmentWidth,
                        width: gapWidth,
                        isGap: true
                    });
                }
            }
        }
    }
    
    draw(ctx) {
        // Draw only the ground segments (not the gaps)
        ctx.fillStyle = this.color;
        
        this.segments.forEach(segment => {
            if (!segment.isGap) {
                ctx.fillRect(segment.x, this.y, segment.width, this.height);
                
                // Add subtle top border for each segment
                ctx.strokeStyle = this.borderColor;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(segment.x, this.y);
                ctx.lineTo(segment.x + segment.width, this.y);
                ctx.stroke();
            }
        });
        
        // Draw debug visualization for ground segments and gaps
        if (DEBUG.ENABLED) {
            this.drawDebugSegments(ctx);
        }
    }
    
    // Draw debug information for ground segments
    drawDebugSegments(ctx) {
        this.segments.forEach(segment => {
            if (segment.isGap) {
                // Draw gaps in red
                ctx.fillStyle = DEBUG.GAP_COLOR;
                ctx.fillRect(segment.x, this.y, segment.width, this.height);
                
                // Label gaps
                ctx.font = DEBUG.FONT;
                ctx.fillStyle = DEBUG.TEXT_COLOR;
                ctx.fillText('GAP', segment.x + segment.width/2 - 10, this.y + this.height/2);
            } else {
                // Draw ground segments in green
                ctx.strokeStyle = DEBUG.GROUND_SEGMENT_COLOR;
                ctx.strokeRect(segment.x, this.y, segment.width, this.height);
                
                // Add segment width label
                ctx.font = DEBUG.FONT;
                ctx.fillStyle = DEBUG.TEXT_COLOR;
                ctx.fillText(`${Math.floor(segment.width)}`, segment.x + 5, this.y + this.height/2);
            }
        });
    }
    
    isOverGap(playerX, playerWidth) {
        // Check if the player's position is over a gap
        // Use the center of the player for better accuracy
        const playerCenter = playerX + (playerWidth / 2);
        
        for (const segment of this.segments) {
            if (segment.isGap) {
                // Check if player's center is over this gap
                if (playerCenter >= segment.x && playerCenter <= segment.x + segment.width) {
                    return true;
                }
            }
        }
        
        return false;
    }
    
    // New method to check if a player is over solid ground
    isOverSolidGround(playerX, playerWidth) {
        // Check if player is over ANY solid ground segment
        const playerCenter = playerX + (playerWidth / 2);
        
        for (const segment of this.segments) {
            if (!segment.isGap) {
                if (playerCenter >= segment.x && playerCenter <= segment.x + segment.width) {
                    return true;
                }
            }
        }
        
        return false;
    }
    
    // Get the Y position where objects should rest on the ground
    getGroundYPosition(objectHeight) {
        return this.y - objectHeight;
    }
}
