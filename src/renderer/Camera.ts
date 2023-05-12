import { Vec3 } from "./math/vec3";
import { Mat4 } from "./math/mat4";

export class Camera {
    view: Mat4;
    constructor(eye: Vec3, target: Vec3, up: Vec3, public uniform: string) {
        this.view = Mat4.lookAt(eye, target, up);
    }
}