import { CameraHelper, DirectionalLight, EquirectangularReflectionMapping, GridHelper, Scene, TextureLoader } from 'three'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'
import { Lensflare, LensflareElement } from 'three/addons/objects/Lensflare.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { createOceanScene } from './ocean'; // Adjust the path as needed

export default class Environment {
  scene: Scene
  light: DirectionalLight

  constructor(scene: Scene) {
    this.scene = scene
    const oceanScene = createOceanScene();
    this.scene.add(oceanScene);

    this.scene.add(new GridHelper(50, 50))

    this.light = new DirectionalLight(0xeeaf61, Math.PI)
    this.light.position.set(-180, 0, -11)
    this.light.castShadow = true
    this.scene.add(this.light)

    new GLTFLoader().load('/models/FinalCut/FinalCut.glb', (gltf) => {
      console.log(gltf)
      
      gltf.scene.traverse(function (child) {
        if ( (<any> child).isMesh ) {
            child.castShadow = true
            child.receiveShadow = true
        }
    })

      gltf.scene.scale.set(0.0254, 0.0254, 0.0254)
      gltf.scene.rotateY(-22)
      gltf.scene.position.set(0, 0, 0)
      scene.add(gltf.scene)
    })

     //const directionalLightHelper = new CameraHelper(this.light.shadow.camera)
     //this.scene.add(directionalLightHelper)

    const textureLoader = new TextureLoader()
    const textureFlare0 = textureLoader.load('img/lensflare0.png')
    const textureFlare3 = textureLoader.load('img/lensflare3.png')

    const lensflare = new Lensflare()
    lensflare.addElement(new LensflareElement(textureFlare0, 1000, 0))
    lensflare.addElement(new LensflareElement(textureFlare3, 500, 0.2))
    lensflare.addElement(new LensflareElement(textureFlare3, 250, 0.8))
    lensflare.addElement(new LensflareElement(textureFlare3, 125, 0.6))
    lensflare.addElement(new LensflareElement(textureFlare3, 62.5, 0.4))
    this.light.add(lensflare)
  }

  async init() {
    await new RGBELoader().loadAsync('img/venice_sunset_1k.hdr').then((texture) => {
      texture.mapping = EquirectangularReflectionMapping
      this.scene.environment = texture
      this.scene.background = texture
      this.scene.backgroundBlurriness = 3
    })
  }
}