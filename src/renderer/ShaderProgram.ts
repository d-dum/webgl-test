
import { Color } from "./Renderer";

export class ShaderProgram {
    private readonly program: WebGLProgram;
    private gl: WebGLRenderingContext;
    private isActive: boolean = false;

    constructor(gl: WebGLRenderingContext, simple: boolean = false, color: Color = {r: 1.0, g: 0.0, b: 0.0, a: 1.0},
        vertexSource: string | null = null, fragmentSource: string | null = null) {

        const vSource: string = simple ? `
            attribute vec4 aVertexPosition;
            attribute vec2 uv_coords;
            
            uniform mat4 uModelMatrix;
            uniform mat4 uProjectionMatrix;
            uniform mat4 uViewMatrix;
            
            varying vec2 uv;
            
            void main() {
                uv = uv_coords;
                gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * aVertexPosition;
            }
        ` : `
            attribute vec4 aVertexPosition;
            
            uniform mat4 uModelMatrix;
            uniform mat4 uProjectionMatrix;
            uniform mat4 uViewMatrix;
            
            void main(){
                gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * aVertexPosition;
            }
        `;


        const fsSource: string = simple ? `
            precision mediump float;

            varying vec2 uv;
            uniform sampler2D uTexture;

            void main(){
                gl_FragColor = texture2D(uTexture, uv);
            }

         ` : `
            precision mediump float;

            void main(){
                gl_FragColor = vec4(${color.r}, ${color.g}, ${color.b}, ${color.a});
            }
        `;

        this.program = this.initShaderProgram(gl,
            vertexSource !== null? vertexSource : vSource,
            fragmentSource !== null? fragmentSource : fsSource);
        this.gl = gl;
    }

    private compileShader(gl: WebGLRenderingContext, source: string, shaderType: number): WebGLShader {
        const id = gl.createShader(shaderType);
        if(id === null)
            return -1;
        gl.shaderSource(id, source);
        gl.compileShader(id);
        const log = gl.getShaderInfoLog(id);

        if(!gl.getShaderParameter(id, gl.COMPILE_STATUS))
            console.error(log, source);

        return id;
    }

    private initShaderProgram(gl: WebGLRenderingContext, vert: string, frag: string): WebGLProgram {
        const v = this.compileShader(gl, vert, gl.VERTEX_SHADER);
        const f = this.compileShader(gl, frag, gl.FRAGMENT_SHADER);

        const program = gl.createProgram();
        if(program === null)
            throw new Error("failed to create program");
        gl.attachShader(program, v);
        gl.attachShader(program, f);
        gl.linkProgram(program);

        if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
            console.error(gl.getProgramInfoLog(program));
        }
        return program;
    }

    start(){
        this.isActive = true;
        this.gl.useProgram(this.program);
    }

    stop(){
        this.isActive = false;
        this.gl.useProgram(null);
    }

    getAttribLocation(attr: string){
        return this.gl.getAttribLocation(this.program, attr);
    }

    getUniformLocation(uniform: string) {
        return this.gl.getUniformLocation(this.program, uniform);
    }

    isProgramActive(){
        return this.isActive;
    }
}