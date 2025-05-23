import * as THREE from 'three'
import { AnimationAction, AnimationMixer, Group, Mesh, AnimationUtils } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

export default class Eve extends Group {
  mixer?: AnimationMixer
  glTFLoader: GLTFLoader
  currentAction?: AnimationAction

  constructor() {
    super()

    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('jsm/libs/draco/')

    this.glTFLoader = new GLTFLoader()
    this.glTFLoader.setDRACOLoader(dracoLoader)
  }

  async init(animationActions: { [key: string]: AnimationAction }) {
    const [eve, idle, run, jump, pose, enteringacar] = await Promise.all([
      this.glTFLoader.loadAsync('/models/sym/eve$@walk.glb'),
      this.glTFLoader.loadAsync('/models/sym/eve@idle.glb'),
      this.glTFLoader.loadAsync('/models/sym/eve@run.glb'),
      this.glTFLoader.loadAsync('/models/sym/eve@jump.glb'),
      this.glTFLoader.loadAsync('/models/sym/eve@pose.glb'),
      this.glTFLoader.loadAsync('/models/sym/eve@enteringacar.glb'),
    ])

    eve.scene.traverse((m) => {
      if ((m as Mesh).isMesh) {
        m.castShadow = true
      }
    })

    this.mixer = new AnimationMixer(eve.scene)

    // Create all animation actions first
    animationActions['idle'] = this.mixer.clipAction(idle.animations[0])
    animationActions['walk_full'] = this.mixer.clipAction(eve.animations[0])
    animationActions['walk'] = this.mixer.clipAction(AnimationUtils.subclip(eve.animations[0], 'walk', 0, 42))
    animationActions['run_full'] = this.mixer.clipAction(run.animations[0])
    animationActions['run'] = this.mixer.clipAction(AnimationUtils.subclip(run.animations[0], 'run', 0, 17))
    
    // Handle jump animation
    jump.animations[0].tracks = jump.animations[0].tracks.filter((e) => !e.name.endsWith('.position'))
    animationActions['jump'] = this.mixer.clipAction(jump.animations[0])

    // Handle enteringacar animation
    animationActions['enteringacar'] = this.mixer.clipAction(AnimationUtils.subclip(eve.animations[0], 'enteringacar', 0, 42))
    
    // Handle pose animation
    animationActions['pose'] = this.mixer.clipAction(pose.animations[0])
    
    // Handle enteringacar animation - keep position tracks
    animationActions['enteringacar'] = this.mixer.clipAction(enteringacar.animations[0])
    const enteringcarAction = animationActions['enteringacar']
    if (enteringcarAction) {
      enteringcarAction.setLoop(THREE.LoopOnce, 1)
      enteringcarAction.clampWhenFinished = true
    }

    // Set initial animation
    this.currentAction = animationActions['idle']
    this.currentAction.play()

    this.add(eve.scene)
  }

  update(delta: number) {
    this.mixer?.update(delta)
  }
}