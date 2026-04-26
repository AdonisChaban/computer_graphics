import {Matrix4f} from "../../lib/matrix.js"
import {ShaderProgram} from "../../lib/shader.js"

try
{
    await Matrix4f.bootUp();
} catch(e){
    throw new Error(e);
}

const vshader = ``;

const fshader = ``;

const canvas = document.getElementByID('webgl');

const gl = canvas.getContext('webgl2');
if(!gl){
    throw new Error("Couldn't load the context");
}

// set the shader program here3


let u_matrix = new Matrix4f();

const base_shader = new ShaderProgram(gl, vshader, fshader);




function drawScene()
{
    
}

