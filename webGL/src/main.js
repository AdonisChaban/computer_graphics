import {Matrix4f} from "./matrix.js"
import {createShader, createShaderProgram} from "./shader.js"
import {initBuffers} from "./init-buffers.js"

try
{
  // not the best approach, as we are
  // waiting for it to load.
  await Matrix4f.bootUp();
} catch (e) 
{
  throw new Error(e);
}

const vertexShaderSource = 
`#version 300 es
in vec3 position;
in  vec2 a_texcoord;

out vec2 v_texcoord;
uniform mat4 uMatrix;

void main(void){ 
 gl_Position = uMatrix * vec4(position, 1.0);
 v_texcoord = a_texcoord; 
}`;

const fragmentShaderSource =
`#version 300 es
precision highp float;
in  vec2 v_texcoord;

uniform sampler2D u_sampler;
out vec4 colour;

void main(void){
	colour = texture(u_sampler, v_texcoord);
}`;


const canvas = document.getElementById('webgl');

const gl = canvas.getContext("webgl2");
if(!gl)
{
	throw new Error("Couldn't load the context");	
}

const shader_program = createShaderProgram(gl, createShader(gl, vertexShaderSource, gl.VERTEX_SHADER), createShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER));

let u_matrix = new Matrix4f();
//const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
//const fov = (45 * Math.PI) / 180; 
// u_matrix.projection(fov, aspect, 1, 5);

gl.enable(gl.CULL_FACE);

const vpos = gl.getAttribLocation(shader_program, "position");
const tpos = gl.getAttribLocation(shader_program, "a_texcoord");
const sampler = gl.getUniformLocation(shader_program, 'u_sampler');	

const buffers = initBuffers(gl, vpos, tpos, sampler);
const loc_uMatrix = gl.getUniformLocation(shader_program, "uMatrix");
let start;

requestAnimationFrame(render);


// drawScene(gl, shader_program, buffers, u_matrix, loc_uMatrix);


function drawScene()
{
	gl.clearColor(1.0, 1.0, 1.0, 1.0);	// background
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.viewport(0,0,gl.canvas.width,gl.canvas.height);
	// gl.enable(gl.CULL_FACE);
	// gl.useProgram(shader_program);	
	
	if(buffers.tex)
	{
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, buffers.tex);
		gl.uniform1i(sampler,0);	
	}
	
	//setPositionAttribute
	gl.bindVertexArray(buffers.vao);
	// gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.ibo);	
	gl.drawElements(gl.TRIANGLES, buffers.count, gl.UNSIGNED_SHORT, 0);		
}


function render(time)
{
	if (start === undefined)
	{
		start = time;
	}
	
	const elapsed = 0.001 * (time - start); // convert to seconds
	
	//start = time;
	
	u_matrix.rotY(elapsed);
	// console.log(u_matrix.getData());
	gl.useProgram(shader_program);
	
	gl.uniformMatrix4fv(loc_uMatrix, false, u_matrix.getData());
	
	drawScene();
	
	requestAnimationFrame(render);	
}
