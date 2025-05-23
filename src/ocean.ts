import * as THREE from 'three';
import { Water } from 'three/addons/objects/Water.js';
import { Sky } from 'three/addons/objects/Sky.js';

export const createOceanScene = (): THREE.Scene => {
    const scene = new THREE.Scene();
    let water: Water;
    let sun: THREE.Vector3 = new THREE.Vector3();

    init();

    function init(): void {
        createWater();
        createSky();
        updateSun();
        animate();
    }

    function createWater(): void {
        const waterGeometry: THREE.PlaneGeometry = new THREE.PlaneGeometry(1000, 1000);
        water = new Water(
            waterGeometry,
            {
                textureWidth: 512,
                textureHeight: 512,
                waterNormals: new THREE.TextureLoader().load('/public/img/Water_1_M_Normal.jpg', function (texture) {
                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                }),
                sunDirection: new THREE.Vector3(),
                sunColor: 0xffffff,
                waterColor: 0x001e0f,
                distortionScale: 0.1,
                fog: true,
                //fog: scene.fog !== undefined
            }
        );
        water.rotation.x = -Math.PI / 2;
        water.position.set(0, -0.10, 0);
        scene.add(water);
    }


    function createSky(): void {
        const sky: Sky = new Sky();
        sky.scale.setScalar(1000);
        scene.add(sky);

        const skyUniforms = sky.material.uniforms;
        skyUniforms['turbidity'].value = 10;
        skyUniforms['rayleigh'].value = 2;
        skyUniforms['mieCoefficient'].value = 0.005;
        skyUniforms['mieDirectionalG'].value = 0.2;
    }

    function updateSun(): void {
        const parameters: { elevation: number; azimuth: number } = {
            elevation: 0.1,
            azimuth: -93.5,
        };

        const phi: number = THREE.MathUtils.degToRad(90 - parameters.elevation);
        const theta: number = THREE.MathUtils.degToRad(parameters.azimuth);

        sun.setFromSphericalCoords(1, phi, theta);

        const sky = scene.children.find(child => child instanceof Sky) as Sky;
        if (sky) {
            sky.material.uniforms['sunPosition'].value.copy(sun);
        }
        water.material.uniforms['sunDirection'].value.copy(sun).normalize();
    }

    function animate(): void {
        requestAnimationFrame(animate);
        const time = performance.now() * 0.0005;
        water.material.uniforms['time'].value = time; // Use time directly for smooth animation
        // Any additional updates can go here
    }

    return scene;
};