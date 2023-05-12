import { Mat4 } from "./math/mat4";
import { RenderObject } from "./RenderObject";
import { Camera } from "./Camera";
import { ShaderProgram } from "./ShaderProgram";
import {Texture} from "./Texture";

export class Renderer {
    proj: Mat4

    constructor() {
        this.proj = Mat4.orthographic(-1, 1, -1, 1, 0.1, 100.0);
    }

    prepare(gl: WebGLRenderingContext){
        gl.clearColor(0.0, 0.0, 1.0, 1.0);
        gl.clearDepth(1.0);
        gl.depthFunc(gl.LEQUAL);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }


    render(object: RenderObject, camera: Camera, program: ShaderProgram,
           gl: WebGLRenderingContext, line: boolean = false, lineWidth: number = 1, texture: Texture | null = null){


        if(object.uvBuffer !== null){
            const uvLocation = program.getAttribLocation("uv_coords");
            gl.bindBuffer(gl.ARRAY_BUFFER, object.uvBuffer);
            gl.vertexAttribPointer(uvLocation, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(uvLocation);
        }

        if(texture !== null){
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, texture.id);
            const samplerLocation = program.getUniformLocation("uTexture");
            gl.uniform1i(samplerLocation, 0);
        }

        const vertexLocation = program.getAttribLocation("aVertexPosition");
        gl.bindBuffer(gl.ARRAY_BUFFER, object.getVBO());
        gl.vertexAttribPointer(
            vertexLocation,
            2,
            gl.FLOAT,
            false,
            0,
            0
        );

        gl.enableVertexAttribArray(vertexLocation);

        const viewLocation = program.getUniformLocation(camera.uniform);
        const modelLocation = program.getUniformLocation("uModelMatrix");
        const projectionLocation = program.getUniformLocation("uProjectionMatrix");


        gl.uniformMatrix4fv(viewLocation, false, camera.view.raw());
        gl.uniformMatrix4fv(modelLocation, false, object.model.raw());
        gl.uniformMatrix4fv(projectionLocation, false, this.proj.raw());



        if(!line) {
            if(object.indexBuffer === null) {
                gl.lineWidth(lineWidth);
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, object.getVertexCount() / 2);
            } else{
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, object.indexBuffer);
                gl.drawElements(gl.TRIANGLES, object.getVertexCount(), gl.UNSIGNED_SHORT, 0);
            }

        } else {
            gl.lineWidth(lineWidth);
            gl.drawArrays(gl.LINES, 0, object.getVertexCount() / 2);
        }


        gl.disableVertexAttribArray(vertexLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        if(object.indexBuffer !== null)
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }


}