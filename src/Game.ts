import * as THREE from 'three'
import { BoxGeometry, Mesh, PerspectiveCamera, Scene, WebGLRenderer, Vector3 } from 'three'
import UI from './UI'
import Player from './Player'
import Environment from './Environment'
import Car from './Car'
import Terrain from './terrain'
import RAPIER, { World, EventQueue, RigidBodyDesc, ColliderDesc } from '@dimforge/rapier3d-compat'
import RapierDebugRenderer from './RapierDebugRenderer'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'

export default class Game {
  scene: Scene
  camera: PerspectiveCamera
  renderer: WebGLRenderer
  player?: Player
  world?: World
  rapierDebugRenderer?: RapierDebugRenderer
  eventQueue?: EventQueue
  terrain?: Terrain  // Add this property
  car?: Car

   cameraPivot = new THREE.Object3D()
   keyMap: { [key: string]: boolean } = {} // We'll need this later for controls

  constructor(scene: Scene, camera: PerspectiveCamera, renderer: WebGLRenderer) {
    this.scene = scene
    this.camera = camera
    this.renderer = renderer
    this.scene.add(this.cameraPivot) // Add camera pivot to scene
  }

  async init() {
    await RAPIER.init() // This line is only needed if using the compat version
    const gravity = new Vector3(0.0, -9.81, 0.0)

    this.world = new World(gravity)
    this.eventQueue = new EventQueue(true)

    this.terrain = new Terrain(this.scene, this.world)
    this.rapierDebugRenderer = new RapierDebugRenderer(this.scene, this.world)
    const gui = new GUI()
    gui.add(this.rapierDebugRenderer, 'enabled').name('Rapier Degug Renderer')

        // Initialize car after terrain
        this.car = new Car(this.keyMap, this.cameraPivot)
        await this.car.init(this.scene, this.world, [0, 0.5, 0]) // Spawn car 5 units above ground

    // the floor (using a cuboid)
    // const floorMesh = new Mesh(new BoxGeometry(50, 1, 50), new MeshStandardMaterial())
    // //floorMesh.receiveShadow = true
    // floorMesh.position.y = -3
    // this.scene.add(floorMesh)
    const floorBody = this.world.createRigidBody(RigidBodyDesc.fixed().setTranslation(0, -0.5, 0))
    const floorShape = ColliderDesc.cuboid(25, 0.5, 25)
    this.world.createCollider(floorShape, floorBody)

    const eastwallMesh = new Mesh(new BoxGeometry(10, 1.5, 1.5), new THREE.MeshBasicMaterial({
      color: 0xff0000,
      transparent: true,
      opacity: 0.5,
  }))
    eastwallMesh.receiveShadow = false
    eastwallMesh.position.set(5, 1.5, -5)//=================================================================//mesh an collider on same heights
    //this.scene.add(eastwallMesh)
    const eastwallBody = this.world.createRigidBody(RigidBodyDesc.fixed().setTranslation(1.1, 1.5, -3.7))//mesh an collider on same heights
    const eastwallShape = ColliderDesc.cuboid(3, 1.5, 0.15)//===size of an actuall real collider
    this.world.createCollider(eastwallShape, eastwallBody)


    this.player = new Player(this.scene, this.camera, this.renderer, this.world, [-9, 3, 0])// SPAWN PLAYER COORDINATES
    await this.player.init()

    
    const environment = new Environment(this.scene)
    await environment.init()
    //environment.light.target = this.player.followTarget

    const ui = new UI(this.renderer)
    ui.show()
  }

  update(delta: number) {
    ;(this.world as World).timestep = Math.min(delta, 0.1)
    this.world?.step(this.eventQueue)
    
    this.eventQueue?.drainCollisionEvents((_, __, started) => {
      if (started) {
        this.player?.setGrounded()
        this.car?.update(delta)
      }
    })
    this.player?.update(delta)
    this.car?.update(delta); // Update car state (position, rotation)
    this.rapierDebugRenderer?.update()
  }
}