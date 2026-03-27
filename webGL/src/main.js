function main()
{
	await Matrix4f.init(); // potentially costly
	
    const canvas = document.getElementById('webgl');

    const gl = canvas.getContext("webgl");
    if(!gl)
    {
		console.log('Failed to get context!\n');
		return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}
