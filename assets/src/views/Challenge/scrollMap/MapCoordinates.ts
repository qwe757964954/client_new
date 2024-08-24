import { Vec2 } from 'cc';

export class MapCoordinates {
    private static instance: MapCoordinates | null = null;
    private mapPoints: Map<number, Vec2[]> = new Map<number, Vec2[]>();

    // Private constructor to prevent instantiation
    private constructor() {
        this.initializeMapPoints();
    }

    // Method to get the single instance of the class
    public static getInstance(): MapCoordinates {
        if (!this.instance) {
            this.instance = new MapCoordinates();
        }
        return this.instance;
    }

    private initializeMapPoints(): void {
        this.mapPoints.set(1, [
            new Vec2(198, 250), new Vec2(377, 58), new Vec2(310, -131),
            new Vec2(450, -288), new Vec2(684, -266), new Vec2(878, -138),
            new Vec2(1106, -47), new Vec2(1347, -166), new Vec2(1594, -238),
            new Vec2(1718, -42), new Vec2(1582, 145), new Vec2(1983, 275)
        ]);

        this.mapPoints.set(2, [
            new Vec2(190, 55), new Vec2(391, 197), new Vec2(662, 209),
            new Vec2(810, 11), new Vec2(940, -179), new Vec2(1155, -308),
            new Vec2(1482, -318), new Vec2(1713, -207), new Vec2(1917, -42)
        ]);

        this.mapPoints.set(3, [
            new Vec2(198, 133), new Vec2(338, -64), new Vec2(534, -260),
            new Vec2(1013, -105), new Vec2(1275, 31), new Vec2(1502, -45),
            new Vec2(1772, 21), new Vec2(1947, 119)
        ]);

        this.mapPoints.set(4, [
            new Vec2(190, 243), new Vec2(309, 64), new Vec2(430, -127),
            new Vec2(622, -295), new Vec2(874, -178), new Vec2(1135, -62),
            new Vec2(1382, -176), new Vec2(1643, -191), new Vec2(1811, -23),
            new Vec2(1935, 150)
        ]);

        this.mapPoints.set(5, [
            new Vec2(221, 244), new Vec2(389, 96), new Vec2(302, -89),
            new Vec2(443, -289), new Vec2(715, -242), new Vec2(960, -100),
            new Vec2(1265, -61), new Vec2(1572, -257), new Vec2(1735, -8),
            new Vec2(1593, 151), new Vec2(1821, 287), new Vec2(2121, 266)
        ]);

        this.mapPoints.set(6, [
            new Vec2(221, 244), new Vec2(389, 96), new Vec2(302, -89),
            new Vec2(443, -289), new Vec2(715, -242), new Vec2(960, -100),
            new Vec2(1265, -61), new Vec2(1572, -257), new Vec2(1735, -8),
            new Vec2(1593, 151), new Vec2(1821, 287), new Vec2(2121, 266)
        ]);

        this.mapPoints.set(7, [
            new Vec2(221, 244), new Vec2(389, 96), new Vec2(302, -89),
            new Vec2(443, -289), new Vec2(715, -242), new Vec2(960, -100),
            new Vec2(1265, -61), new Vec2(1572, -257), new Vec2(1735, -8),
            new Vec2(1593, 151), new Vec2(1821, 287), new Vec2(2121, 266)
        ]);
    }

    public getCoordinates(id: number): Vec2[] | undefined {
        return this.mapPoints.get(id);
    }
}
