/**
 * Game constants
 */

// Canvas/Display
const CANVAS = {
    WIDTH: 1280,
    HEIGHT: 720
};

// Game physics and mechanics
const GAME = {
    GROUND_HEIGHT: 20,
    STARTING_SPEED: 1,
    SPEED_INCREMENT: 0.1,
    SPEED_INCREMENT_SCORE: 1000,
    SCORE_DIVIDER: 10
};

// Player constants
const PLAYER = {
    // Dimensions
    WIDTH: 200,
    HEIGHT: 200,
    
    // Positioning
    STARTING_X: 50,
    GROUND_OFFSET: 20,
    
    // Hitbox
    HITBOX_WIDTH_RATIO: 0.6,    // 60% of player width
    HITBOX_HEIGHT_RATIO: 0.7,   // 70% of player height
    HITBOX_X_OFFSET_DIVISOR: 2, // Centers hitbox horizontally
    HITBOX_Y_OFFSET_DIVISOR: 3, // Positions hitbox toward feet
    
    // Jump physics
    INITIAL_JUMP_POWER: -5,
    MAX_JUMP_POWER: -12,
    JUMP_CHARGE_RATE: 0.5,
    JUMP_BOOST_MULTIPLIER: 1.1,
    JUMP_BOOST_DELAY: 20,
    GRAVITY: 0.7,
    GRAVITY_REDUCTION: 0.9,     // For smoother jumps
    
    // Animation
    BASE_TICKS_PER_FRAME: 5,    // Base animation speed (higher = slower)
    MIN_TICKS_PER_FRAME: 2,     // Minimum animation speed (don't go too fast)
    ANIMATION_SPEED_FACTOR: 1.2, // How much game speed affects animation
    FRAMES: {
        IDLE: 1,
        RUNNING: 16,
        JUMPING: 1,
        IDLE_TO_RUNNING: 15
    }
};

// Obstacle constants
const OBSTACLE = {
    MIN_WIDTH: 30,
    MAX_WIDTH: 50,
    MIN_HEIGHT: 30,
    MAX_HEIGHT: 80,
    BASE_SPEED: -5,
    SPAWN_INTERVAL: 1500
};

// Background constants
const BACKGROUND = {
    FAR_SPEED: 0.5,    // Slowest layer (farthest)
    MID_SPEED: 1.5,    // Middle layer
    NEAR_SPEED: 3.0,   // Fastest layer (closest)
    OVERLAP: 5,        // Default overlap for most layers
    MID_OVERLAP: 1,   // Increased overlap for middle layer
    NEAR_OVERLAP: 1   // Even larger overlap for near layer to prevent stuttering
};

// Menu constants
const MENU = {
    BUTTON: {
        WIDTH: 400,
        HEIGHT: 150
    },
    GAMEOVER_BUTTON: {
        WIDTH: 200,
        HEIGHT: 80
    }
};
