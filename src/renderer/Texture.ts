
type InternCall = () => void;

export class Texture {

    readonly id: WebGLTexture;

    private static isPowerOf2(value: number): boolean {
        return (value & (value - 1)) === 0;
    }

    constructor(src: string, gl: WebGLRenderingContext, onload: InternCall | undefined = undefined) {
        const texture = gl.createTexture();

        if(texture === null){
            throw new Error("Failed to create texture");
        }

        gl.bindTexture(gl.TEXTURE_2D, texture);

        const level = 0;
        const internalFormat = gl.RGBA;
        const width = 1;
        const height = 1;
        const border = 0;
        const srcFormat = gl.RGBA;
        const srcType = gl.UNSIGNED_BYTE;
        const pixel = new Uint8Array([0, 0, 255, 255]);

        gl.texImage2D(
            gl.TEXTURE_2D,
            level,
            internalFormat,
            width,
            height,
            border,
            srcFormat,
            srcType,
            pixel
        );

        const image = new Image();
        image.onload = () => {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(
                gl.TEXTURE_2D,
                level,
                internalFormat,
                srcFormat,
                srcType,
                image
            );

            if(Texture.isPowerOf2(image.width) && Texture.isPowerOf2(image.height)){
                gl.generateMipmap(gl.TEXTURE_2D);
            } else {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            }

            if(typeof onload !== "undefined"){
                onload();
            }
        }

        image.src = src;

        this.id = texture;

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    }

}