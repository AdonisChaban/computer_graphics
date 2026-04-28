import {Vec3} from "./vec.js"

// Matrix 4x4 Library
class Matrix4f
{
    #location_in_memory;
    #is_colunm_major;
    #elements;
    
	
    static #memory; 
    static #buffer_manager = 64; // index 0 is reserved
    static #memory_viewer; // will have acess to the first index matrix
    static #ptr_to_memory;
    static #instance; 
	
    /* ------------Function from fastmat4.wasm -----------*/
    
    /* 
	   param1: (i32 location of matrix A in memory)
	   param2: (i32 location of mattix B in memory)
	   result: A * B; where A is row major and B is colunm major
    */
    static Mul; 

	
    /*
      turns inputed matrix into the identity matrix
      param: (i32 location of matrix in memory)
    */
    static Iden; 
    
    static #Rotx; 
    
    static #Roty; 
    
    static #Rotz; 
    
    static #Transpose;
    
    static Translate; 

    static #moveTo;
    
    static #scalar;
    
    static #proj;
	

    /* --------------------------------------------------------*/
    
    /* 
       this is slow, and most likely will need improvements,
       since we call the init function and must wait for it
       to complete. This can be done faster if we implete a
       promise ourselves. That is work when performance drops
       due to waiting for compilation
       
    */
    static async bootUp() {
	try{
	    const obj = await WebAssembly.instantiateStreaming(fetch("fastmat4.wasm"));
	    console.log(obj);
	    Matrix4f.#instance = obj.instance.exports;
	    const wasmFuncs = obj.instance.exports;
	    Matrix4f.#ptr_to_memory = wasmFuncs.allocateF32Array(16);
	    Matrix4f.#memory_viewer = new Float32Array(wasmFuncs.memory.buffer, ptr, 16);
	    Matrix4f.Mul = wasmFuncs.matMul;
	    Matrix4f.#memory = wasmFuncs.memory;
	    Matrix4f.Iden = wasmFuncs.matIden;
	    Matrix4f.#Transpose = wasmFuncs.transposeMatrix;
	    Matrix4f.#moveTo = wasmFuncs.moveTo;
	    Matrix4f.#Rotz = wasmFuncs.rotz;
	    Matrix4f.#Roty = wasmFuncs.roty;
	    Matrix4f.#Rotx = wasmFuncs.rotx;
	    Matrix4f.#scalar = wasmFuncs.scalar;
	    Matrix4f.#proj = wasmFuncs.projection;
	} catch (e) {			
	    throw new Error(e);
	}	
    }
			    
    constructor()
    {
	//the 0 index contains a matrix for basic operations
	// for example, the rotation matrix will be in the
	// index 0 for the operation rotx. 
	this.#location_in_memory = Matrix4f.#buffer_manager;
	
	Matrix4f.#buffer_manager += 64; 
	
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
	this.is_colunm_major = true; // also row major, symmetric matrix
	this.#elements = new Float32Array(16); 
			
    }
	
    // try to use this minimally
    // there is perhaps a faster way of doing this;
    // will change when this library is in greater use.
    // https://github.com/WebAssembly/design/issues/1231 for assitence
    getData()
    {
	//console.log(Matrix4f.#memory);
	const data = new DataView(Matrix4f.#memory.buffer, this.#location_in_memory, 64);
	
	for(let i = 0; i < 64; i+=4)
	{
	    const value  = data.getFloat32(i,true);
	    //console.log(value); 			// for debugging
	    this.#elements[i/4] = value;			
	}
		
	return this.#elements; 
    }
	
    isColunmMajor()
    {
	return this.#is_colunm_major;
    }
	
    transpose()
    {
	Matrix4f.#Transpose(this.#location_in_memory, 0);
	//then move from 1 to this location
	Matrix4f.#moveTo(this.#location_in_memory);		
	this.is_colunm_major = !this.is_colunm_major;		
    }
	
    // angle in randians
    rotZ(angle)
    {
	const cosa = Math.cos(angle);
	const sina = Math.sin(angle);
	
	Matrix4f.#Rotz(this.#location_in_memory, sina, cosa);
		
    }
	
    // WebAssembly will have different implementation
    // can test to see if this is faster
    rotY(angle)
    {
	const cosa = Math.cos(angle);
	const sina = Math.sin(angle);
	
	Matrix4f.#Roty(this.#location_in_memory, sina, cosa);
		
    }
	
    rotX(angle)
    {
	const cosa = Math.cos(angle);
	const sina = Math.sin(angle);
		
	Matrix4f.#Rotx(this.#location_in_memory, sina, cosa);		
    }
	
    scalar(alpha)
    {
	    Matrix4f.#scalar(this.#location_in_memory, alpha);
    }
	
    projection(fovy, ascept, near, far)
    {
	fovy *= 0.5;
	const f = Math.cos(fovy)/Math.sin(fovy);
	
	Matrix4f.#proj(this.#location_in_memory, 1, ascept, near, far);		
    }

    // will construct a translation matrix
    translate(x,y,z)
    {

    }

    // do note that eye, at, and up are of type Vec3
    lookAt(eye, at, up)
    {
	let forward = Vec3(0, 0, 0);
	
	forward.minus(eye, at);
	forward.normalize();
	
	let left = forward.cross(up);
	left.normalize();
	
	let real_up = forward.cross(left);

	
	const transx = -1 * left.dot(eye);
	const transy = -1 * real_up.dot(eye);
	const transz = -1 * forward.dot(eye);

	const data = new Float32Array([
	    left.x, left.y, left.z, transx,
	    real_up.x, real_up.y, real_up.z, transy,
	    forward.x, forward.y, forward.z , transz,
	    0, 0, 0, 1]);

	Matrix4f.#memory_viewer = data;
	Matrix4f.#instance.processF32Array(Matrix4f.ptr_to_memory, 16);
	Matrix4f.Mul(0, this.#location_in_memory);
    }
}

// hello woorld

export {Matrix4f};
