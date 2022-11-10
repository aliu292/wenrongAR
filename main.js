import {loadGLTF, loadOBJandMAT, loadOBJ, loadVideo, loadFBX} from "./libs/loader.js";
import { RGBAFormat } from "./libs/three.js-r132/build/three.module.js";
const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: './arTargets/targets.mind',
    });
    const {renderer, scene, camera} = mindarThree;

    const sunlight = new THREE.HemisphereLight( 0xFF0241 , 0x02D1FF, 1);
    scene.add(sunlight)


    const mistVid = await loadVideo('./videoEdits/Mist Ink.webm');
    const mistTexture = new THREE.VideoTexture(mistVid);
    mistTexture.format = THREE.RGBAFormat;

    const bgVid = await loadVideo('./videoEdits/BG Rise Alpha_1.webm');
    const bgTexture = new THREE.VideoTexture(bgVid);
    bgTexture.format = THREE.RGBAFormat;

    const planeGeo = new THREE.PlaneGeometry( 1, 748/600 );
//    const cylGeo = new THREE.CylinderGeometry( 0.3 , 0.3 , 1 , 16 , 1 , true);
    const mistMaterial = new THREE.MeshBasicMaterial({map: mistTexture, transparent: true});
    // const mistGeo = await loadOBJandMAT('./3D models/orgMesh.obj', mistMaterial);
    const mistGeo = await loadOBJ('./3D models/orgMesh.obj');
    mistGeo.children[0].material = mistMaterial;
    mistGeo.scale.set(0.02 ,0.02 , 0.02);
    // const mistPlane = new THREE.Mesh(mistGeo, mistMaterial);
    // mistPlane.scale.set(0.5,0.5,0.5);
    // mistPlane.position.set(0,0,0.5);
    // mistPlane.rotation.set(-0.6,0,0);
    
    const bgMaterial = new THREE.MeshBasicMaterial({map: bgTexture, transparent: true});
    const bgPlane = new THREE.Mesh(planeGeo, bgMaterial);
  
    const clouds = await loadFBX('./3D models/fbxcloud-atlas-v7-beach-hemisphere/source/Clouds_1000_2x2Half_sphere_anim.fbx');

    clouds.traverse((child) =>{
      if ('material' in child) {
         child.material.depthTest = true;
         child.material.depthWrite = false;
        //child.material.side = THREE.DoubleSide;
    }
    });
    clouds.scale.set(0.002,0.002,0.002);
    clouds.position.set(0,-1,2);
    clouds.rotation.set(0,0,0);
    console.log(clouds)

    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(mistGeo)
    // anchor.group.add(mistPlane);
    anchor.group.add(bgPlane);
    
    //animations
    const mixer = new THREE.AnimationMixer(clouds, scene);
    const action = mixer.clipAction(clouds.animations[0]);
    action.play();

    anchor.onTargetFound = () => {
      mistVid.play();
      bgVid.play();
      console.log('Found');
    }
    anchor.onTargetLost = () => {
      mistVid.pause();
      bgVid.pause();
      console.log('Lost');
    };

    const anchor2 = mindarThree.addAnchor(1);
    anchor2.group.add(clouds);
    // anchor2.group.add(sunlight);
    console.log(sunlight)


    const clock = new THREE.Clock();

    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      const delta = clock.getDelta();
      mixer.update(delta*2);
      renderer.render(scene, camera);
    });
  }
  start();
});
console.log('did it ');