function initBuffers(gl)
{
	const position_buffer = initPositionBuffer(gl);
	
	return {
			position: position_buffer
	};	
}

function initPositionBuffer(gl)
{
	const position_buffer = gl.createBuffer();
	
	gl.bindBuffer(gl.Array_Buffer, position_buffer);
	
	// 3d coordinates
	const positions = [-1, -1, -1, 1, -1, -1, 0.5, 1, 0.5, 0.5, -1, 1];
	
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
	
	return position_buffer; 
	
}

export { initBuffers };