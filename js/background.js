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
                image: new Image(),
                speed: BACKGROUND.FAR_SPEED,
                x: 0,
                width: 0, // Will be set when image loads
                height: 0,
                overlap: BACKGROUND.OVERLAP
            },
            // Mid background
            {
                image: new Image(),
                speed: BACKGROUND.MID_SPEED,
                x: 0,
                width: 0,
                height: 0,
                overlap: BACKGROUND.MID_OVERLAP // Use larger overlap for mid layer
            },
            // Near background (fastest)
            {
                image: new Image(),
                speed: BACKGROUND.NEAR_SPEED,
                x: 0,
                width: 0,
                height: 0,
                overlap: BACKGROUND.NEAR_OVERLAP // Use largest overlap for near layer
            }
        ];
        
        // Load the images
        this.layers[0].image.src = 'assets/background/far.jpg';
        this.layers[1].image.src = 'assets/background/mid.png';
        this.layers[2].image.src = 'assets/background/ner.png'; // Fix: was using mid.png
        
        // Set dimensions when images load
        this.layers.forEach(layer => {
            layer.image.onload = () => {
                layer.width = layer.image.width;
                layer.height = layer.image.height;
            };
        });
    }
    
    update(gameSpeed) {
        // Update each layer's position
        this.layers.forEach(layer => {
            if (layer.width === 0) return; // Skip if image not loaded yet
            
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
            if (layer.width === 0) return; // Skip if image not loaded yet
            
            // We only need 3 instances max to cover the screen with overlap
            for (let i = 0; i < 3; i++) {
                const xPos = layer.x + (i * (layer.width - layer.overlap));
                
                // Only draw if visible on screen
                if (xPos < this.gameWidth && xPos + layer.width > 0) {
                    ctx.drawImage(
                        layer.image,
                        xPos, 0,
                        layer.width, this.gameHeight
                    );
                }
            }
        });
    }
}
