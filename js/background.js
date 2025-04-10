/**
 * Background management for endless runner game
 */
class Background {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        
        // Create background layers with different speeds
        this.layers = [
            // Far background (slowest)
            {
                speed: BACKGROUND.FAR_SPEED,
                x: 0,
                width: 0, // Will be set when we check image dimensions
                height: 0,
                overlap: BACKGROUND.OVERLAP,
                asset: 'bgFar'
            },
            // Mid background
            {
                speed: BACKGROUND.MID_SPEED,
                x: 0,
                width: 0,
                height: 0,
                overlap: BACKGROUND.MID_OVERLAP, // Use larger overlap for mid layer
                asset: 'bgMid'
            },
            // Near background (fastest)
            {
                speed: BACKGROUND.NEAR_SPEED,
                x: 0,
                width: 0,
                height: 0,
                overlap: BACKGROUND.NEAR_OVERLAP, // Use largest overlap for near layer
                asset: 'bgNear'
            }
        ];
        
        // Initialize layer dimensions from asset manager
        this.layers.forEach(layer => {
            if (ASSETS.isImageReady(layer.asset)) {
                const img = ASSETS.getImage(layer.asset);
                layer.width = img.width;
                layer.height = img.height;
            }
        });
    }
    
    update(gameSpeed) {
        // Update each layer's position
        this.layers.forEach(layer => {
            // Check if we have dimensions yet
            if (layer.width === 0 && ASSETS.isImageReady(layer.asset)) {
                const img = ASSETS.getImage(layer.asset);
                layer.width = img.width;
                layer.height = img.height;
            }
            
            if (layer.width === 0) return; // Skip if dimensions not available
            
            // Move the layer based on its speed and the game speed
            layer.x -= layer.speed * gameSpeed;
            
            // Improved wrap-around logic to avoid stuttering
            // Only reset when we've moved a full tile width past
            if (layer.x <= -layer.width + layer.overlap) {
                // Set back to exactly one overlap before zero
                layer.x += layer.width - layer.overlap;
            }
        });
    }
    
    draw(ctx) {
        // Draw each layer
        this.layers.forEach(layer => {
            if (layer.width === 0 || !ASSETS.isImageReady(layer.asset)) return; // Skip if not ready
            
            // We only need 3 instances max to cover the screen with overlap
            for (let i = 0; i < 3; i++) {
                const xPos = layer.x + (i * (layer.width - layer.overlap));
                
                // Only draw if visible on screen
                if (xPos < this.gameWidth && xPos + layer.width > 0) {
                    ctx.drawImage(
                        ASSETS.getImage(layer.asset),
                        xPos, 0,
                        layer.width, this.gameHeight
                    );
                }
            }
        });
    }
}
