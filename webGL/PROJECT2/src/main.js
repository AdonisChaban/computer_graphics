import {Matrix4f} from "../../lib/matrix.js";
import {ShaderProgram} from "../../lib/shader.js";
import {Camera} from "../../lib/camera.js";
import {Vec3} from "../../lib/vec.js";

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
uniform mat4 view;

void main(){
 gl_Position =  view * a_position;
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


let view_matrix = new Matrix4f();
const cube_shader = new ShaderProgram(gl, vshader, fshader);




// set attributes here
cube_shader.setAttribute("a_position");
cube_shader.setAttribute("a_colour");



// effienct? No! but good proof of concept
const vertices = [
    // pos      // colour
    -1, 1, 1,     1,0,0, //red 
    1, 1, 1,    1,0,0,
    -1, -1, 1,    1,0,0,
    -1, -1, 1,    1,0,0,
    1, 1, 1,    1,0,0,
    1, -1, 1,    1,0,0,
    // end of front square
    1, 1, -1,   0,0,1,// blue
    -1, 1, -1,   0,0,1, 
    -1, -1, -1,   0,0,1,
    -1, -1, -1,   0,0,1,
    1, -1, -1,   0,0,1,
    1, 1, -1,   0,0,1,
    // end of back
    -1, -1, -1,     0,1,0, // green
    -1, 1, -1,    0,1,0,
    -1, 1, 1,      0,1,0,
    -1, 1, 1,      0,1,0,
    -1, -1, 1,     0,1,0,
    -1, -1, -1,     0,1,0,
    // end of right
    1, 1, 1,   1,1,0, // yellow
    1, 1, -1,   1,1,0,
    1, -1, -1,   1,1,0,
    1, -1, -1,   1,1,0,
    1, -1, 1,   1,1,0,
    1, 1, 1,   1,1,0,
    // end of left
    -1, 1, 1,     1,0,1, // pink
    -1, 1, -1,    1,0,1,
    1, 1, -1,    1,0,1,
    1, 1, -1,    1,0,1,
    -1, 1, -1,    1,0,1,
    1, 1, 1,    1,0,1,
    //end of top
    -1, -1, 1,   0,1,1, // cyan
    1, -1, 1,   0,1,1,
    1, -1, -1,   0,1,1,
    1, -1, -1,   0,1,1,
    -1, -1, -1,   0,1,1,
    1, -1, 1,   0,1,1
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

let yaw = -90.0;
let pitch = 0.0;
let then = 0.0;
const sensitivity = 0.1;

canvas.addEventListener("mousemove", (e) => {    
    yaw += e.movementX * sensitivity;
    //  pitch += e.offsetY * sensitivity;

    console.log("here");

    console.log(yaw);
    console.log(pitch);
    
    if(yaw > 360) yaw -= 360;
    if(yaw < 0) yaw += 360;
});

requestAnimationFrame(render);



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

    view_matrix.setIden();
    let dir = new Vec3(0,0,0);
    const up = new Vec3(0,1,0);
    const eye = new Vec3(0,0,0);
    dir.x = Math.cos(yaw * Math.PI / 180) * Math.cos(pitch * Math.PI / 180);
    dir.y = Math.sin(pitch * Math.PI / 180);
    dir.z = Math.sin(yaw * Math.PI / 180) * Math.cos(pitch * Math.PI / 180); 
    dir.normalize();

    //console.log(dir);
    
    view_matrix.lookAt(eye,dir,up);

    
    cube_shader.use();
    cube_shader.setUniforms(view_matrix.elements); // pass in Float32Array
    gl.bindVertexArray(vao);

    //console.log(view_matrix.elements);

    const offset = 0;
    const count = 36;
    gl.drawArrays(gl.TRIANGLES, offset, count);
   
}




