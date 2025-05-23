"use strict";
exports.__esModule = true;
var THREE = require("three");
var rapier3d_compat_1 = require("@dimforge/rapier3d-compat");
var GLTFLoader_js_1 = require("three/examples/jsm/loaders/GLTFLoader.js");
var terrainShader_1 = require("./shaders/terrainShader");
var Terrain = /** @class */ (function () {
    function Terrain(scene, world) {
        var _this = this;
        this.scene = scene;
        this.world = world;
        this.textureLoader = new THREE.TextureLoader();
        // Load all textures
        var textures = {
            sand: this.textureLoader.load('/public/img/terrain/sandyground-albedo-1024.png'),
            dirt: this.textureLoader.load('/public/img/terrain/dirt_01_diffuse-1024.png'),
            cobble: this.textureLoader.load('/public/img/terrain/rough-wet-cobble-albedo-1024.png'),
            grass: this.textureLoader.load('/public/img/terrain/grass1-albedo-512.jpg'),
            rocks: this.textureLoader.load('/public/img/terrain/sandy-rocks1-albedo-1024.png'),
            wornRock: this.textureLoader.load('/public/img/terrain/worn-bumpy-rock-albedo-1024.png'),
            snowPacked: this.textureLoader.load('/public/img/terrain/snow-packed-albedo-1024.png'),
            rockSnow: this.textureLoader.load('/public/img/terrain/rock-snow-ice-albedo-1024.png')
        };
        // Set texture properties
        Object.values(textures).forEach(function (texture) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.generateMipmaps = true;
            texture.minFilter = THREE.LinearMipmapLinearFilter;
            texture.magFilter = THREE.LinearFilter;
        });
        new GLTFLoader_js_1.GLTFLoader().load('/public/models/StorvikaElevation.glb', function (gltf) {
            gltf.scene.updateMatrixWorld(true);
            gltf.scene.traverse(function (child) {
                if (child.isMesh) {
                    try {
                        var mesh = child;
                        mesh.castShadow = true;
                        mesh.receiveShadow = true;
                        // Create custom shader material
                        var shaderMaterial = new THREE.ShaderMaterial({
                            vertexShader: terrainShader_1["default"].vertexShader,
                            fragmentShader: terrainShader_1["default"].fragmentShader,
                            uniforms: {
                                sandTexture: { value: textures.sand },
                                dirtTexture: { value: textures.dirt },
                                cobbleTexture: { value: textures.cobble },
                                grassTexture: { value: textures.grass },
                                rocksTexture: { value: textures.rocks },
                                wornRockTexture: { value: textures.wornRock },
                                snowPackedTexture: { value: textures.snowPacked },
                                rockSnowTexture: { value: textures.rockSnow },
                                textureScale: { value: 0.5 },
                                blendSharpness: { value: 0.1 }
                            }
                        });
                        // Apply the shader material to the mesh
                        mesh.material = shaderMaterial;
                        // Decompose the world matrix to get clean transforms
                        var position = new THREE.Vector3();
                        var quaternion = new THREE.Quaternion();
                        var scale = new THREE.Vector3();
                        mesh.matrixWorld.decompose(position, quaternion, scale);
                        // Get the geometry from the mesh
                        var geometry = mesh.geometry.clone(); // Clone to avoid modifying original
                        geometry.applyMatrix4(mesh.matrixWorld); // Apply world transform to vertices
                        // Ensure geometry is properly initialized
                        if (!geometry || !geometry.attributes.position) {
                            console.error('Invalid geometry data');
                            return;
                        }
                        // Create physics body with identity transform since geometry is pre-transformed
                        var terrainBody = _this.world.createRigidBody(rapier3d_compat_1.RigidBodyDesc.fixed()
                            .setTranslation(0, 0, 0));
                        // Get vertices and indices from the geometry
                        var vertices = new Float32Array(geometry.attributes.position.array);
                        // Ensure vertices array is not empty
                        if (vertices.length === 0) {
                            console.error('Empty vertices array');
                            return;
                        }
                        // Get indices with validation
                        var indices = void 0;
                        if (geometry.index && geometry.index.array.length > 0) {
                            indices = new Uint32Array(geometry.index.array);
                        }
                        else {
                            // Create sequential indices if none exist
                            indices = new Uint32Array(vertices.length / 3);
                            for (var i = 0; i < indices.length; i++) {
                                indices[i] = i;
                            }
                        }
                        // Create trimesh collider from the geometry
                        var terrainCollider = rapier3d_compat_1.ColliderDesc.trimesh(vertices, indices)
                            .setActiveEvents(rapier3d_compat_1.ActiveEvents.COLLISION_EVENTS);
                        // Add collider to the physics world
                        _this.world.createCollider(terrainCollider, terrainBody);
                    }
                    catch (error) {
                        console.error('Error creating terrain physics:', error);
                    }
                }
            });
            gltf.scene.position.set(0, 0, 0);
            _this.scene.add(gltf.scene);
        });
    }
    return Terrain;
}());
exports["default"] = Terrain;
