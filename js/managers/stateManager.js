/**
 * Manages game states and transitions between them
 */
class StateManager {
    constructor(game) {
        this.game = game;
        this.states = {};
        this.currentState = null;
    }
    
    registerState(name, state) {
        this.states[name] = state;
    }
    
    changeState(stateName, stateData = {}) {
        if (!this.states[stateName]) {
            console.error(`State ${stateName} doesn't exist`);
            return;
        }
        
        // Exit current state if it exists
        if (this.currentState) {
            this.currentState.exit();
        }
        
        // Change to new state
        this.currentState = this.states[stateName];
        this.currentState.enter(stateData);
        
        console.log(`Changed to state: ${stateName}`);
    }
    
    update(deltaTime) {
        if (this.currentState) {
            this.currentState.update(deltaTime);
        }
    }
    
    render(ctx) {
        if (this.currentState) {
            this.currentState.render(ctx);
        }
    }
}
