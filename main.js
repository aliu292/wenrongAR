import {loadGLTF, loadOBJandMAT, loadOBJ, loadVideo, loadFBX} from "./libs/loader.js";
import { AnimationObjectGroup, RGBAFormat } from "./libs/three.js-r132/build/three.module.js";
import {animator3D} from "./libs/animator.js"
const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: './arTargets/targets.mind',
    });
    const {renderer, scene, camera} = mindarThree;

    const sunlight = new THREE.HemisphereLight( 0xFF0241 , 0x02D1FF, 1);
    // Generic Lighting
    //scene.add(sunlight)
    
    // Index 00 Chi Wild 氣韻山林

    const mistVid = await loadVideo('./videoEdits/Mist Ink.webm');
    const mistTexture = new THREE.VideoTexture(mistVid);
    mistTexture.format = THREE.RGBAFormat;

    const bgVid = await loadVideo('./videoEdits/BG Rise Alpha_1.webm');
    const bgTexture = new THREE.VideoTexture(bgVid);
    bgTexture.format = THREE.RGBAFormat;

    const planeGeo = new THREE.PlaneGeometry( 1, 748/600 );
    const mistMaterial = new THREE.MeshBasicMaterial({map: mistTexture, transparent: true});
  
    const mistGeo = await loadOBJ('./3D models/orgMesh.obj');
    mistGeo.children[0].material = mistMaterial;
    mistGeo.scale.set(0.02 ,0.02 , 0.02);

    
    const bgMaterial = new THREE.MeshBasicMaterial({map: bgTexture, transparent: true});
    const bgPlane = new THREE.Mesh(planeGeo, bgMaterial);

    const chiWildAnchor = mindarThree.addAnchor(0);
    chiWildAnchor.group.add(mistGeo)
    chiWildAnchor.group.add(bgPlane);
    
    chiWildAnchor.onTargetFound = () => {
      mistVid.play();
      bgVid.play();
      console.log('Found');
    }
    chiWildAnchor.onTargetLost = () => {
      mistVid.pause();
      bgVid.pause();
      console.log('Lost');
    };

    //---
    // Index 01 Cold Forest 寒林飄瑞雪

      const clouds = await loadFBX('./3D models/fbxcloud-atlas-v7-beach-hemisphere/source/Clouds_1000_2x2Half_sphere_anim.fbx');
      clouds.traverse((child) =>{
        if ('material' in child) {
          child.material.depthTest = true;
          child.material.depthWrite = false;
      }
      });
      clouds.scale.set(0.002,0.002,0.002);
      clouds.position.set(0,-1,2);
      clouds.rotation.set(0,0,0);
      //animations
      const cloudAnimationMixer = new THREE.AnimationMixer(clouds);
      cloudAnimationMixer.clipAction(clouds.animations[0]).play();
    
      const coldForestAnchor = mindarThree.addAnchor(1);
      coldForestAnchor.group.add(clouds);
      coldForestAnchor.group.add(sunlight);
    

    // Index 02 Empty Reverb 空谷回響

    // Index 03 Golden Spring 黃金泉
    const blackMaterial = new THREE.MeshBasicMaterial({color: 0x000000, opacity: 0 , transparent: true });
    const waterfall = await loadGLTF('./3D models/looping-waterfall-objects-animation/source/waterfall.gltf');
    waterfall.scene.scale.set(0.3 , 0.4 , 0.3
      );
    waterfall.scene.position.set(0, -3 , -0.2);
    waterfall.scene.rotation.set(0, -1.8 , 0);
    const zenRocks = await loadGLTF('./3D models/stylized_zen_stones/scene.gltf');
    zenRocks.scene.scale.set( 0.7 , 0.5, 0.7);
    zenRocks.scene.position.set( 0.2, -2.5, 1);
    console.log(zenRocks)
    zenRocks.scene.traverse((child) =>{
      if (child.isMesh) {
        child.material = blackMaterial;
      }
    });
    zenRocks.scene.renderOrder = -1;


    const waterfallAnimationMixer = new THREE.AnimationMixer(waterfall.scene);
    waterfallAnimationMixer.clipAction(waterfall.animations[0]).play();

    const goldenSpringAnchor = mindarThree.addAnchor(3);
    goldenSpringAnchor.group.add(waterfall.scene);
    goldenSpringAnchor.group.add(zenRocks.scene);
    goldenSpringAnchor.group.add(sunlight);

    // Index 04 Rainy Mountains 天山新雨

    // Index 05 Sunken Planet 沉默星球 

    const clock = new THREE.Clock();
  
    console.log(zenRocks.scene.children[0].rotation._y);
    // App init

    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      const delta = clock.getDelta();
      cloudAnimationMixer.update(delta*2);
      waterfallAnimationMixer.update(delta*0.3);
      zenRocks.scene.children[0].rotation.set(zenRocks.scene.children[0].rotation._x, zenRocks.scene.children[0].rotation._y, zenRocks.scene.children[0].rotation._z + delta*0.1) ;
      renderer.render(scene, camera);
    });
  }
  start();
});
console.log('did it ');