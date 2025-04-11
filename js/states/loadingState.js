/**
 * Loading state that shows the loading screen and handles asset loading
 */
class LoadingState extends BaseState {
    constructor(game) {
        super(game);
        
        this.width = game.canvas.width;
        this.height = game.canvas.height;
        this.progress = 0;
        this.displayProgress = 0;
        this.fadeOut = false;
        this.opacity = 1.0;
        this.fadeSpeed = 0.01;
        this.minProgress = 0.05; // Add this line to define the minimum progress
        
        // Logo/title for loading screen
        this.logoImage = new Image();
        this.logoImage.src = 'assets/menu/title.png';
        this.logoLoaded = false;
        this.logoImage.onload = () => {
            this.logoLoaded = true;
        };
    }
    
    enter() {
        console.log("Entering loading state");
        // Begin preloading assets
        preloadAssets();
        
        // Register the complete callback
        ASSETS.onAllLoaded(() => {
            console.log("All assets loaded successfully!");
        });
    }
    
    update(deltaTime) {
        // Update current loading progress from asset manager
        this.progress = Math.max(this.minProgress, ASSETS.getProgress());
        
        // Create a smoother visual effect
        if (this.displayProgress < this.progress) {
            this.displayProgress += 0.01;
            if (this.displayProgress > this.progress) {
                this.displayProgress = this.progress;
            }
        }
        
        // If assets are loaded, start fade out animation
        if (this.progress >= 1 && !this.fadeOut) {
            console.log("All assets loaded, beginning fade-out");
            setTimeout(() => {
                this.fadeOut = true;
            }, 500);
        }
        
        // Handle fade out animation
        if (this.fadeOut) {
            this.opacity -= this.fadeSpeed;
            if (this.opacity <= 0) {
                this.opacity = 0;
                console.log("Loading complete, switching to menu state");
                this.game.stateManager.changeState('menu');
            }
        }
    }
    
    render(ctx) {
        // Save current context state
        ctx.save();
        
        // Black overlay with decreasing opacity
        ctx.fillStyle = `rgba(0, 0, 0, ${this.opacity})`;
        ctx.fillRect(0, 0, this.width, this.height);
        
        // Only draw UI elements if opacity is high enough to be visible
        if (this.opacity > 0.1) {
            // Draw logo if loaded
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
            
            // Draw loading text
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
            
            // Draw progress bar
            ctx.fillStyle = `rgba(76, 175, 80, ${this.opacity})`;
            ctx.fillRect(barX, barY, barWidth * this.displayProgress, barHeight);
            
            // Draw loading percentage
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.fillText(`${Math.floor(this.displayProgress * 100)}%`, this.width / 2, barY + barHeight + 30);
        }
        
        // Restore context state
        ctx.restore();
    }
}
