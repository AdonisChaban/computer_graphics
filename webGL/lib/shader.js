class ShaderProgram{
    // constructor from strach
    constructor(gl, vsource, fsource){
	// time to construct the program
	this.gl = gl;
	this.vshader = gl.createShader(gl.VERTEX_SHADER);
	this.fshader = gl.createShader(gl.FRAGMENT_SHADER);
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

    use()
    {
	this.gl.useProgram(this.program);
    }

    
}
