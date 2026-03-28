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
"attribute vec4 position; \n" +
"uniform mat4 uMatrix;\n"
"void main(){\n" +
" gl_Position = uMatrix * position;\n" +
"}\n";

const fragmentShaderSource = 
"void main(){\n" +
"gl_Fragcolor = vec4(1.0,1.0,1.0,1.0);\n" +
"}\n";


const canvas = document.getElementById('webgl');

const gl = canvas.getContext("webgl");
if(!gl)
{
	throw new Error("Couldn't load the context");	
}

gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);


const shader_program = createShaderProgram(gl, createShader(gl, vertexShaderSource, gl.VERTEX_SHADER), createShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER));

// store all the info we'll ever need
const program_info = {
	program: shader_program,
	attib_locations: {
		vertex_position: gl.getAttribLocation(shader_program, "position"),
	},
	uniformLocations: {
		uMatrix: gl.getUniformLocation(shader_program, "uMatrix");		
	}	
};

const buffers = initBuffers(gl);

drawScene(gl, program_info, buffers);



function drawScene(gl, program_info, buffers)
{
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clearDepth(1.0);
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);
	
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	let u_matrix = new Matrix4f();
	const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
	const fov = (45 * Math.PI) / 180; // 45 degrees in randians
	u_matrix.projection(fov, ascept, 0.1, 100.0);
	
	
	//setPositionAttribute
	gl.bindVertexArray(buffers.vao);
	
	gl.useProgram(program_info.program);
	
	gl.uniformMatrix4fv(
	  program_info.uniformLocations.uMatrix,
	  false,
	  u_matrix.getData()
	  
	  gl.drawElements(gl.TRIANGLES, buffers.count, gl.UNSIGNED_SHORT, 0);
	);
	
	
}




