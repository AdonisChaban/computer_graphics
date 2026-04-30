import {Vec3} from "./vec.js";

/*
 this will be a singleton pattern
 there should be only one object
 of this class type. For now this
 will be a simple class
*/
class Camera {
    // All parameters are of type vec3
    constructor(eye, up, look_at)
    {
	this.eye = eye;
	this.up = up;
	// point the camera is looking at
	this.look_at = look_at;
    }
};

export {Camera};
