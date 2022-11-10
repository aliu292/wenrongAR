import {GLTFLoader} from "./three.js-r132/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "./three.js-r132/build/three.module.js";
import {OBJLoader} from "./three.js-r132/examples/jsm/loaders/OBJLoader.js";
import {FBXLoader} from "./three.js-r132/examples/jsm/loaders/FBXLoader.js";

//const THREE = window.MINDAR.IMAGE? window.MINDAR.IMAGE.THREE: window.MINDAR.FACE.THREE;

export const loadGLTF = (path) => {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(path, (gltf) => {
      resolve(gltf);
    });
  });
}

export const loadAudio = (path) => {
  return new Promise((resolve, reject) => {
    const loader = new THREE.AudioLoader();
    loader.load(path, (buffer) => {
      resolve(buffer);
    });
  });
}

export const loadVideo = (path) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    //video.addEventListener('loadeddata', () => {
    video.addEventListener('loadedmetadata', () => {
      video.setAttribute('playsinline', '');
      video.setAttribute('loop', true )
      resolve(video);
    });
    video.src = path;
  });
}

export const loadTexture = (path) => {
  return new Promise((resolve, reject) => {
    const loader = new THREE.TextureLoader();
    loader.load(path, (texture) => {
      resolve(texture);
    }); 
  });
}

export const loadTextures = (paths) => {
  const loader = new THREE.TextureLoader();
  const promises = [];
  for (let i = 0; i < paths.length; i++) {
    promises.push(new Promise((resolve, reject) => {
      loader.load(paths[i], (texture) => {
	resolve(texture);
      }); 
    }));
  }
  return Promise.all(promises);
};

export const loadOBJandMAT = (path, mat) => {
  return new Promise((resolve, reject) => {
    const loader = new OBJLoader();
    loader.load(path, (obj) => {
      obj.traverse((child) =>{
        if (child instanceof THREE.Mesh) {
          child.material = mat;
        }
      });
      resolve(obj);
    });
  });
};


export const loadOBJ = (path) => {
  return new Promise((resolve, reject) => {
    const loader = new OBJLoader();
    loader.load(path, (obj) => {
      resolve(obj);
    });
  });
};

export const loadFBX = (path) => {
  return new Promise((resolve, reject) => {
    const loader = new FBXLoader();
    loader.load(path, (obj) => {
      resolve(obj);
    });
  });
};