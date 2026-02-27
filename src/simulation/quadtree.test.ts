import { describe, it, expect } from 'vitest';
import { QuadTree } from './quadtree';
import type { Boid } from '../types/Boid';

// Helper function to create a test boid
function createTestBoid(id: string, x: number, y: number): Boid {
    return {
        id,
        position: { x, y },
        velocity: { x: 0, y: 0 },
        acceleration: { x: 0, y: 0 },
        colour: 'orange',
        maxSpeed: 1,
    };
}

describe('QuadTree', () => {
    describe('Constructor and Initialization', () => {
        it('should create a quadtree with given boundary and capacity', () => {
            const boundary = { xCoordinate: 0, yCoordinate: 0, width: 100, height: 100 };
            const tree = new QuadTree(boundary, 4);

            expect(tree.boundary).toEqual(boundary);
            expect(tree.capacity).toBe(4);
            expect(tree.capturedBoids).toEqual([]);
            expect(tree.divided).toBe(false);
        });
    });

    describe('Insert', () => {
        it('should insert a boid within the boundary', () => {
            const tree = new QuadTree({ xCoordinate: 0, yCoordinate: 0, width: 100, height: 100 }, 4);
            const boid = createTestBoid('1', 50, 50);

            const result = tree.insert(boid);

            expect(result).toBe(true);
            expect(tree.capturedBoids).toHaveLength(1);
            expect(tree.capturedBoids[0]).toBe(boid);
        });

        it('should not insert a boid outside the boundary', () => {
            const tree = new QuadTree({ xCoordinate: 0, yCoordinate: 0, width: 100, height: 100 }, 4);
            const boid = createTestBoid('1', 150, 150);

            const result = tree.insert(boid);

            expect(result).toBe(false);
            expect(tree.capturedBoids).toHaveLength(0);
        });

        it('should insert multiple boids up to capacity', () => {
            const tree = new QuadTree({ xCoordinate: 0, yCoordinate: 0, width: 100, height: 100 }, 4);
            const boid1 = createTestBoid('1', 25, 25);
            const boid2 = createTestBoid('2', 50, 50);
            const boid3 = createTestBoid('3', 75, 75);

            tree.insert(boid1);
            tree.insert(boid2);
            tree.insert(boid3);

            expect(tree.capturedBoids).toHaveLength(3);
            expect(tree.divided).toBe(false);
        });

        it('should subdivide when capacity is exceeded', () => {
            const tree = new QuadTree({ xCoordinate: 0, yCoordinate: 0, width: 100, height: 100 }, 4);
            
            // Insert up to capacity
            tree.insert(createTestBoid('1', 25, 25));
            tree.insert(createTestBoid('2', 50, 50));
            tree.insert(createTestBoid('3', 75, 25));
            tree.insert(createTestBoid('4', 25, 75));

            expect(tree.divided).toBe(false);
            expect(tree.capturedBoids).toHaveLength(4);

            // Insert one more to trigger subdivision
            tree.insert(createTestBoid('5', 75, 75));

            expect(tree.divided).toBe(true);
            expect(tree.capturedBoids).toHaveLength(0); // Should be cleared after subdivision
            expect(tree.northwest).not.toBeNull();
            expect(tree.northeast).not.toBeNull();
            expect(tree.southwest).not.toBeNull();
            expect(tree.southeast).not.toBeNull();
        });

        it('should insert the triggering boid after subdivision', () => {
            const tree = new QuadTree({ xCoordinate: 0, yCoordinate: 0, width: 100, height: 100 }, 2);
            
            tree.insert(createTestBoid('1', 25, 25));
            tree.insert(createTestBoid('2', 75, 75));
            
            // This should trigger subdivision and still be inserted
            const triggeringBoid = createTestBoid('3', 25, 75);
            const result = tree.insert(triggeringBoid);

            expect(result).toBe(true);
            expect(tree.divided).toBe(true);
            
            // Verify the boid was inserted into a child
            const query = tree.query({ xCoordinate: 20, yCoordinate: 70, width: 10, height: 10 });
            expect(query).toContainEqual(triggeringBoid);
        });
    });

    describe('Subdivide', () => {
        it('should create four child quadrants with correct boundaries', () => {
            const tree = new QuadTree({ xCoordinate: 0, yCoordinate: 0, width: 100, height: 100 }, 2);
            
            tree.insert(createTestBoid('1', 25, 25));
            tree.insert(createTestBoid('2', 75, 75));
            tree.insert(createTestBoid('3', 50, 50)); // Triggers subdivision

            expect(tree.northwest?.boundary).toEqual({ xCoordinate: 0, yCoordinate: 0, width: 50, height: 50 });
            expect(tree.northeast?.boundary).toEqual({ xCoordinate: 50, yCoordinate: 0, width: 50, height: 50 });
            expect(tree.southwest?.boundary).toEqual({ xCoordinate: 0, yCoordinate: 50, width: 50, height: 50 });
            expect(tree.southeast?.boundary).toEqual({ xCoordinate: 50, yCoordinate: 50, width: 50, height: 50 });
        });

        it('should redistribute existing boids to correct children', () => {
            const tree = new QuadTree({ xCoordinate: 0, yCoordinate: 0, width: 100, height: 100 }, 2);
            
            const nwBoid = createTestBoid('1', 25, 25);   // Northwest
            const seBoid = createTestBoid('2', 75, 75);   // Southeast
            
            tree.insert(nwBoid);
            tree.insert(seBoid);
            tree.insert(createTestBoid('3', 50, 50)); // Triggers subdivision

            // Check boids were distributed correctly
            expect(tree.northwest?.capturedBoids).toContainEqual(nwBoid);
            expect(tree.southeast?.capturedBoids).toContainEqual(seBoid);
        });
    });

    describe('Query', () => {
        it('should return empty array when no boids in range', () => {
            const tree = new QuadTree({ xCoordinate: 0, yCoordinate: 0, width: 100, height: 100 }, 4);
            tree.insert(createTestBoid('1', 10, 10));

            const result = tree.query({ xCoordinate: 80, yCoordinate: 80, width: 10, height: 10 });

            expect(result).toHaveLength(0);
        });

        it('should return boids within the query range', () => {
            const tree = new QuadTree({ xCoordinate: 0, yCoordinate: 0, width: 100, height: 100 }, 4);
            const boid1 = createTestBoid('1', 50, 50);
            const boid2 = createTestBoid('2', 55, 55);
            const boid3 = createTestBoid('3', 90, 90);

            tree.insert(boid1);
            tree.insert(boid2);
            tree.insert(boid3);

            const result = tree.query({ xCoordinate: 45, yCoordinate: 45, width: 15, height: 15 });

            expect(result).toHaveLength(2);
            expect(result).toContainEqual(boid1);
            expect(result).toContainEqual(boid2);
            expect(result).not.toContainEqual(boid3);
        });

        it('should query subdivided tree correctly', () => {
            const tree = new QuadTree({ xCoordinate: 0, yCoordinate: 0, width: 100, height: 100 }, 2);
            
            const boid1 = createTestBoid('1', 25, 25);   // NW
            const boid2 = createTestBoid('2', 75, 25);   // NE
            const boid3 = createTestBoid('3', 25, 75);   // SW
            const boid4 = createTestBoid('4', 75, 75);   // SE
            const boid5 = createTestBoid('5', 30, 30);   // NW (triggers subdivision)

            tree.insert(boid1);
            tree.insert(boid2);
            tree.insert(boid3);
            tree.insert(boid4);
            tree.insert(boid5);

            // Query northwest quadrant
            const result = tree.query({ xCoordinate: 20, yCoordinate: 20, width: 20, height: 20 });

            expect(result).toContainEqual(boid1);
            expect(result).toContainEqual(boid5);
            expect(result).not.toContainEqual(boid2);
            expect(result).not.toContainEqual(boid3);
            expect(result).not.toContainEqual(boid4);
        });

        it('should not query regions that do not intersect the range', () => {
            const tree = new QuadTree({ xCoordinate: 0, yCoordinate: 0, width: 100, height: 100 }, 2);
            
            // Insert boids to trigger subdivision
            tree.insert(createTestBoid('1', 10, 10));
            tree.insert(createTestBoid('2', 90, 90));
            tree.insert(createTestBoid('3', 15, 15));

            // Query far corner - should early return without checking all children
            const result = tree.query({ xCoordinate: 85, yCoordinate: 85, width: 10, height: 10 });

            expect(result).toHaveLength(1);
            expect(result[0].id).toBe('2');
        });
    });

    describe('Helper Methods', () => {
        describe('rectangleContainsVector', () => {
            it('should return true when point is inside rectangle', () => {
                const tree = new QuadTree({ xCoordinate: 0, yCoordinate: 0, width: 100, height: 100 }, 4);
                const rect = { xCoordinate: 0, yCoordinate: 0, width: 100, height: 100 };
                const point = { x: 50, y: 50 };

                expect(tree.rectangleContainsVector(rect, point)).toBe(true);
            });

            it('should return false when point is outside rectangle', () => {
                const tree = new QuadTree({ xCoordinate: 0, yCoordinate: 0, width: 100, height: 100 }, 4);
                const rect = { xCoordinate: 0, yCoordinate: 0, width: 100, height: 100 };
                const point = { x: 150, y: 150 };

                expect(tree.rectangleContainsVector(rect, point)).toBe(false);
            });

            it('should handle edge cases correctly', () => {
                const tree = new QuadTree({ xCoordinate: 0, yCoordinate: 0, width: 100, height: 100 }, 4);
                const rect = { xCoordinate: 0, yCoordinate: 0, width: 100, height: 100 };

                expect(tree.rectangleContainsVector(rect, { x: 0, y: 0 })).toBe(true);    // Top-left corner
                expect(tree.rectangleContainsVector(rect, { x: 99, y: 99 })).toBe(true);  // Inside
                expect(tree.rectangleContainsVector(rect, { x: 100, y: 100 })).toBe(false); // Outside (exclusive)
            });
        });

        describe('rectangleIntersectsRectangle', () => {
            it('should return true when rectangles overlap', () => {
                const tree = new QuadTree({ xCoordinate: 0, yCoordinate: 0, width: 100, height: 100 }, 4);
                const rect1 = { xCoordinate: 0, yCoordinate: 0, width: 50, height: 50 };
                const rect2 = { xCoordinate: 25, yCoordinate: 25, width: 50, height: 50 };

                expect(tree.rectangleIntersectsRectangle(rect1, rect2)).toBe(true);
            });

            it('should return false when rectangles do not overlap', () => {
                const tree = new QuadTree({ xCoordinate: 0, yCoordinate: 0, width: 100, height: 100 }, 4);
                const rect1 = { xCoordinate: 0, yCoordinate: 0, width: 50, height: 50 };
                const rect2 = { xCoordinate: 60, yCoordinate: 60, width: 50, height: 50 };

                expect(tree.rectangleIntersectsRectangle(rect1, rect2)).toBe(false);
            });

            it('should return true when one rectangle contains another', () => {
                const tree = new QuadTree({ xCoordinate: 0, yCoordinate: 0, width: 100, height: 100 }, 4);
                const rect1 = { xCoordinate: 0, yCoordinate: 0, width: 100, height: 100 };
                const rect2 = { xCoordinate: 25, yCoordinate: 25, width: 50, height: 50 };

                expect(tree.rectangleIntersectsRectangle(rect1, rect2)).toBe(true);
            });

            it('should return true when rectangles share an edge', () => {
                const tree = new QuadTree({ xCoordinate: 0, yCoordinate: 0, width: 100, height: 100 }, 4);
                const rect1 = { xCoordinate: 0, yCoordinate: 0, width: 50, height: 50 };
                const rect2 = { xCoordinate: 50, yCoordinate: 0, width: 50, height: 50 };

                expect(tree.rectangleIntersectsRectangle(rect1, rect2)).toBe(true); // Touching edges should intersect for queries
            });
        });
    });

    describe('Performance Characteristics', () => {
        it('should handle many boids efficiently with deep subdivision', () => {
            const tree = new QuadTree({ xCoordinate: 0, yCoordinate: 0, width: 800, height: 600 }, 4);
            
            // Insert 100 boids
            for (let i = 0; i < 100; i++) {
                const boid = createTestBoid(
                    `boid-${i}`,
                    Math.random() * 800,
                    Math.random() * 600
                );
                tree.insert(boid);
            }

            expect(tree.divided).toBe(true);
            
            // Query a small area - should return only nearby boids
            const result = tree.query({ xCoordinate: 400, yCoordinate: 300, width: 50, height: 50 });
            
            expect(result.length).toBeLessThan(100); // Should not return all boids
            expect(result.length).toBeGreaterThanOrEqual(0);
        });

        it('should handle clustered boids (worst case scenario)', () => {
            const tree = new QuadTree({ xCoordinate: 0, yCoordinate: 0, width: 100, height: 100 }, 4);
            
            // Insert many boids in the same small area
            for (let i = 0; i < 20; i++) {
                const boid = createTestBoid(
                    `boid-${i}`,
                    50 + Math.random() * 2, // Very small area
                    50 + Math.random() * 2
                );
                tree.insert(boid);
            }

            // Should still subdivide multiple levels
            expect(tree.divided).toBe(true);
            
            // Query should find all clustered boids
            const result = tree.query({ xCoordinate: 48, yCoordinate: 48, width: 6, height: 6 });
            expect(result.length).toBe(20);
        });
    });
});
