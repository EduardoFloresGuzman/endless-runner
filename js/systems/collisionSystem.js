/**
 * System that handles collision detection between entities
 */
class CollisionSystem {
    constructor() {
        console.log("CollisionSystem initialized");
    }
    
    // Check player collision with obstacles
    checkCollision(player, obstacleManager) {
        return obstacleManager.checkCollision(player);
    }
    
    // Check collision between two entities
    checkEntityCollision(entityA, entityB) {
        return entityA.collidesWith(entityB);
    }
    
    // Check collision between an entity and an array of other entities
    checkEntityArrayCollision(entity, entities) {
        for (const other of entities) {
            if (entity !== other && entity.collidesWith(other)) {
                return other; // Return the entity that was collided with
            }
        }
        return null;
    }
}
