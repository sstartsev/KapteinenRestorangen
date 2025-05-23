"use strict";
exports.__esModule = true;
exports.createOceanScene = void 0;
var THREE = require("three");
var Water_js_1 = require("three/addons/objects/Water.js");
var Sky_js_1 = require("three/addons/objects/Sky.js");
exports.createOceanScene = function () {
    var scene = new THREE.Scene();
    var water;
    var sun = new THREE.Vector3();
    init();
    function init() {
        createWater();
        createSky();
        updateSun();
        animate();
    }
    function createWater() {
        var waterGeometry = new THREE.PlaneGeometry(1000, 1000);
        water = new Water_js_1.Water(waterGeometry, {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: new THREE.TextureLoader().load('/public/img/Water_1_M_Normal.jpg', function (texture) {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            }),
            sunDirection: new THREE.Vector3(),
            sunColor: 0xffffff,
            waterColor: 0x001e0f,
            distortionScale: 0.1,
            fog: true
        });
        water.rotation.x = -Math.PI / 2;
        water.position.set(0, -0.10, 0);
        scene.add(water);
    }
    function createSky() {
        var sky = new Sky_js_1.Sky();
        sky.scale.setScalar(1000);
        scene.add(sky);
        var skyUniforms = sky.material.uniforms;
        skyUniforms['turbidity'].value = 10;
        skyUniforms['rayleigh'].value = 2;
        skyUniforms['mieCoefficient'].value = 0.005;
        skyUniforms['mieDirectionalG'].value = 0.2;
    }
    function updateSun() {
        var parameters = {
            elevation: 0.1,
            azimuth: -93.5
        };
        var phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
        var theta = THREE.MathUtils.degToRad(parameters.azimuth);
        sun.setFromSphericalCoords(1, phi, theta);
        var sky = scene.children.find(function (child) { return child instanceof Sky_js_1.Sky; });
        if (sky) {
            sky.material.uniforms['sunPosition'].value.copy(sun);
        }
        water.material.uniforms['sunDirection'].value.copy(sun).normalize();
    }
    function animate() {
        requestAnimationFrame(animate);
        var time = performance.now() * 0.0005;
        water.material.uniforms['time'].value = time; // Use time directly for smooth animation
        // Any additional updates can go here
    }
    return scene;
};
