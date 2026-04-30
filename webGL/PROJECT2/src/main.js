import {Matrix4f} from "../../lib/matrix.js";
import {ShaderProgram} from "../../lib/shader.js";
import {Camera} from "../../lib/camera.js";

try
{
    await Matrix4f.bootUp();
} catch(e){
    throw new Error(e);
}

const vshader =
`#version 300 es

in vec4 a_position;
in vec3 a_colour;
out vec3 attr_colour;

void main(){
 gl_Position = a_position;
 attr_colour = a_colour;
}
`;

const fshader =
`#version 300 es

precision highp float;

in vec3 attr_colour;
out vec4 outColour;

void main(){
 outColour = vec4(attr_colour,1);
}

`;

const canvas = document.getElementById('webgl');

const gl = canvas.getContext('webgl2');
if(!gl){
    throw new Error("Couldn't load the context");
}

// set the shader program here3


let u_matrix = new Matrix4f();
const cube_shader = new ShaderProgram(gl, vshader, fshader);


// set attributes here
cube_shader.setAttribute("a_position");
cube_shader.setAttribute("a_colour");

// effienct? No! but good proof of concept
const vertices = [
    // pos      // colour
    -1,-1,1,    1,0,0, //red 
    1,-1,1,     1,0,0,
    1,1,1,      1,0,0,
    1,1,1,      1,0,0,
    -1,1,1,     1,0,0,
    -1,-1,1,    1,0,0,
    // end of front square
    -1,-1,-1,   0,0,1,// blue
    1,-1,-1,    0,0,1, 
    1,1,-1,     0,0,1,
    1,1,-1,     0,0,1,
    -1,1,-1,    0,0,1,
    -1,-1,-1,   0,0,1,
    // end of back
    1,-1,1,     0,1,0, // green
    1,-1,-1,    0,1,0,
    1,1,-1,     0,1,0,
    1,1,-1,     0,1,0,
    1,1,1,      0,1,0,
    1,-1,1,     0,1,0,
    // end of right
    -1,-1,1,    1,1,0, // yellow
    -1,-1,-1,   1,1,0,
    -1,1,-1,    1,1,0,
    -1,1,-1,    1,1,0,
    -1,1,1,     1,1,0,
    -1,-1,1,    1,1,0,
    // end of left
    -1,1,1,     1,0,1, // pink
    1,1,1,      1,0,1,
    1,1,-1,     1,0,1,
    1,1,-1,     1,0,1,
    -1,1,-1,    1,0,1,
    -1,1,1,     1,0,1,
    //end of top
    -1,-1,1,    0,1,1, // cyan
    1,-1,1,     0,1,1,
    1,-1,-1,    0,1,1,
    1,-1,-1,    0,1,1,
    -1,-1,-1,   0,1,1,
    -1,-1,1,    0,1,1
    // end of bottom
];


const vao = gl.createVertexArray();
gl.bindVertexArray(vao);
const u1 = cube_shader.attributes["a_position"];
const u2 = cube_shader.attributes["a_colour"];


const vbo = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);


gl.enableVertexAttribArray(u1);
let size = 3;
let type = gl.FLOAT;
let normalize = false;
let stride = 24;
let offset = 0;
gl.vertexAttribPointer(u1, size, type, normalize, stride, offset);

gl.enableVertexAttribArray(u2);
offset = 12;
gl.vertexAttribPointer(u2, size, type, normalize, stride, offset);


let then = 0;

requestAnimationFrame(drawScene);




function render(now)
{
    now *= 0.001;
    const deltaTime = now - then;
    then = now;

    drawScene();

    requestAnimationFrame(render);
    
}

function drawScene()
{
    gl.viewport(0,0,gl.canvas.width, gl.canvas.height);
    gl.clearColor(0,0,0,0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    cube_shader.use();
    gl.bindVertexArray(vao);


    const offset = 0;
    const count = 36;
    gl.drawArrays(gl.TRIANGLES, offset, count);
   
}

