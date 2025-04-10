/**
 * Loading screen system for the endless runner game
 * Displays a loading animation while assets are being loaded
 */
class LoadingScreen {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.progress = 0;
        this.displayProgress = 0; // Smooth progress display
        this.isComplete = false;
        this.fadeOut = false;
        this.opacity = 1.0;
        this.fadeSpeed = 0.01; // Slow fade speed for smooth transition
        
        // Logo/title for loading screen
        this.logoImage = new Image();
        this.logoImage.src = 'assets/menu/title.png';
        this.logoLoaded = false;
        this.logoImage.onload = () => {
            this.logoLoaded = true;
        };
        
        // Initialize with a tiny progress to show something immediately
        this.minProgress = 0.05;
        
        console.log("LoadingScreen initialized with black fade effect");
    }
    
    update() {
        // Update current loading progress from asset manager
        this.progress = Math.max(this.minProgress, ASSETS.getProgress());
        
        // Create a smoother visual effect by gradually increasing display progress
        if (this.displayProgress < this.progress) {
            this.displayProgress += 0.01; // Smooth animation
            if (this.displayProgress > this.progress) {
                this.displayProgress = this.progress;
            }
        }
        
        // Log progress for debugging
        if (Math.floor(this.progress * 100) % 20 === 0) { // Log every 20%
            console.log(`Loading progress: ${Math.floor(this.progress * 100)}%`);
            console.log(`Assets loaded: ${ASSETS.loadedAssets}/${ASSETS.totalAssets}`);
        }
        
        // If assets are loaded, start fade out animation
        if (this.progress >= 1 && !this.fadeOut) {
            console.log("All assets loaded, beginning black fade-out");
            setTimeout(() => {
                this.fadeOut = true;
            }, 500); // Delay before starting fade out
        }
        
        // Handle fade out animation - opacity decreases until transparent
        if (this.fadeOut) {
            this.opacity -= this.fadeSpeed;
            if (this.opacity <= 0) {
                this.opacity = 0;
                this.isComplete = true;
                console.log("Loading screen fade-out complete");
            }
        }
    }
    
    draw(ctx) {
        if (this.isComplete) return;
        
        // Save current context state
        ctx.save();
        
        // Black overlay with decreasing opacity
        ctx.fillStyle = `rgba(0, 0, 0, ${this.opacity})`;
        ctx.fillRect(0, 0, this.width, this.height);
        
        // Only draw UI elements if opacity is high enough to be visible
        if (this.opacity > 0.1) {
            // Draw logo if loaded - logo is still visible on black background
            if (this.logoLoaded) {
                ctx.globalAlpha = this.opacity;
                const logoWidth = this.width * 0.6;
                const logoHeight = logoWidth * (this.logoImage.height / this.logoImage.width);
                ctx.drawImage(
                    this.logoImage,
                    this.width / 2 - logoWidth / 2,
                    this.height * 0.25,
                    logoWidth,
                    logoHeight
                );
            }
            
            // Draw loading text - use light color for better visibility on black
            ctx.font = 'bold 24px Arial';
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.textAlign = 'center';
            ctx.fillText('Loading...', this.width / 2, this.height * 0.65);
            
            // Draw loading bar background
            const barWidth = this.width * 0.6;
            const barHeight = 20;
            const barX = this.width / 2 - barWidth / 2;
            const barY = this.height * 0.7;
            ctx.fillStyle = `rgba(50, 50, 50, ${this.opacity})`;
            ctx.fillRect(barX, barY, barWidth, barHeight);
            
            // Draw progress bar - use green color which works well on black
            ctx.fillStyle = `rgba(76, 175, 80, ${this.opacity})`;
            ctx.fillRect(barX, barY, barWidth * this.displayProgress, barHeight);
            
            // Draw loading percentage - use white text for black background
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.fillText(`${Math.floor(this.displayProgress * 100)}%`, this.width / 2, barY + barHeight + 30);
        }
        
        // Restore context state
        ctx.restore();
    }
}
