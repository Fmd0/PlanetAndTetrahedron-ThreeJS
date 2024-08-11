import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from "lil-gui";


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

renderer.setPixelRatio(window.devicePixelRatio);
camera.position.z = 50;
renderer.setClearColor(0x0E2255);

renderer.shadowMap.enabled = true;

const colors = [0x37BE95, 0xF3F3F3, 0x6549C0];
let planetGroup, particleGroup;
const gui = new GUI();


const addLight = () => {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 8);
    directionalLight.position.set(50, 25, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;
    directionalLight.shadow.camera.far = 100;
    directionalLight.shadow.camera.near = 50;
    directionalLight.shadow.mapSize.width = 1024*2;
    directionalLight.shadow.mapSize.height = 1024*2;
    scene.add(directionalLight);


    gui.add(directionalLight.position, "x").min(-50).max(50);
    gui.add(directionalLight.position, "y").min(-50).max(50);
    gui.add(directionalLight.position, "z").min(-50).max(50);
}

const addParticles = () => {
    particleGroup = new THREE.Group();
    scene.add(particleGroup);

    const particleGeometry = new THREE.TetrahedronGeometry(0.5, 0);

    for (let i = 0; i < 500; i++) {
        const particleMaterial = new THREE.MeshPhongMaterial({
            color: colors[Math.floor(Math.random()*3)],
            flatShading: true,
        })
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        particle.position.set(
            (Math.random() - 0.5)*80,
            (Math.random() - 0.5)*80,
            (Math.random() - 0.5)*80,
        )
        particle.updateMatrix();
        particle.matrixAutoUpdate = false;
        particleGroup.add(particle);
    }
}



const addPlanet = () => {
    planetGroup = new THREE.Group();
    planetGroup.rotation.x = Math.PI / 8;
    planetGroup.rotation.z = Math.PI / 60;
    scene.add(planetGroup);

    const planetMaterial = new THREE.MeshStandardMaterial({
        color: colors[0],
        flatShading: true,
        metalness: 0.5,
        roughness: 0.5,
    });
    const planetGeometry = new THREE.IcosahedronGeometry(10, 1);
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);
    planet.position.set(0,0,0);
    planet.castShadow = true;
    planet.receiveShadow = true;
    planetGroup.add(planet);


    const ringMaterial = new THREE.MeshStandardMaterial({
        color: colors[2],
        flatShading: true,
        metalness: 0.5,
        roughness: 0.5,
    });
    const ringGeometry = new THREE.TorusGeometry(15, 1.5, 10, 10);
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.position.set(0,0,0);
    ring.rotation.x = Math.PI * 0.5;
    ring.castShadow = true;
    ring.receiveShadow = true;
    planetGroup.add(ring);

    gui.add(planetMaterial, "metalness").min(0).max(1).step(0.01);
    gui.add(planetMaterial, "roughness").min(0).max(1).step(0.01);
    gui.add(ringMaterial, "metalness").min(0).max(1).step(0.01);
    gui.add(ringMaterial, "roughness").min(0).max(1).step(0.01);

}

addLight();
addPlanet();
addParticles();

// scene.add(new THREE.AxesHelper(200))
const orbitControls = new OrbitControls(camera, renderer.domElement);
// orbitControls.enableZoom = false;
orbitControls.enableDamping = true;


const clock = new THREE.Clock();
const update = () => {
    renderer.render(scene, camera);
    const elapsedTime = clock.getElapsedTime();
    planetGroup.rotation.y = 0.05*elapsedTime;
    particleGroup.rotation.x = 0.05*elapsedTime;
    particleGroup.rotation.y = 0.05*elapsedTime;
    orbitControls.update();
    window.requestAnimationFrame(update);
}
update()