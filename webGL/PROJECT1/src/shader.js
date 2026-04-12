

function createShader(gl, source_code, type)
{
	// compiles a Vertex or a Fragment shader
	const shader = gl.createShader(type);
	gl.shaderSource(shader, source_code);
	gl.compileShader(shader);
	
	if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
	{
		const info = gl.getShaderInfoLog(shader);
		gl.deleteShader(shader);
		console.error('Shit did not compile: ' + info );
		return null; 
	}
	
	return shader;	
}

function createShaderProgram(gl, vshader, fshader)
{
	const program = gl.createProgram();
	
	gl.attachShader(program, vshader);
	gl.attachShader(program, fshader);
	
	gl.linkProgram(program);
	
	if(!gl.getProgramParameter(program, gl.LINK_STATUS))
	{
		const info = gl.getProgramInfoLog(program);
		gl.deleteShader(fragment_shader);
		gl.deleteShader(vertex_shader);
		console.error(info);
		return null;		
	}
	
	return program;
}


export {createShader, createShaderProgram}