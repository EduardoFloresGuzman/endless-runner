/**
 * Player class for the endless runner game
 */
class Player {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        
        // Player dimensions
        this.width = PLAYER.WIDTH;
        this.height = PLAYER.HEIGHT;
        
        // Collision hitbox dimensions (smaller than visual size)
        this.hitboxWidth = this.width * PLAYER.HITBOX_WIDTH_RATIO;
        this.hitboxHeight = this.height * PLAYER.HITBOX_HEIGHT_RATIO;
        
        // Hitbox offset from player position
        this.hitboxOffsetX = (this.width - this.hitboxWidth) / PLAYER.HITBOX_X_OFFSET_DIVISOR;
        this.hitboxOffsetY = (this.height - this.hitboxHeight) / PLAYER.HITBOX_Y_OFFSET_DIVISOR;
        
        // Player position
        this.x = PLAYER.STARTING_X;
        this.y = this.gameHeight - this.height - PLAYER.GROUND_OFFSET;
        
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
        
        // Animation properties
        this.frameIndex = 0;
        this.tickCount = 0;
        this.ticksPerFrame = PLAYER.TICKS_PER_FRAME;
        this.totalFrames = {
            'idle': PLAYER.FRAMES.IDLE,
            'running': PLAYER.FRAMES.RUNNING,
            'jumping': PLAYER.FRAMES.JUMPING,
            'idle-to-running': PLAYER.FRAMES.IDLE_TO_RUNNING
        };
        
        // Load sprite images
        this.sprites = {
            'idle': [],
            'running': [],
            'jumping': [],
            'idle-to-running': []
        };
        
        this.loadSprites();
    }
    
    loadSprites() {
        // Load all frames for each animation type
        const states = ['idle', 'running', 'jumping', 'idle-to-running'];
        
        for (const state of states) {
            for (let i = 0; i < this.totalFrames[state]; i++) {
                const img = new Image();
                img.src = `assets/player/${state}/${i}.png`;
                this.sprites[state].push(img);
            }
        }
    }
    
    startJump() {
        if (!this.isJumping) {
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
        // Called when jump button is released
        this.isJumpButtonHeld = false;
        this.canChargeJump = false;
    }
    
    jump() {
        this.startJump();
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
            // For single-frame animations (idle and jumping), no need to advance frames
        }
    }
    
    update() {
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
            
            if (this.isJumping) {
                this.isJumping = false;
                // If we were jumping, transition to running
                if (this.state === 'jumping') {
                    this.setState('running');
                }
            }
        }
        
        // Set the correct animation state
        if (this.isJumping) {
            this.setState('jumping');
        } else if (this.state === 'idle' && this.isAlive) {
            // Transition from idle to running after a short delay
            this.setState('idle-to-running');
        }
        
        // Update animation frames
        this.updateAnimation();
    }
    
    // Get collision hitbox coordinates for collision detection
    getHitbox() {
        return {
            x: this.x + this.hitboxOffsetX,
            y: this.y + this.hitboxOffsetY,
            width: this.hitboxWidth,
            height: this.hitboxHeight
        };
    }
    
    draw(ctx) {
        // Get the current sprite frame
        const currentFrame = this.sprites[this.state][this.frameIndex];
        
        // Check if the image is loaded
        if (currentFrame && currentFrame.complete) {
            ctx.drawImage(
                currentFrame,
                this.x,
                this.y,
                this.width,
                this.height
            );
        } else {
            // Fallback to rectangle if image not loaded
            ctx.fillStyle = '#3498db';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        
        // Debugging: draw visual sprite boundary
        // ctx.strokeStyle = 'yellow';
        // ctx.lineWidth = 1;
        // ctx.strokeRect(this.x, this.y, this.width, this.height);
        
        // Debugging: draw hitbox
        // ctx.strokeStyle = 'red';
        // ctx.lineWidth = 2;
        // const hitbox = this.getHitbox();
        // ctx.strokeRect(hitbox.x, hitbox.y, hitbox.width, hitbox.height);
    }
}
