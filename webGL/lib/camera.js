/*
 this will be a singleton pattern
 there should be only one object
 of this class type. For now this
 will be a simple class
*/
class Camera {
    constructor(eye, up)
    {
	this.eye = eye;
	this.up = up;
    }
};

export {Camera};
