
// Matrix 4x4 Library
class Matrix4f
{
	#location_in_memory;
	#is_colunm_major;
	#elements;
	
	const static #memory; 
	const static #buffer_manager = 64; // index 0 is reserved
	
	/* ------------Function from fastmat4.wasm -----------*/
	
	/* 
		param1: (i32 location of matrix A in memory)
		param2: (i32 location of mattix B in memory)
		result: A * B; where A is row major and B is colunm major
	*/
	const static Mul; 

	
	/*
		turns inputed matrix into the identity matrix
		param: (i32 location of matrix in memory)
	*/
	const static Iden; 
		
	const static #Rotx; 
	 
	const static #Roty; 
	
	const static #Rotz; 
	
	const static #Transpose;
	
	const static Translate; 

	const static #moveTo;
	

     /* --------------------------------------------------------*/
	
	/* 
		this is slow, and most likely will need improvements,
		since we call the init function and must wait for it
		to complete. This can be done faster if we implete a
		promise ourselves. That is work when performance drops
		due to waiting for compilation
	
	*/
	static async init()
	{
		WebAssembly.instantiateStreaming(fetch("fastmat4.wasm")).then((obj) => {
			Matrix4f.Mul = obj.exports.matMul;
			Matrix4f.memory = obj.exports.memory;
			Matrix4f.Iden = obj.exports.matIden;
			Matrix4f.#Transpose = obj.exports.transposeMatrix;
			Matrix4f.#moveTo = obj.exports.moveTo;
			Matrix4f.#Rotz = obj.exports.rotz;
			Matrix4f.#Roty = obj.exports.roty;
			Matrix4f.#Rotx = onj.exports.rotx;
		}).catch((err) => {
			console.log('issue with loading webassembly: ' + err);
		});			
	}
    
    constructor()
    {
		//the 0 index contains a matrix for basic operations
		// for example, the rotation matrix will be in the
		// index 0 for the operation rotx. 
		this.#location_in_memory =  buffer_manager
		
		buffer_manager += 64; 
		
		// there is a limit to memory 
		// the size of memory is a page (64kib)
		// I doubt there is a need for more memory
		// than this. 
		
		// we can have 64, 000 bytes / 64 bytes = 1000
		// one thousand matrices at a given time
		
		// perhaps for the future, we can manage
		// the case when we free a matrix. 
		// Use a free list to keep track of the empty
		// spots
	
		// creates the Identity Matrix (colunm row)
		Matrix4f.Iden(this.#location_in_memory);
		this.is_colunm_major = true; // also row major
		this.#elements = new Float32Array(16); 
			
    }
	
	// try to use this minimally
	getData()
	{
		const data = new Dataview(Matrix4f.memory);
		
		for(let i = 0; i < 16; i++)
		{
			const byteOffset = i * 4 + this.#location_in_memory;
			const value  = data.getFloat32(byteOffset);
			this.#elements[i] = value;			
		}
		
		return this.#elements; 
	}
	
	isColunmMajor()
	{
		return this.is_colunm_major;
	}
	
	// empty for now
	transpose()
	{
		Matrix4f.#Transpose(this.location_in_memory, 0);
		//then move from 1 to this location
		Matrix4f.#moveTo(this.location_in_memory);		
		this.is_colunm_major = !this.is_colunm_major;		
	}
	
	// angle in randians
	rotZ(angle)
	{
		const cosa = Math.cos(angle);
		const sina = Math.sin(angle);
		
		Matrix4f.#Rotz(this.location_in_memory, sina, cosa);
		
	}
	
	// WebAssembly will have different implementation
	// can test to see if this is faster
	rotY(angle)
	{
		const cosa = Math.cos(angle);
		const sina = Math.sin(angle);
		
		Matrix4f.#RotY(this.location_in_memory, sina, cosa);
		
	}
	
	rotX(angle)
	{
		const cosa = Math.cos(angle);
		const sina = Math.sin(angle);
		
		Matrix4f.#RotX(this.location_in_memory, sina, cosa);
		
	}

}
