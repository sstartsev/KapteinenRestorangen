import * as THREE from 'three/src/Three.js'
import { AnimationAction, Scene } from 'three/src/Three.js'
import Keyboard from './Keyboard'
import Eve from './Eve'

export default class AnimationController {
  scene: Scene
  wait = false
  animationActions: { [key: string]: AnimationAction } = {}
  activeAction?: AnimationAction
  speed = 0
  keyboard: Keyboard
  model?: Eve

  constructor(scene: Scene, keyboard: Keyboard) {
    this.scene = scene
    this.keyboard = keyboard
  }

  async init() {
    this.model = new Eve()
    await this.model.init(this.animationActions)
    this.activeAction = this.animationActions['idle']
    this.scene.add(this.model)
  }

  setAction(action: AnimationAction) {
    if (this.activeAction != action) {
      this.activeAction?.fadeOut(0.1)
      action.reset().fadeIn(0.1).play()
      this.activeAction = action

      switch (action) {
        case this.animationActions['walk']:
          this.speed = 5.25
          break
        case this.animationActions['run']:
        case this.animationActions['jump']:
          this.speed = 16
          break
        case this.animationActions['pose']:
        case this.animationActions['idle']:
          this.speed = 0
          break
        case this.animationActions['enteringacar']:
            this.speed = 16
            break
      }
    }
  }

  update(delta: number) {
    if (!this.wait) {
        let actionAssigned = false

        if (this.keyboard.keyMap['Space']) {
            this.setAction(this.animationActions['jump'])
            actionAssigned = true
            this.wait = true // blocks further actions until jump is finished
            setTimeout(() => (this.wait = false), 1200)
        }

        if (!actionAssigned && 
            this.keyboard.keyMap['KeyW'] && this.keyboard.keyMap['ShiftLeft']
        ) {
            this.setAction(this.animationActions['run'])
            actionAssigned = true
        }

        if (!actionAssigned && this.keyboard.keyMap['KeyW']) {
            this.setAction(this.animationActions['walk'])
            actionAssigned = true
        }


        if (!actionAssigned && this.keyboard.keyMap['KeyQ']) {
            this.setAction(this.animationActions['pose'])
            actionAssigned = true
        }

// Dedicated block for "E" that ensures enteringacar plays fully
if (!actionAssigned && this.keyboard.keyMap['KeyE']) {
  // Only trigger if not already playing
  if (this.activeAction !== this.animationActions['enteringacar']) {
      const enteringCarAction = this.animationActions['enteringacar']

      // Configure the action to only loop once
      enteringCarAction.setLoop(THREE.LoopOnce, 1)
      enteringCarAction.clampWhenFinished = true
      if (enteringCarAction.clampWhenFinished == true){
        this.model?.position.set(9, 0, -3)
      }

      // Optionally, reset the action to start from the beginning
      enteringCarAction.reset()

      this.setAction(enteringCarAction)
      actionAssigned = true
      this.wait = true 
  }
}
      // New block for "F" that plays enteringacar in reverse
      if (!actionAssigned && this.keyboard.keyMap['KeyF']) {
        if (this.activeAction !== this.animationActions['enteringacar']) {
            const enteringCarAction = this.animationActions['enteringacar']
            enteringCarAction.setLoop(THREE.LoopOnce, 1)
            enteringCarAction.clampWhenFinished = true
            enteringCarAction.timeScale = -1 // This makes it play in reverse
            enteringCarAction.reset()
            // Set time to the end of the animation to start playing backwards from there
            enteringCarAction.time = enteringCarAction.getClip().duration
            this.setAction(enteringCarAction)
            actionAssigned = true
            this.wait = true 
    
            // Add a listener to reset to idle when reverse animation completes
            const duration = enteringCarAction.getClip().duration * 1000 // Convert to milliseconds
            setTimeout(() => {
                this.wait = false
                this.setAction(this.animationActions['idle'])
            }, duration)
        }
    }


        if (!actionAssigned) {
            this.setAction(this.animationActions['idle'])
        }
    }

    // update the Eve model's animation mixer
    this.model?.update(delta)
}
}