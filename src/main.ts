import './style.css'
import { Scene, PerspectiveCamera, WebGLRenderer, Clock } from 'three'
import Stats from 'three/addons/libs/stats.module.js'
import Game from './Game'

const scene = new Scene()

const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000000)
camera.position.set(0.2, 0, 0.5)// the offset of camera for better videogame experience

const renderer = new WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
document.body.appendChild(renderer.domElement)

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

const stats = new Stats()
document.body.appendChild(stats.dom)

const game = new Game(scene, camera, renderer);
await game.init();

const clock = new Clock();
let delta = 0;



function animate() {
  requestAnimationFrame(animate);

  delta = clock.getDelta(); // Get the time since the last call

  game.update(delta); // Update game state, including physics


  renderer.render(scene, camera); // Render the scene

  stats.update(); // Update any performance stats
}

animate();
