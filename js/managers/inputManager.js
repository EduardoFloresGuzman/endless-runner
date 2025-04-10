/**
 * Handles all user input and dispatches events to the current game state
 */
class InputManager {
    constructor(game) {
        this.game = game;
        this.canvas = game.canvas;
        
        // Track mouse/touch states
        this.isPressed = false;
        this.startPosition = { x: 0, y: 0 };
        this.currentPosition = { x: 0, y: 0 };
        
        // Set up event listeners
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Mouse events
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvas.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
        
        // Touch events for mobile
        this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
        this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
    }
    
    getCanvasCoordinates(event) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }
    
    handleMouseDown(event) {
        this.isPressed = true;
        this.startPosition = this.getCanvasCoordinates(event);
        this.currentPosition = { ...this.startPosition };
        
        // Forward event to current state
        if (this.game.stateManager.currentState) {
            this.game.stateManager.currentState.onInputDown(this.startPosition);
        }
    }
    
    handleMouseMove(event) {
        if (this.isPressed) {
            this.currentPosition = this.getCanvasCoordinates(event);
            
            // Forward event to current state
            if (this.game.stateManager.currentState) {
                this.game.stateManager.currentState.onInputMove(this.currentPosition);
            }
        }
    }
    
    handleMouseUp(event) {
        this.isPressed = false;
        this.currentPosition = this.getCanvasCoordinates(event);
        
        // Forward event to current state
        if (this.game.stateManager.currentState) {
            this.game.stateManager.currentState.onInputUp(this.currentPosition);
        }
    }
    
    handleMouseLeave() {
        if (this.isPressed) {
            this.isPressed = false;
            
            // Forward event to current state
            if (this.game.stateManager.currentState) {
                this.game.stateManager.currentState.onInputCancel();
            }
        }
    }
    
    // Touch event handlers
    handleTouchStart(event) {
        event.preventDefault();
        const touch = event.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        this.handleMouseDown(mouseEvent);
    }
    
    handleTouchMove(event) {
        event.preventDefault();
        const touch = event.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        this.handleMouseMove(mouseEvent);
    }
    
    handleTouchEnd(event) {
        event.preventDefault();
        this.handleMouseUp({
            clientX: this.currentPosition.x,
            clientY: this.currentPosition.y
        });
    }
}
