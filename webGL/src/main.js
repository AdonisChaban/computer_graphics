import {Matrix4f} from "./matrix.js"
try
{
  // not the best approach, as we are
  // waiting for it to load.
  await Matrix4f.bootUp();
} catch (e) 
{
  throw new Error(e);
}


const canvas = document.getElementById('webgl');

const gl = canvas.getContext("webgl");
if(!gl)
{
	throw new Error("Couldn't load the context");	
}

gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);


const A = new Matrix4f();
const B = new Matrix4f();

A.rotZ(Math.PI);

A.getData();



