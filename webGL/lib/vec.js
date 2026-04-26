/*
  simple vector, potentially will use
  webassembly, but I'll keep this simple.
*/

class Vec4{
    constructor(x,y,z,w){
	this.x = x;
	this.y = y;
	this.z = z;
	this.w = w;
    }
}

export {Vec4};
