import {loadGLTF, loadVideo} from "./libs/loader.js";
import { RGBAFormat } from "./libs/three.js-r132/build/three.module.js";
const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: './arTargets/targets.mind',
    });
    const {renderer, scene, camera} = mindarThree;

    const mistVid = await loadVideo('./videoEdits/Mist Ink AInc.webm');
    const mistTexture = new THREE.VideoTexture(mistVid);
    mistTexture.format = THREE.RGBAFormat;

    const bgVid = await loadVideo('./videoEdits/BG Rise Alpha_1.webm');
    const bgTexture = new THREE.VideoTexture(bgVid);
    bgTexture.format = THREE.RGBAFormat;

    const geometry = new THREE.PlaneGeometry(1, 748/600);
    const mistMaterial = new THREE.MeshBasicMaterial({map: mistTexture, transparent: true});
    const mistPlane = new THREE.Mesh(geometry, mistMaterial);
    mistPlane.scale.set(2,2,2);
    mistPlane.position.set(0,0,0.3);
    
    const bgMaterial = new THREE.MeshBasicMaterial({map: bgTexture, transparent: true});
    const bgPlane = new THREE.Mesh(geometry, bgMaterial);
  
    

    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(mistPlane);
    anchor.group.add(bgPlane)
    

    anchor.onTargetFound = () => {
      mistVid.play();
      console.log('Found');
    }
    anchor.onTargetLost = () => {
      mistVid.pause();
      console.log('Lost');
    };

    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  }
  start();
});
console.log('NEW');