/**
 * Base class for all game states
 */
class BaseState {
    constructor(game) {
        this.game = game;
    }
    
    // Called when entering this state
    enter(data) {}
    
    // Called when exiting this state
    exit() {}
    
    // Update logic
    update(deltaTime) {}
    
    // Render logic
    render(ctx) {}
    
    // Input handlers
    onInputDown(position) {}
    onInputMove(position) {}
    onInputUp(position) {}
    onInputCancel() {}
}
