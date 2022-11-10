import * as THREE from "./three.js-r132/build/three.module.js";
export const  animator3D = (animatedObject) => {
        return new THREE.AnimationMixer(animatedObject);
        mixer.clipAction(animatedObject.animations[0]).play()
    }
