/**
 * Player entity for the endless runner game
 */
class Player extends Entity {
    constructor(gameWidth, gameHeight) {
        // Initialize with default position and dimensions
        super(
            PLAYER.STARTING_X,
            gameHeight - PLAYER.HEIGHT - PLAYER.GROUND_OFFSET,
            PLAYER.WIDTH,
            PLAYER.HEIGHT
        );
        
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        
        // Collision hitbox dimensions (smaller than visual size)
        this.hitboxWidth = this.width * PLAYER.HITBOX_WIDTH_RATIO;
        this.hitboxHeight = this.height * PLAYER.HITBOX_HEIGHT_RATIO;
        
        // Hitbox offset from player position
        this.hitboxOffsetX = (this.width - this.hitboxWidth) / PLAYER.HITBOX_X_OFFSET_DIVISOR;
        this.hitboxOffsetY = (this.height - this.hitboxHeight) / PLAYER.HITBOX_Y_OFFSET_DIVISOR;
        
        // Player physics
        this.speed = 0;
        this.initialJumpPower = PLAYER.INITIAL_JUMP_POWER;
        this.maxJumpPower = PLAYER.MAX_JUMP_POWER;
        this.jumpChargeRate = PLAYER.JUMP_CHARGE_RATE;
        this.currentJumpPower = this.initialJumpPower;
        this.gravity = PLAYER.GRAVITY;
        this.isJumping = false;
        this.isJumpButtonHeld = false;
        this.canChargeJump = false;
        
        // Player state
        this.isAlive = true;
        this.state = 'idle';
        this.isFalling = false; // New state for falling into holes
        this.isFlying = false;  // New state for flying mode
        this.targetFlyY = 0;    // Target Y position when flying
        this.isExitingFlyMode = false; // Flag to track transition from flying to ground
        this.flySpeedMultiplier = 1.0; // Speed multiplier during fly mode
        this.flyScoreMultiplier = 1.0; // Score multiplier during fly mode
        
        // Animation properties
        this.frameIndex = 0;
        this.tickCount = 0;
        this.baseTicks = PLAYER.BASE_TICKS_PER_FRAME;
        this.ticksPerFrame = this.baseTicks;
        this.totalFrames = {
            'idle': PLAYER.FRAMES.IDLE,
            'running': PLAYER.FRAMES.RUNNING,
            'jumping': PLAYER.FRAMES.JUMPING,
            'idle-to-running': PLAYER.FRAMES.IDLE_TO_RUNNING,
            'falling': 1 // Single frame for falling animation
        };
    }
    
    // Override the base getHitbox method for more precise collision detection
    getHitbox() {
        return {
            x: this.x + this.hitboxOffsetX,
            y: this.y + this.hitboxOffsetY,
            width: this.hitboxWidth,
            height: this.hitboxHeight
        };
    }
    
    startJump() {
        // Prevent jumping if the player is falling into a hole
        if (!this.isJumping && !this.isFalling) {
            this.speed = this.initialJumpPower;
            this.isJumping = true;
            this.isJumpButtonHeld = true;
            this.canChargeJump = true;
            this.currentJumpPower = this.initialJumpPower;
            this.setState('jumping');
            
            // Add a small immediate boost for better feel
            setTimeout(() => {
                if (this.isJumping && this.isJumpButtonHeld && this.canChargeJump) {
                    this.speed = this.initialJumpPower * PLAYER.JUMP_BOOST_MULTIPLIER;
                }
            }, PLAYER.JUMP_BOOST_DELAY);
        }
    }
    
    continueJump() {
        // Only boost if we're in the initial jump phase, button is held, and we haven't reached max power
        if (this.isJumping && this.isJumpButtonHeld && this.canChargeJump && this.speed < 0) {
            // Increase jump power up to the maximum
            this.currentJumpPower -= this.jumpChargeRate;
            if (this.currentJumpPower < this.maxJumpPower) {
                this.currentJumpPower = this.maxJumpPower;
                this.canChargeJump = false; // We've hit the cap, no more charging
            }
            
            // Apply the current power
            this.speed = this.currentJumpPower;
        }
    }
    
    endJump() {
        this.isJumpButtonHeld = false;
        this.canChargeJump = false;
    }
    
    setState(state) {
        // Only change state if it's different
        if (this.state !== state) {
            this.state = state;
            this.frameIndex = 0;
            this.tickCount = 0;
        }
    }
    
    updateAnimation() {
        // Handle animation frame updates
        this.tickCount++;
        
        if (this.tickCount > this.ticksPerFrame) {
            this.tickCount = 0;
            
            // For animations with multiple frames, advance the frame
            if (this.totalFrames[this.state] > 1) {
                // Advance the frame
                if (this.frameIndex < this.totalFrames[this.state] - 1) {
                    this.frameIndex++;
                } else {
                    // Animation complete, handle state transitions
                    if (this.state === 'idle-to-running') {
                        this.setState('running');
                    } else if (this.state === 'running') {
                        // Loop running animation
                        this.frameIndex = 0;
                    }
                }
            }
        }
    }
    
    // Update animation speed based on game speed
    updateAnimationSpeed(gameSpeed) {
        // Only adjust animation speed when running (not when jumping or transitioning)
        if (this.state === 'running' && !this.isJumping) {
            // Reduce ticks per frame as game speed increases (faster animation)
            this.ticksPerFrame = Math.max(
                PLAYER.MIN_TICKS_PER_FRAME,
                Math.floor(this.baseTicks / (gameSpeed * PLAYER.ANIMATION_SPEED_FACTOR))
            );
        } else {
            // Reset to default speed for other animations
            this.ticksPerFrame = this.baseTicks;
        }
    }
    
    isOnGround() {
        // Check if player is on the ground (not jumping)
        return !this.isJumping && 
               !this.isFalling && 
               this.y >= this.gameHeight - this.height - GAME.GROUND_HEIGHT;
    }
    
    fall() {
        // Player is falling into a hole
        if (!this.isFalling) {
            this.isFalling = true;
            this.speed = 4; // Downward speed for falling
            this.setState('falling');
            
            // Disable jump ability when falling
            this.isJumpButtonHeld = false;
            this.canChargeJump = false;
        }
    }
    
    // New methods for flying functionality
    enterFlyMode(targetY) {
        if (this.isFalling) return; // Can't fly if falling into a hole
        
        this.isFlying = true;
        this.isJumping = false; // Cancel any ongoing jump
        this.targetFlyY = targetY - this.height/2; // Center player at target Y
        this.setState('jumping'); // Use jumping sprite for flying as requested
    }
    
    exitFlyMode() {
        if (!this.isFlying) return;
        
        this.isFlying = false;        // No longer in flying mode
        this.speed = 0;               // Reset speed before falling
        this.isExitingFlyMode = true; // Mark that we're in the transition state
    }
    
    update(gameSpeed = 1) {
        // Update animation speed based on game speed
        this.updateAnimationSpeed(gameSpeed * (this.isFlying ? this.flySpeedMultiplier : 1));
        
        // Special handling for falling into a hole
        if (this.isFalling) {
            this.y += this.speed; // Keep falling
            return; // Skip regular physics when falling into a hole
        }
        
        // Special handling for flying mode
        if (this.isFlying) {
            // Smoothly move towards target Y position
            const flySpeed = 10;
            const distance = this.targetFlyY - this.y;
            
            if (Math.abs(distance) > 1) {
                this.y += distance * 0.1; // Smooth approach to target
            } else {
                this.y = this.targetFlyY; // Snap to exact position when close
            }
            
            // Keep animation running while flying
            this.updateAnimation();
            return; // Skip regular physics when flying
        }
        
        // If jump button is held, continue increasing jump height
        if (this.isJumpButtonHeld) {
            this.continueJump();
        }
        
        // Apply gravity with a smooth factor based on upward/downward motion
        if (this.speed < 0) {
            // When moving upward, apply slightly less gravity for more hang time
            this.speed += this.gravity * PLAYER.GRAVITY_REDUCTION;
        } else {
            // When falling, apply normal gravity
            this.speed += this.gravity;
            // Once we start falling, we can't charge the jump anymore
            this.canChargeJump = false;
        }
        this.y += this.speed;
        
        // Check if landed on ground
        if (this.y > this.gameHeight - this.height - GAME.GROUND_HEIGHT) {
            this.y = this.gameHeight - this.height - GAME.GROUND_HEIGHT;
            this.speed = 0;
            
            // Handle landing after exiting fly mode
            if (this.isExitingFlyMode) {
                this.isExitingFlyMode = false;
                this.setState('running'); // Explicitly set to running when landing
            } else if (this.isJumping) {
                this.isJumping = false;
                // If we were jumping, transition to running
                if (this.state === 'jumping') {
                    this.setState('running');
                }
            }
        }
        
        // Set the correct animation state
        if (this.isJumping || this.isExitingFlyMode) {
            this.setState('jumping');  // Show jumping animation while falling
        } else if (this.state === 'idle' && this.isAlive) {
            // Transition from idle to running after a short delay
            this.setState('idle-to-running');
        }
        
        // Update animation frames
        this.updateAnimation();
    }
    
    draw(ctx) {
        // Get the appropriate asset key for the current frame
        const assetKey = `player_${this.state}_${this.frameIndex}`;
        
        // Check if the image is loaded in the asset manager
        if (ASSETS.isImageReady(assetKey)) {
            ctx.drawImage(
                ASSETS.getImage(assetKey),
                this.x,
                this.y,
                this.width,
                this.height
            );
        } else {
            // Fallback to rectangle if image isn't loaded
            ctx.fillStyle = '#3498db';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        
        // Draw debug hitbox if debug mode is enabled
        if (DEBUG.ENABLED && DEBUG.SHOW_HITBOXES) {
            this.drawHitbox(ctx);
            
            // Debug info about player state
            ctx.font = DEBUG.FONT;
            ctx.fillStyle = DEBUG.TEXT_COLOR;
            ctx.fillText(`X: ${Math.floor(this.x)}, Y: ${Math.floor(this.y)}`, this.x, this.y - 20);
            ctx.fillText(`Jumping: ${this.isJumping}, Falling: ${this.isFalling}`, this.x, this.y - 5);
        }
    }
    
    // Draw hitbox for debugging
    drawHitbox(ctx) {
        const hitbox = this.getHitbox();
        
        ctx.strokeStyle = DEBUG.HITBOX_COLOR;
        ctx.lineWidth = 2;
        ctx.strokeRect(hitbox.x, hitbox.y, hitbox.width, hitbox.height);
        
        // Fill hitbox with semi-transparent color
        ctx.fillStyle = DEBUG.HITBOX_COLOR;
        ctx.fillRect(hitbox.x, hitbox.y, hitbox.width, hitbox.height);
    }
}
