import { Mat4 } from "./math/mat4";
import {Vec3} from "./math/vec3";

export class RenderObject {
    private readonly positionBuffer: WebGLBuffer;
    // @ts-ignore
    private _colors: Float32Array;
    private vertexCount: number;
    public indexBuffer: WebGLBuffer | null = null;
    model = Mat4.identity();
    private scaleVal: number[] = [];
    uvBuffer: WebGLBuffer | null = null;

    constructor(gl: WebGLRenderingContext | null, vertices: Float32Array | null,
                colors: Float32Array | null, buf: WebGLBuffer | null = null, count: number | null = null, uvs: WebGLBuffer | null = null,
                ind: WebGLBuffer | null = null) {

        if(gl === null || vertices === null || colors === null){
            if(buf === null || count === null)
                throw new Error("failed to create object");
            this.positionBuffer = buf;
            this.vertexCount = count;
            this.uvBuffer = uvs;
            this.indexBuffer = ind;
            return;
        }

        this._colors = colors;
        const positionBuffer = gl.createBuffer();
        if(positionBuffer === null){
            throw new Error("failed to create position buffer");
        }



        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        this.positionBuffer = positionBuffer;
        this.vertexCount = vertices.length;
    }

    static withIndexBuffer(gl: WebGLRenderingContext | null, vertices: Float32Array | null,
                           colors: Float32Array | null, indices: Uint16Array): RenderObject {
        if(gl === null || vertices === null || colors === null)
            throw new Error("no gl");
        const ret = new RenderObject(gl, vertices, colors);
        const ebo = gl.createBuffer()

        if(ebo === null)
            throw new Error("Failed to create ebo");

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

        ret.indexBuffer = ebo;

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        ret.setVertexCount(indices.length);
        return ret;
    }

    addTexCoords(gl: WebGLRenderingContext, texCoords: number[]){
        this.uvBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
    }

    scale(x: number, y: number){
        if(this.scaleVal.length == 0){
            this.scaleVal.push(x);
            this.scaleVal.push(y);
        }else if(this.scaleVal.length == 2){
            this.scaleVal[0] *= x;
            this.scaleVal[1] *= y;
        }

        this.model = this.model.scale(new Vec3(x, y, 1));
    }

    getScale(){
        return new Float32Array(this.scaleVal);
    }

    static fromObject(o: RenderObject): RenderObject {
        return new RenderObject(null, null, null, o.getVBO(), o.getVertexCount(), o.uvBuffer, o.indexBuffer);
    }

    setVertexCount(count: number){
        this.vertexCount = count;
    }

    getVBO(){
        return this.positionBuffer;
    }

    getVertexCount(){
        return this.vertexCount;
    }
}