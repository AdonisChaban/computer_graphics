function initBuffers(gl, vpos, tpos, sampler)
{
	/* const vertices = new Float32Array([
		-0.5, 0, -1.25, 
		0.5, 0, -1.25,
		0.5, 0, -1.75,
		-0.5, 0, -1.75,
		0, 1, -1.5
	]); */
	
	const vertices = new Float32Array([      
 		-0.5,-0.5,-0.5,//0
		0.5, -0.5,-0.5,//1
		0.5,-0.5,0.5,//2
		-0.5, -0.5, 0.5,//3
		0.0, 0.5, 0.0//4     
	]);
	
	
	const indices = new Uint16Array([
		//0,1,2, // base 
		//0,2,3, // base
		1,4,0, // front face
		2,4,1, // right face
		3,4,2, // back face
		3,0,4 // left face
	]);
	
	const tex_coords = new Float32Array([
		0.0, 0.0,
		1.0, 0.0,
		0.0, 0.0,
		1.0, 0.0,
		0.5, 1.0
	]); 
	
	// const indices = new Uint16Array([0,2,1]);
	
	const VAO = gl.createVertexArray();
	gl.bindVertexArray(VAO);
	
	
	const VBO = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);	
	gl.vertexAttribPointer
	(
		vpos,        // attribute location
		3,          // components per vertex (x, y, z)
		gl.FLOAT,   // data type
		false,      // normalize
		0,         // stride (bytes per vertex)
		0           // offset
	);
	gl.enableVertexAttribArray(vpos);
	
	const tex_buff = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, tex_buff);
	gl.bufferData(gl.ARRAY_BUFFER, tex_coords, gl.STATIC_DRAW);	
	gl.vertexAttribPointer(tpos, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(tpos);
	
	// Creating the texture object
	//initTextures(gl, sampler);
	const texture = gl.createTexture();
	const img = new Image();
	img.src=`../img/Dennis_mug_shoot_improved.jpg`;
	img.onload = () => {
		    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB, gl.UNSIGNED_BYTE, img);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
			gl.bindTexture(gl.TEXTURE_2D, null);
	};
	
	const EBO = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, EBO);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
	
	return {vao: VAO, ibo: EBO, count: indices.length, tex: texture};	
}


/* function initTextures(gl, sampler)
{
	const texture = gl.createTexture();	
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, texture);
	// fill texture with a 1x1 blue pixel.
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1,1,0, gl.RGBA, gl.UNSIGNED_BYTE,
		new Uint8Array([0,0,255,255]));
		
	const img = new Image();
	img.src=`../img/Dennis_mug_shoot_improved.jpg`;
	img.addEventListener('load', (() => {
		//gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE, img);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.uniform1i(sampler, 0);
	}));	
} */


export {initBuffers}
