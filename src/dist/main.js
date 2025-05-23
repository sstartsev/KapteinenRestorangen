"use strict";
exports.__esModule = true;
require("./style.css");
var three_1 = require("three");
var stats_module_js_1 = require("three/addons/libs/stats.module.js");
var Game_1 = require("./Game");
var scene = new three_1.Scene();
var camera = new three_1.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000000);
camera.position.set(0.2, 0, 0.5); // the offset of camera for better videogame experience
var renderer = new three_1.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);
window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
var stats = new stats_module_js_1["default"]();
document.body.appendChild(stats.dom);
var game = new Game_1["default"](scene, camera, renderer);
await game.init();
var clock = new three_1.Clock();
var delta = 0;
function animate() {
    requestAnimationFrame(animate);
    delta = clock.getDelta(); // Get the time since the last call
    game.update(delta); // Update game state, including physics
    renderer.render(scene, camera); // Render the scene
    stats.update(); // Update any performance stats
}
animate();
