import {Vec3} from "./vec3";

export class Mat4 {
    constructor(public elements: number[][]) {}

    static identity(): Mat4 {
        return new Mat4([
           [1, 0, 0, 0],
           [0, 1, 0, 0],
           [0, 0, 1, 0],
           [0, 0, 0, 1]
        ]);
    }

    static mul(m1: Mat4, m2: Mat4): Mat4 {
        const result: number[][] = new Array(4).fill(0).map(() => new Array(4).fill(0));

        for(let i = 0; i < 4; i++){
            for(let j = 0; j < 4; j++){
                for(let k = 0; k < 4; k++){
                    result[i][j] += m1.elements[i][k] * m2.elements[k][j]
                }
            }
        }

        return new Mat4(result);
    }

    multiply(other: Mat4): Mat4 {
        return Mat4.mul(this, other);
    }

    static orthographic(left: number, right: number, bottom: number, top: number, near: number, far: number){
        const width = right - left;
        const height = top - bottom;
        const depth = far - near;
        const tx = -(right + left) / width;
        const ty = -(top + bottom) / height;
        const tz = -(far + near) / depth;

        return new Mat4([
           [2 / width, 0, 0, tx],
           [0, 2 / height, 0, ty],
           [0, 0, -2 / depth, tz],
           [0, 0, 0, 1]
        ]);
    }

    static lookAt(eye: Vec3, target: Vec3, up: Vec3): Mat4 {
        const zAxis = Vec3.normalize(Vec3.sub(eye, target));
        const xAxis = Vec3.normalize(Vec3.cross(up, zAxis));
        const yAxis = Vec3.normalize(Vec3.cross(zAxis, xAxis));

        return new Mat4([
           [xAxis.x, yAxis.x, zAxis.x, 0],
           [xAxis.y, yAxis.y, zAxis.y, 0],
            [xAxis.z, yAxis.z, zAxis.z, 0],
            [-Vec3.dot(xAxis, eye), -Vec3.dot(yAxis, eye), -Vec3.dot(zAxis, eye), 1]
        ]);
    }

    raw(): Float32Array {
        const buf: number[] = [];
        for(const a of this.elements){
            for(const el of a){
                buf.push(el);
            }
        }
        return new Float32Array(buf);
    }

    translate(a: Vec3): Mat4 {
        const translationMat = new Mat4([
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [a.x, a.y, a.z, 1]
        ]);

        return Mat4.mul(this, translationMat);
    }

    scale(a: Vec3): Mat4 {
        const scaleMat = new Mat4([
            [a.x, 0, 0, 0],
            [0, a.y, 0, 0],
            [0, 0, a.z, 0],
            [0, 0, 0, 1],
        ]);
        return Mat4.mul(this, scaleMat);
    }

    static rotate(angle: number, axis: Vec3): Mat4 {
        const rad = angle * (Math.PI / 180);
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        const x = axis.x;
        const y = axis.y;
        const z = axis.z;

        return new Mat4([
            [cos + x * x * (1 - cos), x * y * (1 - cos) - z * sin, x * z * (1 - cos) + y * sin, 0],
            [y * x * (1 - cos) + z * sin, cos + y * y * (1 - cos), y * z * (1 - cos) - x * sin, 0],
            [z * x * (1 - cos) - y * sin, z * y * (1 - cos) + x * sin, cos + z * z * (1 - cos), 0],
            [0, 0, 0, 1]
        ]);
    }


    scaleBottomTopFixedUp(scaleFactor: number): Mat4 {
        const scaleY = scaleFactor;
        const translationY = (1 - scaleY) / 2; // Amount to translate along the y-axis

        const scaleMat = new Mat4([
            [1, 0, 0, 0],
            [0, scaleY, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1],
        ]);
        const translationMat = new Mat4([
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, translationY, 0, 1],
        ]);

        // First translate the object so that the bottom part stays in place
        const translatedMat = Mat4.mul(this, translationMat);

        // Then apply the scale transformation
        const scaledMat = Mat4.mul(translatedMat, scaleMat);

        return scaledMat;
    }

    scaleTopBottomFixedDown(scaleFactor: number): Mat4 {
        const scaleY = scaleFactor;
        const translationY = (1 - scaleY) / 2; // Amount to translate along the y-axis

        const scaleMat = new Mat4([
            [1, 0, 0, 0],
            [0, scaleY, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1],
        ]);
        const translationMat = new Mat4([
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, -translationY, 0, 1],
        ]);

        // First translate the object so that the bottom part stays in place
        const translatedMat = Mat4.mul(this, translationMat);

        // Then apply the scale transformation
        const scaledMat = Mat4.mul(translatedMat, scaleMat);

        return scaledMat;
    }
}