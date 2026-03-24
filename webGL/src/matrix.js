// Matrix 4x4 Library
// Matrix is major column 

class Matrix4f
{
    elements;
    
    constructor()
    {
	// creates the Identity Matrix
	this.elements = new Float32Array([1,0,0,0
					  ,0,1,0,0
					  ,0,0,1,0,
					  ,0,0,0,1]);
    }

    // rad is the degree in radians
    setRotateX(rad)
    {
	const temp  = new Float32Array([1,0,0,0,
					0, Math.cos(rad),Math.sin(rad),0,
					0, -Math.sin(rad),Math.cos(rad),0,
					0,0,0,1]);

	
    }

    setRotateY(rad)
    {
	const temp = new Float32Array([Math.cos(rad), 0, -Math.sin(rad), 0,
				       0,1,0,0,
				       Math.sin(rad), 0, Math.cos(rad), 0,
				       0,0,0,1]);
    }

    setTranslation(x,y,z)
    {
	this.elements = new Float32Array([])
    }

    mul()
    {
	
    }

}
