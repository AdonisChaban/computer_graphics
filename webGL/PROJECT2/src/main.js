import {Matrix4f} from "../../lib/matrix.js"

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

// set the shader program here

let u_matrix = new Matrix4f();
