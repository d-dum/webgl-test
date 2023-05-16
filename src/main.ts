import { ContextManager } from "./renderer/ContextManager"
import { RenderObject } from "./renderer/RenderObject";
import { Renderer } from "./renderer/Renderer";
import { ShaderProgram } from "./renderer/ShaderProgram";
import { Vec3 } from "./renderer/math/vec3";
import {Camera} from "./renderer/Camera";
import {convertCoordsFromWebgl} from "./renderer/Utils";
import {Texture} from "./renderer/Texture";
import {Animator} from "./renderer/Animator";

const Text = require('gl-text');


const manager = new ContextManager(640, 480);
const vertices = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];

const quadV = [
    -0.5, 0.5,
    -0.5, -0.5,
    0.5, -0.5,
    0.5, 0.5
];

const quadI = [
    0, 1, 3,
    3, 1, 2
];

const texCoords = [
    0.0, 0.0,
    0.0, 1.0,
    1.0, 1.0,
    1.0, 0.0
];

const quad = RenderObject.withIndexBuffer(manager.getContext(), new Float32Array(quadV), new Float32Array(), new Uint16Array(quadI));
quad.addTexCoords(manager.getContext(), texCoords);

const eye = new Vec3(0, 0, 1);
const target = new Vec3(0, 0, 0);
const up = new Vec3(0, 1, 0);

const cam = new Camera(eye, target, up, "uViewMatrix");
const program = new ShaderProgram(manager.getContext());
const renderer = new Renderer();

const linePos = [
    0, 0,
    1, 0,
];

// const line = new RenderObject(manager.getContext(), new Float32Array(linePos), new Float32Array());

// quad.model = quad.model.scale(new Vec3(0.2, 0.5, 1));

const text = new Text(manager.getContext());
console.log(convertCoordsFromWebgl(0, 0, manager))
text.update({
    position: convertCoordsFromWebgl(0, 0, manager),
    text: 'ABC',
    font: '16px Helvetica, sans-serif'
});



const button = document.querySelector("button");
if(button == null)
    throw new Error();

const texture = new Texture("http://localhost:8080/ddd.png", manager.getContext(), () => {
    const animator = new Animator();

    renderer.prepare(manager.getContext());
    text.render();
    program.start();
    renderer.render(quad, cam, program, manager.getContext(), false, 1, texture);
    program.stop();

    button.onclick = () => {
        animator.animateUntil((delta) => {
            if(animator.getCount() === 10)
                return false;

            setTimeout(() => {


                quad.model = quad.model.scaleUpTopFixed(1.1);

                renderer.prepare(manager.getContext());
                text.render();
                program.start();
                renderer.render(quad, cam, program, manager.getContext(), false, 1, texture);
                program.stop();
            }, 200);


            return true;
        });
    };

    button.innerText = "Click to animate";
});

