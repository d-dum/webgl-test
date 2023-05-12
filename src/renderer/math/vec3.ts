

export class Vec3 {
    constructor(public x: number, public y: number, public z: number) {}

    static create(): Vec3 {
        return new Vec3(0, 0, 0);
    }

    static sub(a: Vec3, b: Vec3): Vec3 {
        const out = Vec3.create();
        out.x = a.x - b.x;
        out.y = a.y - b.y;
        out.z = a.z - b.z;
        return out;
    }

    static normalize(a: Vec3): Vec3 {
        const out = Vec3.create();
        const l = a.length();
        if(l !== 0){
            out.x = a.x / l;
            out.y = a.y / l;
            out.z = a.z / l;
        }
        return out;
    }

    static cross(a: Vec3, b: Vec3): Vec3 {
        const out = Vec3.create();
        out.x = a.y * b.z - a.z * b.y;
        out.y = a.z * b.x - a.x * b.z;
        out.z = a.x * b.y - a.y * b.x;

        return out;
    }

    length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    static dot(a: Vec3, b: Vec3): number {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }

    raw(): number[] {
        return [this.x, this.y, this.z];
    }
}