/*
  simple vector, potentially will use
  webassembly, but I'll keep this simple.
*/

class Vec3{
    constructor(x,y,z)
    {
	this.x = x;
	this.y = y;
	this.z = z;
    }

    // parameters are vectors
    minus(to, from)
    {
	this.x = to.x - from.x;
	this.y = to.y - from.y;
	this.z = to.z - from.z; 
    }

    // dot product
    dot(other)
    {
	return this.x * other.x + this.y * other.y + this.z * other.z;
    }

    // normalize this vector
    normalize()
    {
	const mag = Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);

	this.x /= mag;
	this.y /= mag;
	this.z /= mag;
    }

    // other is of vec3
    cross(other)
    {
	const nx = this.y * other.z - this.z * other.y;
	const ny = this.z * other.x - this.x * other.z;
	const nz = this.x * other.y - this.y * other.x;
	return new Vec3(nx, ny, nz);
    }

    // a is a number
    scalar(a)
    {
	this.x *= a;
	this.y *= a;
	this.z *= a;
    }
}

class Vec4{
    constructor(x,y,z,w){
	this.x = x;
	this.y = y;
	this.z = z;
	this.w = w;
    }
}

export {Vec4};
