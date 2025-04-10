/**
 * Base class for all game entities
 */
class Entity {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.isActive = true;
    }
    
    update(deltaTime, gameSpeed) {
        // Override in child classes
    }
    
    draw(ctx) {
        // Override in child classes
    }
    
    getHitbox() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
    
    collidesWith(other) {
        const thisHitbox = this.getHitbox();
        const otherHitbox = other.getHitbox();
        
        return checkCollision(thisHitbox, otherHitbox);
    }
}
