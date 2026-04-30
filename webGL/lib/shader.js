
class ShaderProgram{    
    constructor(gl, vsource, fsource){
	// shader attributes directly below
	this.gl = gl;
	this.vshader = gl.createShader(gl.VERTEX_SHADER);
	this.fshader = gl.createShader(gl.FRAGMENT_SHADER);
	this.attributes = new Object();
	gl.shaderSource(this.vshader, vsource);
	gl.compileShader(this.vshader);

	if(!gl.getShaderParameter(this.vshader, gl.COMPILE_STATUS)){
	    const info = gl.getShaderInfoLog(this.vshader);
	    throw new Error('Could not compile vertex shader: ' + info);
	}
	
	gl.shaderSource(this.fshader, fsource);
	gl.compileShader(this.fshader);

	if(!gl.getShaderParameter(this.fshader, gl.COMPILE_STATUS)){
	    const info = gl.getShaderInfoLog(this.fshader);
	    throw new Error('Could not compile fragment shader: ' + info);
	}

	
	// now we can compile the program
	this.program = gl.createProgram();
	gl.attachShader(this.program , this.vshader);
	gl.attachShader(this.program , this.fshader);
	gl.linkProgram(this.program);

	if(!gl.getProgramParameter(this.program, gl.LINK_STATUS)){
	    const info = gl.getProgramInfoLog(this.program);
	    throw new Error('Could not link shader programs: + info');
	}
	
    }

    get()
    {
	return this.program;
    }
    
    // throws an exception on error
    setAttribute(attribute_name)
    {
	this.attributes[attribute_name] = this.gl.getAttribLocation(this.program, attribute_name);	
    }

    use()
    {
	this.gl.useProgram(this.program);
    }
    
}

export {ShaderProgram};
