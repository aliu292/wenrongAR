import {loadGLTF, loadOBJandMAT, loadOBJ, loadVideo} from "./libs/loader.js";
import { RGBAFormat } from "./libs/three.js-r132/build/three.module.js";
const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: './arTargets/targets.mind',
    });
    const {renderer, scene, camera} = mindarThree;

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
  
    

    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(mistGeo)
    // anchor.group.add(mistPlane);
    anchor.group.add(bgPlane);
    

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

    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  }
  start();
});
console.log('did it ');