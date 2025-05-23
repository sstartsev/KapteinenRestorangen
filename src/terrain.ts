import * as THREE from 'three'
import { Scene } from 'three'
import { World, RigidBodyDesc, ColliderDesc, ActiveEvents } from '@dimforge/rapier3d-compat'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import terrainShader from './shaders/terrainShader'

export default class Terrain {
  private scene: Scene;
  private world: World;
  private textureLoader: THREE.TextureLoader;

  constructor(scene: Scene, world: World) {
      this.scene = scene;
      this.world = world;
      this.textureLoader = new THREE.TextureLoader();

      // Load all textures
      const textures = {
          sand: this.textureLoader.load('/public/img/terrain/sandyground-albedo-1024.png'),
          dirt: this.textureLoader.load('/public/img/terrain/dirt_01_diffuse-1024.png'),
          cobble: this.textureLoader.load('/public/img/terrain/rough-wet-cobble-albedo-1024.png'),
          grass: this.textureLoader.load('/public/img/terrain/grass1-albedo-512.jpg'),
          rocks: this.textureLoader.load('/public/img/terrain/sandy-rocks1-albedo-1024.png'),
          wornRock: this.textureLoader.load('/public/img/terrain/worn-bumpy-rock-albedo-1024.png'),
          snowPacked: this.textureLoader.load('/public/img/terrain/snow-packed-albedo-1024.png'),
          rockSnow: this.textureLoader.load('/public/img/terrain/rock-snow-ice-albedo-1024.png'),
      };

      // Set texture properties
      Object.values(textures).forEach(texture => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.generateMipmaps = true;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
    });

      new GLTFLoader().load('/public/models/StorvikaElevation.glb', (gltf) => {
          gltf.scene.updateMatrixWorld(true)
          
          gltf.scene.traverse((child) => {
              if ((<any>child).isMesh) {
                  try {
                    const mesh = child as THREE.Mesh
                    mesh.castShadow = true
                    mesh.receiveShadow = true

                    // Create custom shader material
                    const shaderMaterial = new THREE.ShaderMaterial({
                      vertexShader: terrainShader.vertexShader,
                      fragmentShader: terrainShader.fragmentShader,
                      uniforms: {
                          sandTexture: { value: textures.sand },
                          dirtTexture: { value: textures.dirt },
                          cobbleTexture: { value: textures.cobble },
                          grassTexture: { value: textures.grass },
                          rocksTexture: { value: textures.rocks },
                          wornRockTexture: { value: textures.wornRock },
                          snowPackedTexture: { value: textures.snowPacked },
                          rockSnowTexture: { value: textures.rockSnow },
                          textureScale: { value: 0.5 }, // Try a smaller value for larger textures
                          blendSharpness: { value: 0.1 }
                      }
                  });

                    // Apply the shader material to the mesh
                    mesh.material = shaderMaterial;

            // Decompose the world matrix to get clean transforms
            const position = new THREE.Vector3()
            const quaternion = new THREE.Quaternion()
            const scale = new THREE.Vector3()
            mesh.matrixWorld.decompose(position, quaternion, scale)
      
            // Get the geometry from the mesh
            const geometry = mesh.geometry.clone() // Clone to avoid modifying original
            geometry.applyMatrix4(mesh.matrixWorld) // Apply world transform to vertices
            
            // Ensure geometry is properly initialized
            if (!geometry || !geometry.attributes.position) {
              console.error('Invalid geometry data')
              return
            }

            // Create physics body with identity transform since geometry is pre-transformed
            const terrainBody = this.world.createRigidBody(
              RigidBodyDesc.fixed()
                .setTranslation(0, 0, 0)
            )
      
            // Get vertices and indices from the geometry
            const vertices = new Float32Array(geometry.attributes.position.array)
            
            // Ensure vertices array is not empty
            if (vertices.length === 0) {
              console.error('Empty vertices array')
              return
            }

            // Get indices with validation
            let indices: Uint32Array
            if (geometry.index && geometry.index.array.length > 0) {
              indices = new Uint32Array(geometry.index.array)
            } else {
              // Create sequential indices if none exist
              indices = new Uint32Array(vertices.length / 3)
              for (let i = 0; i < indices.length; i++) {
                indices[i] = i
              }
            }
      
            // Create trimesh collider from the geometry
            const terrainCollider = ColliderDesc.trimesh(vertices, indices)
              .setActiveEvents(ActiveEvents.COLLISION_EVENTS)
              
            // Add collider to the physics world
            this.world.createCollider(terrainCollider, terrainBody)
          } catch (error) {
            console.error('Error creating terrain physics:', error)
          }
        }
      })
    
      gltf.scene.position.set(0, 0, 0)
      this.scene.add(gltf.scene)
    })
  }
}