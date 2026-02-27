import type {Boid} from "../types/Boid";
import type {Vector2D} from "../utils/vector";

interface Rectangle {
    xCoordinate: number;
    yCoordinate: number;
    width: number;
    height: number;
    
}

export class QuadTree {
    boundary: Rectangle;
    capacity: number;
    capturedBoids: Boid[] = [];
    divided: boolean = false;
    northwest: QuadTree | null = null;
    northeast: QuadTree | null = null;
    southwest: QuadTree | null = null;
    southeast: QuadTree | null = null;

    constructor(boundary: Rectangle, capacity: number) {
        this.boundary = boundary;
        this.capacity = capacity;
        
    }
    
    insert(boid: Boid): boolean {
        if(this.rectangleContainsVector(this.boundary, boid.position)) {
            if (this.capturedBoids.length < this.capacity) {
                this.capturedBoids.push(boid);
                return true;
            } else {
                if (!this.divided) {
                    this.subdivide();
                }
                // After subdivision (or if already divided), insert into appropriate child
                switch (true) {
                    case this.northwest && this.northwest.rectangleContainsVector(this.northwest.boundary, boid.position):
                        return this.northwest.insert(boid);
                    case this.northeast && this.northeast.rectangleContainsVector(this.northeast.boundary, boid.position):
                        return this.northeast.insert(boid);
                    case this.southwest && this.southwest.rectangleContainsVector(this.southwest.boundary, boid.position):
                        return this.southwest.insert(boid);
                    case this.southeast && this.southeast.rectangleContainsVector(this.southeast.boundary, boid.position):
                        return this.southeast.insert(boid);
                    default:
                        return false;
                }
            }
        }
        return false;
    }
    
    subdivide(): void {
        this.divided = true;
        this.northwest = new QuadTree({
            xCoordinate: this.boundary.xCoordinate,
            yCoordinate: this.boundary.yCoordinate,
            width: this.boundary.width / 2,
            height: this.boundary.height / 2,
        }, this.capacity);
        
         this.northeast = new QuadTree({
            xCoordinate: this.boundary.xCoordinate + this.boundary.width / 2,
            yCoordinate: this.boundary.yCoordinate,
            width: this.boundary.width / 2,
            height: this.boundary.height / 2,
        }, this.capacity);
         
         this.southwest = new QuadTree({
            xCoordinate: this.boundary.xCoordinate,
            yCoordinate: this.boundary.yCoordinate + this.boundary.height / 2,
            width: this.boundary.width / 2,
            height: this.boundary.height / 2,
        }, this.capacity);
        
         this.southeast = new QuadTree({
            xCoordinate: this.boundary.xCoordinate + this.boundary.width / 2,
            yCoordinate: this.boundary.yCoordinate + this.boundary.height / 2,
            width: this.boundary.width / 2,
            height: this.boundary.height / 2,
        }, this.capacity)
        
        for(const boid of this.capturedBoids)
        {
            switch (true) {
                case this.northwest.rectangleContainsVector(this.northwest.boundary, boid.position):
                    this.northwest.insert(boid)
                    break;
                case this.northeast.rectangleContainsVector(this.northeast.boundary, boid.position):
                    this.northeast.insert(boid)
                    break;
                case this.southwest.rectangleContainsVector(this.southwest.boundary, boid.position):
                    this.southwest.insert(boid)
                    break;
                case this.southeast.rectangleContainsVector(this.southeast.boundary, boid.position):
                    this.southeast.insert(boid)
                    break;
            }
        }
        this.capturedBoids = [];
    }
    
    query(range: Rectangle, found: Boid[] = []): Boid[] {
        if (!this.rectangleIntersectsRectangle(this.boundary, range)) return found;
        for(const boid of this.capturedBoids) {
             if (this.rectangleContainsVector(range, boid.position)) found.push(boid);
        }
        // recursively query children if divided
        if (this.divided) {
            void this.northwest?.query(range, found);
            void this.northeast?.query(range, found);
            void this.southwest?.query(range, found);
            void this.southeast?.query(range, found);
        }
        return found;
    }

    queryRadius(point: Vector2D, radius: number): Rectangle {
        return {
            xCoordinate: point.x - radius,
            yCoordinate: point.y - radius,
            width: radius * 2,
            height: radius * 2,
        }
    }
    
    rectangleContainsVector(rectangle: Rectangle, vector: Vector2D): boolean {
        return (
            vector.x >= rectangle.xCoordinate &&
            vector.x < rectangle.xCoordinate + rectangle.width &&
            vector.y >= rectangle.yCoordinate &&
            vector.y < rectangle.yCoordinate + rectangle.height
        );
    }
    
    rectangleIntersectsRectangle(rectA: Rectangle, rectB: Rectangle): boolean {
        return !(
            rectB.xCoordinate > rectA.xCoordinate + rectA.width ||
            rectB.xCoordinate + rectB.width < rectA.xCoordinate ||
            rectB.yCoordinate > rectA.yCoordinate + rectA.height ||
            rectB.yCoordinate + rectB.height < rectA.yCoordinate
        );
    }
    
}
