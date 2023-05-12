
export type AnimationCallback = (delta: number) => boolean;

export class Animator {
    private deltaTime = 0.0;
    private then = 0.0;
    private execCount = 0;
    private stop = false;

    animateUntil(callback: AnimationCallback, now: number | null = null){
        if(this.stop){
            this.stop = false;
            return;
        }

        if(now !== null){
            const nn = now * 0.001;
            this.deltaTime = nn - this.then;
            this.then = nn;
        }

        requestAnimationFrame((frame) => {

            if(!callback(this.deltaTime)){
                this.deltaTime = 0.0;
                this.then = 0.0;
                this.execCount = 0;
                return;
            }

            ++this.execCount;

            this.animateUntil(callback, frame);
        })
    }

    reset(){
        this.deltaTime = 0.0;
        this.then = 0.0;
        this.execCount = 0;
    }

    stopAnimation(){
        this.stop = true;
    }

    getCount(){
        return this.execCount;
    }


}