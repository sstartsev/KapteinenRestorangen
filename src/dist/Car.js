"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var three_1 = require("three");
var rapier3d_compat_1 = require("@dimforge/rapier3d-compat");
var GLTFLoader_js_1 = require("three/addons/loaders/GLTFLoader.js");
var Lensflare_js_1 = require("three/addons/objects/Lensflare.js");
// collision groups
// floorShape = 0
// carShape = 1
// wheelShape = 2
// axelShape = 3
var Car = /** @class */ (function () {
    function Car(keyMap, pivot) {
        this.dynamicBodies = [];
        this.followTarget = new three_1.Object3D();
        this.lightLeftTarget = new three_1.Object3D();
        this.lightRightTarget = new three_1.Object3D();
        this.v = new three_1.Vector3();
        this.followTarget.position.set(0, 1, 0);
        this.lightLeftTarget.position.set(-0.35, 1, -10);
        this.lightRightTarget.position.set(0.35, 1, -10);
        this.keyMap = keyMap;
        this.pivot = pivot;
    }
    Car.prototype.init = function (scene, world, position) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new GLTFLoader_js_1.GLTFLoader().loadAsync('/public/models/Car/sedanSports.glb').then(function (gltf) {
                            var _a;
                            var carMesh = gltf.scene.getObjectByName('body');
                            carMesh.position.set(0, 0, 0);
                            carMesh.traverse(function (o) {
                                o.castShadow = true;
                            });
                            carMesh.add(_this.followTarget);
                            var textureLoader = new three_1.TextureLoader();
                            var textureFlare0 = textureLoader.load('img/lensflare0.png');
                            var textureFlare3 = textureLoader.load('img/lensflare3.png');
                            var lensflareLeft = new Lensflare_js_1.Lensflare();
                            lensflareLeft.addElement(new Lensflare_js_1.LensflareElement(textureFlare0, 1000, 0));
                            lensflareLeft.addElement(new Lensflare_js_1.LensflareElement(textureFlare3, 500, 0.2));
                            lensflareLeft.addElement(new Lensflare_js_1.LensflareElement(textureFlare3, 250, 0.8));
                            lensflareLeft.addElement(new Lensflare_js_1.LensflareElement(textureFlare3, 125, 0.6));
                            lensflareLeft.addElement(new Lensflare_js_1.LensflareElement(textureFlare3, 62.5, 0.4));
                            var lensflareRight = new Lensflare_js_1.Lensflare();
                            lensflareRight.addElement(new Lensflare_js_1.LensflareElement(textureFlare0, 1000, 0));
                            lensflareRight.addElement(new Lensflare_js_1.LensflareElement(textureFlare3, 500, 0.2));
                            lensflareRight.addElement(new Lensflare_js_1.LensflareElement(textureFlare3, 250, 0.8));
                            lensflareRight.addElement(new Lensflare_js_1.LensflareElement(textureFlare3, 125, 0.6));
                            lensflareRight.addElement(new Lensflare_js_1.LensflareElement(textureFlare3, 62.5, 0.4));
                            var headLightLeft = new three_1.SpotLight(undefined, Math.PI * 20);
                            headLightLeft.position.set(-0.4, 0.5, -1.01);
                            headLightLeft.angle = Math.PI / 4;
                            headLightLeft.penumbra = 0.5;
                            headLightLeft.castShadow = true;
                            headLightLeft.shadow.blurSamples = 10;
                            headLightLeft.shadow.radius = 5;
                            var headLightRight = headLightLeft.clone();
                            headLightRight.position.set(0.4, 0.5, -1.01);
                            carMesh.add(headLightLeft);
                            headLightLeft.target = _this.lightLeftTarget;
                            headLightLeft.add(lensflareLeft);
                            carMesh.add(_this.lightLeftTarget);
                            carMesh.add(headLightRight);
                            headLightRight.target = _this.lightRightTarget;
                            headLightRight.add(lensflareRight);
                            carMesh.add(_this.lightRightTarget);
                            var wheelBLMesh = gltf.scene.getObjectByName('wheel_backLeft');
                            var wheelBRMesh = gltf.scene.getObjectByName('wheel_backRight');
                            var wheelFLMesh = gltf.scene.getObjectByName('wheel_frontLeft');
                            var wheelFRMesh = gltf.scene.getObjectByName('wheel_frontRight');
                            scene.add(carMesh, wheelBLMesh, wheelBRMesh, wheelFLMesh, wheelFRMesh);
                            // create bodies for car, wheels and axels
                            _this.carBody = world.createRigidBody((_a = rapier3d_compat_1.RigidBodyDesc.dynamic()).setTranslation.apply(_a, position).setCanSleep(false));
                            var wheelBLBody = world.createRigidBody(rapier3d_compat_1.RigidBodyDesc.dynamic()
                                .setTranslation(position[0] - 0.55, position[1], position[2] + 0.63)
                                .setCanSleep(false));
                            var wheelBRBody = world.createRigidBody(rapier3d_compat_1.RigidBodyDesc.dynamic()
                                .setTranslation(position[0] + 0.55, position[1], position[2] + 0.63)
                                .setCanSleep(false));
                            var wheelFLBody = world.createRigidBody(rapier3d_compat_1.RigidBodyDesc.dynamic()
                                .setTranslation(position[0] - 0.55, position[1], position[2] - 0.63)
                                .setCanSleep(false));
                            var wheelFRBody = world.createRigidBody(rapier3d_compat_1.RigidBodyDesc.dynamic()
                                .setTranslation(position[0] + 0.55, position[1], position[2] - 0.63)
                                .setCanSleep(false));
                            var axelFLBody = world.createRigidBody(rapier3d_compat_1.RigidBodyDesc.dynamic()
                                .setTranslation(position[0] - 0.55, position[1], position[2] - 0.63)
                                .setCanSleep(false));
                            var axelFRBody = world.createRigidBody(rapier3d_compat_1.RigidBodyDesc.dynamic()
                                .setTranslation(position[0] + 0.55, position[1], position[2] - 0.63)
                                .setCanSleep(false));
                            // create a convexhull from all meshes in the carMesh group
                            var v = new three_1.Vector3();
                            var positions = [];
                            carMesh.updateMatrixWorld(true); // ensure world matrix is up to date
                            carMesh.traverse(function (o) {
                                if (o.type === 'Mesh') {
                                    var positionAttribute = o.geometry.getAttribute('position');
                                    for (var i = 0, l = positionAttribute.count; i < l; i++) {
                                        v.fromBufferAttribute(positionAttribute, i);
                                        v.applyMatrix4(o.parent.matrixWorld);
                                        positions.push.apply(positions, v);
                                    }
                                }
                            });
                            // create shapes for carBody, wheelBodies and axelBodies
                            var carShape = rapier3d_compat_1.ColliderDesc.convexMesh(new Float32Array(positions)).setMass(1).setRestitution(0.5).setFriction(0.5)
                                .setCollisionGroups(131073);
                            var wheelBLShape = rapier3d_compat_1.ColliderDesc.cylinder(0.1, 0.3)
                                .setRotation(new three_1.Quaternion().setFromAxisAngle(new three_1.Vector3(0, 0, 1), -Math.PI / 2))
                                .setTranslation(-0.2, 0, 0)
                                .setRestitution(0.5)
                                .setFriction(2)
                                .setCollisionGroups(262145);
                            var wheelBRShape = rapier3d_compat_1.ColliderDesc.cylinder(0.1, 0.3)
                                .setRotation(new three_1.Quaternion().setFromAxisAngle(new three_1.Vector3(0, 0, 1), Math.PI / 2))
                                .setTranslation(0.2, 0, 0)
                                .setRestitution(0.5)
                                .setFriction(2)
                                .setCollisionGroups(262145);
                            var wheelFLShape = rapier3d_compat_1.ColliderDesc.cylinder(0.1, 0.3)
                                .setRotation(new three_1.Quaternion().setFromAxisAngle(new three_1.Vector3(0, 0, 1), Math.PI / 2))
                                .setTranslation(-0.2, 0, 0)
                                .setRestitution(0.5)
                                .setFriction(2.5)
                                .setCollisionGroups(262145);
                            var wheelFRShape = rapier3d_compat_1.ColliderDesc.cylinder(0.1, 0.3)
                                .setRotation(new three_1.Quaternion().setFromAxisAngle(new three_1.Vector3(0, 0, 1), Math.PI / 2))
                                .setTranslation(0.2, 0, 0)
                                .setRestitution(0.5)
                                .setFriction(2.5)
                                .setCollisionGroups(262145);
                            var axelFLShape = rapier3d_compat_1.ColliderDesc.cuboid(0.1, 0.1, 0.1)
                                .setRotation(new three_1.Quaternion().setFromAxisAngle(new three_1.Vector3(0, 0, 1), Math.PI / 2))
                                .setMass(0.1)
                                .setCollisionGroups(589823);
                            var axelFRShape = rapier3d_compat_1.ColliderDesc.cuboid(0.1, 0.1, 0.1)
                                .setRotation(new three_1.Quaternion().setFromAxisAngle(new three_1.Vector3(0, 0, 1), Math.PI / 2))
                                .setMass(0.1)
                                .setCollisionGroups(589823);
                            //joins wheels to car body
                            world.createImpulseJoint(rapier3d_compat_1.JointData.revolute(new three_1.Vector3(-0.55, 0, 0.63), new three_1.Vector3(0, 0, 0), new three_1.Vector3(-1, 0, 0)), _this.carBody, wheelBLBody, true);
                            world.createImpulseJoint(rapier3d_compat_1.JointData.revolute(new three_1.Vector3(0.55, 0, 0.63), new three_1.Vector3(0, 0, 0), new three_1.Vector3(-1, 0, 0)), _this.carBody, wheelBRBody, true);
                            world.createImpulseJoint(rapier3d_compat_1.JointData.revolute(new three_1.Vector3(-0.55, 0, -0.63), new three_1.Vector3(0, 0, 0), new three_1.Vector3(1, 0, 0)), _this.carBody, wheelFLBody, true);
                            world.createImpulseJoint(rapier3d_compat_1.JointData.revolute(new three_1.Vector3(0.55, 0, -0.63), new three_1.Vector3(0, 0, 0), new three_1.Vector3(1, 0, 0)), _this.carBody, wheelFRBody, true);
                            // attach back wheel to cars. These will be configurable motors.
                            _this.wheelBLMotor = world.createImpulseJoint(rapier3d_compat_1.JointData.revolute(new three_1.Vector3(-0.55, 0, 0.63), new three_1.Vector3(0, 0, 0), new three_1.Vector3(-1, 0, 0)), _this.carBody, wheelBLBody, true);
                            _this.wheelBRMotor = world.createImpulseJoint(rapier3d_compat_1.JointData.revolute(new three_1.Vector3(0.55, 0, 0.63), new three_1.Vector3(0, 0, 0), new three_1.Vector3(-1, 0, 0)), _this.carBody, wheelBRBody, true);
                            // attach steering axels to car. These will be configurable motors.
                            _this.wheelFLAxel = world.createImpulseJoint(rapier3d_compat_1.JointData.revolute(new three_1.Vector3(-0.55, 0, -0.63), new three_1.Vector3(0, 0, 0), new three_1.Vector3(0, 1, 0)), _this.carBody, axelFLBody, true);
                            _this.wheelFLAxel.configureMotorModel(rapier3d_compat_1.MotorModel.ForceBased);
                            _this.wheelFRAxel = world.createImpulseJoint(rapier3d_compat_1.JointData.revolute(new three_1.Vector3(0.55, 0, -0.63), new three_1.Vector3(0, 0, 0), new three_1.Vector3(0, 1, 0)), _this.carBody, axelFRBody, true);
                            _this.wheelFRAxel.configureMotorModel(rapier3d_compat_1.MotorModel.ForceBased);
                            // // attach front wheel to steering axels
                            world.createImpulseJoint(rapier3d_compat_1.JointData.revolute(new three_1.Vector3(0, 0, 0), new three_1.Vector3(0, 0, 0), new three_1.Vector3(1, 0, 0)), axelFLBody, wheelFLBody, true);
                            world.createImpulseJoint(rapier3d_compat_1.JointData.revolute(new three_1.Vector3(0, 0, 0), new three_1.Vector3(0, 0, 0), new three_1.Vector3(1, 0, 0)), axelFRBody, wheelFRBody, true);
                            //create world collider
                            world.createCollider(carShape, _this.carBody);
                            world.createCollider(wheelBLShape, wheelBLBody);
                            world.createCollider(wheelBRShape, wheelBRBody);
                            world.createCollider(wheelFLShape, wheelFLBody);
                            world.createCollider(wheelFRShape, wheelFRBody);
                            world.createCollider(axelFLShape, axelFLBody);
                            world.createCollider(axelFRShape, axelFRBody);
                            // update local dynamicBodies so mesh positions and quaternions are updated with the physics world info
                            _this.dynamicBodies.push([carMesh, _this.carBody]);
                            _this.dynamicBodies.push([wheelBLMesh, wheelBLBody]);
                            _this.dynamicBodies.push([wheelBRMesh, wheelBRBody]);
                            _this.dynamicBodies.push([wheelFLMesh, wheelFLBody]);
                            _this.dynamicBodies.push([wheelFRMesh, wheelFRBody]);
                            _this.dynamicBodies.push([new three_1.Object3D(), axelFRBody]);
                            _this.dynamicBodies.push([new three_1.Object3D(), axelFLBody]);
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Car.prototype.update = function (delta) {
        var _this = this;
        for (var i = 0, n = this.dynamicBodies.length; i < n; i++) {
            this.dynamicBodies[i][0].position.copy(this.dynamicBodies[i][1].translation());
            this.dynamicBodies[i][0].quaternion.copy(this.dynamicBodies[i][1].rotation());
        }
        this.followTarget.getWorldPosition(this.v);
        this.pivot.position.lerp(this.v, delta * 5); // frame rate independent
        this.pivot.position.copy(this.v);
        window.addEventListener('keydown', function (event) {
            _this.keyMap[event.code] = true;
        });
        window.addEventListener('keyup', function (event) {
            _this.keyMap[event.code] = false;
        });
        var targetVelocity = 0;
        if (this.keyMap['KeyW']) {
            targetVelocity = 200;
        }
        ;
        if (this.keyMap['KeyS']) {
            targetVelocity = -200;
        }
        ;
        this.wheelBLMotor.configureMotorVelocity(targetVelocity, 2.0);
        this.wheelBRMotor.configureMotorVelocity(targetVelocity, 2.0);
        var targetSteer = 0;
        if (this.keyMap['KeyA']) {
            targetSteer += 30;
        }
        if (this.keyMap['KeyD']) {
            targetSteer -= 30;
        }
        ;
        this.wheelFLAxel.configureMotorPosition(targetSteer, 100, 10);
        this.wheelFRAxel.configureMotorPosition(targetSteer, 100, 10);
    };
    return Car;
}());
exports["default"] = Car;
