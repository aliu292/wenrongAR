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

    const video = await loadVideo('./videoEdits/Mist Ink Alpha_1_1.webm');
    const texture = new THREE.VideoTexture(video);
    texture.format = THREE.RGBAFormat;

    const geometry = new THREE.PlaneGeometry(1.5, 748/600*1.5);
    const material = new THREE.MeshBasicMaterial({map: texture, transparent: true});
    const plane = new THREE.Mesh(geometry, material);

    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(plane);

    anchor.onTargetFound = () => {
      video.play();
      console.log('Found');
    }
    anchor.onTargetLost = () => {
      video.pause();
      console.log('Lost');
    };

    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  }
  start();
});
console.log('DebI')