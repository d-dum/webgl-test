
export type Dimensions = {
    width: number,
    height: number
};

export class ContextManager{

    private canvas: HTMLCanvasElement;
    private readonly gl: WebGLRenderingContext;
    constructor(width: number, height: number) {
        const canvas = document.querySelector('canvas');
        if(canvas === null)
            throw new Error("failed to find canvas element");
        this.canvas = canvas;
        this.canvas.height = height;
        this.canvas.width = width;

        const gl = canvas.getContext("webgl");
        if(gl === null)
            throw new Error("failed to create webgl context");

        this.gl = gl;

        this.canvas.addEventListener('resize', (ev) => {
            if(ev.view === null)
                return;
            this.onResize(ev.view.innerWidth, ev.view.innerHeight);
        });
        this.gl.viewport(0, 0, width, height);
    }

    setBackground(r: number, g: number, b: number, a: number){
        this.gl.clearColor(r, g, b, a);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }

    private onResize(width: number, height: number){
        console.log("RESIZED: ", width, height);
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }

    getDimensions(): Dimensions {
        return {
            width: this.canvas.width,
            height: this.canvas.height
        }
    }

    getContext(){
        return this.gl;
    }

    getCanvas(){
        return this.canvas;
    }
}