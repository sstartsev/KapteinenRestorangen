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
var rapier3d_compat_1 = require("@dimforge/rapier3d-compat");
var three_1 = require("three");
var AnimationController_1 = require("./AnimationController");
var FollowCam_1 = require("./FollowCam");
var Keyboard_1 = require("./Keyboard");
var Player = /** @class */ (function () {
    function Player(scene, camera, renderer, world, position) {
        var _a;
        if (position === void 0) { position = [0, 0, 0]; }
        this.vector = new three_1.Vector3();
        this.inputVelocity = new three_1.Vector3();
        this.euler = new three_1.Euler();
        this.quaternion = new three_1.Quaternion();
        this.followTarget = new three_1.Object3D(); //new Mesh(new SphereGeometry(0.1), new MeshNormalMaterial())
        this.grounded = true;
        this.rotationMatrix = new three_1.Matrix4();
        this.targetQuaternion = new three_1.Quaternion();
        this.wait = false;
        this.isEnteringCar = false;
        this.scene = scene;
        this.world = world;
        this.keyboard = new Keyboard_1["default"](renderer);
        this.followCam = new FollowCam_1["default"](this.scene, camera, renderer);
        //scene.add(this.followTarget) // the followCam will lerp towards this object3Ds world position.
        this.body = world.createRigidBody((_a = rapier3d_compat_1.RigidBodyDesc.dynamic()).setTranslation.apply(_a, position).enabledRotations(false, false, false)
            .setLinearDamping(4)
            .setCanSleep(false));
        var shape = rapier3d_compat_1.ColliderDesc.capsule(0.5, 0.15)
            .setTranslation(0, 0.645, 0)
            .setMass(1)
            .setFriction(0)
            .setActiveEvents(rapier3d_compat_1.ActiveEvents.COLLISION_EVENTS);
        world.createCollider(shape, this.body);
    }
    Player.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.animationController = new AnimationController_1["default"](this.scene, this.keyboard);
                        return [4 /*yield*/, this.animationController.init()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Player.prototype.setEnteringCar = function (entering) {
        this.isEnteringCar = entering;
        if (entering) {
            // Disable physics/controls while animation plays
            this.body.setLinearDamping(999);
            this.grounded = false;
        }
        else {
            // Re-enable physics/controls after animation
            this.body.setLinearDamping(4);
            this.grounded = true;
        }
    };
    Player.prototype.setGrounded = function () {
        var _this = this;
        this.body.setLinearDamping(4);
        this.grounded = true;
        setTimeout(function () { return (_this.wait = false); }, 250);
    };
    Player.prototype.update = function (delta) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        this.inputVelocity.set(0, 0, 0);
        // At the start of update, check animation state
        if (this.isEnteringCar) {
            // When entering car, make capsule and camera follow the mesh
            var meshPosition = (_b = (_a = this.animationController) === null || _a === void 0 ? void 0 : _a.model) === null || _b === void 0 ? void 0 : _b.position;
            if (meshPosition) {
                this.body.setTranslation(meshPosition, true);
                this.followTarget.position.copy(meshPosition);
                this.followTarget.getWorldPosition(this.vector);
                this.followCam.pivot.position.lerp(this.vector, delta * 10);
            }
            return; // Skip regular movement logic
        }
        if (this.grounded) {
            if (this.keyboard.keyMap['KeyW']) {
                this.inputVelocity.z = -1;
            }
            if (this.keyboard.keyMap['KeyS']) {
                this.inputVelocity.z = 1;
            }
            if (this.keyboard.keyMap['KeyA']) {
                this.inputVelocity.x = -1;
            }
            if (this.keyboard.keyMap['KeyD']) {
                this.inputVelocity.x = 1;
            }
            this.inputVelocity.setLength(delta * (((_c = this.animationController) === null || _c === void 0 ? void 0 : _c.speed) || 1)); // limit horizontal movement based on walking or running speed
            if (!this.wait && this.keyboard.keyMap['Space']) {
                this.wait = true;
                this.body.setLinearDamping(0);
                if (this.keyboard.keyMap['ShiftLeft']) {
                    this.inputVelocity.multiplyScalar(15); // if running, add more boost
                }
                else {
                    this.inputVelocity.multiplyScalar(10);
                }
                this.inputVelocity.y = 2; // give jumping some height
                this.grounded = false;
            }
            if (!this.wait && this.keyboard.keyMap['Space']) {
                this.wait = true;
                this.body.setLinearDamping(0);
                if (this.keyboard.keyMap['ShiftLeft']) {
                    this.inputVelocity.multiplyScalar(15); // if running, add more boost
                }
                else {
                    this.inputVelocity.multiplyScalar(10);
                }
                this.inputVelocity.y = 2; // give jumping some height
                this.grounded = false;
            }
            if (!this.wait && this.keyboard.keyMap['Space']) {
                this.wait = true;
                this.body.setLinearDamping(0);
                if (this.keyboard.keyMap['ShiftLeft']) {
                    this.inputVelocity.multiplyScalar(15); // if running, add more boost
                }
                else {
                    this.inputVelocity.multiplyScalar(10);
                }
                this.inputVelocity.y = 2; // give jumping some height
                this.grounded = false;
            }
            if (!this.wait && this.keyboard.keyMap['E']) {
                this.wait = true;
                this.body.setLinearDamping(0);
                if (this.keyboard.keyMap['ShiftLeft']) {
                    this.inputVelocity.multiplyScalar(15); // if running, add more boost
                }
                else {
                    this.inputVelocity.multiplyScalar(10);
                }
                this.inputVelocity.set(3, 3, 3);
                this.grounded = true;
                this.setEnteringCar(true); // Set entering car state
            }
            if (!this.wait && this.keyboard.keyMap['F']) {
                this.wait = true;
                this.body.setLinearDamping(0);
                if (this.keyboard.keyMap['ShiftLeft']) {
                    this.inputVelocity.multiplyScalar(15); // if running, add more boost
                }
                else {
                    this.inputVelocity.multiplyScalar(10);
                }
                this.inputVelocity.set(3, 3, 3);
                this.grounded = true;
                this.setEnteringCar(true); // Set entering car state
            }
        }
        // // apply the followCam yaw to inputVelocity so the capsule moves forward based on cameras forward direction
        this.euler.y = this.followCam.yaw.rotation.y;
        this.quaternion.setFromEuler(this.euler);
        this.inputVelocity.applyQuaternion(this.quaternion);
        // // now move the capsule body based on inputVelocity
        this.body.applyImpulse(this.inputVelocity, true);
        // // The followCam will lerp towards the followTarget position.
        this.followTarget.position.copy(this.body.translation()); // Copy the capsules position to followTarget
        this.followTarget.getWorldPosition(this.vector); // Put followTargets new world position into a vector
        this.followCam.pivot.position.lerp(this.vector, delta * 10); // lerp the followCam pivot towards the vector
        // // Eve model also lerps towards the capsules position, but independently of the followCam
        (_e = (_d = this.animationController) === null || _d === void 0 ? void 0 : _d.model) === null || _e === void 0 ? void 0 : _e.position.lerp(this.vector, delta * 20);
        // // Also turn Eve to face the direction of travel.
        // // First, construct a rotation matrix based on the direction from the followTarget to Eve
        this.rotationMatrix.lookAt(this.followTarget.position, (_g = (_f = this.animationController) === null || _f === void 0 ? void 0 : _f.model) === null || _g === void 0 ? void 0 : _g.position, (_j = (_h = this.animationController) === null || _h === void 0 ? void 0 : _h.model) === null || _j === void 0 ? void 0 : _j.up);
        this.targetQuaternion.setFromRotationMatrix(this.rotationMatrix); // creating a quaternion to rotate Eve, since eulers can suffer from gimbal lock
        // Next, get the distance from the Eve model to the followTarget
        var distance = (_l = (_k = this.animationController) === null || _k === void 0 ? void 0 : _k.model) === null || _l === void 0 ? void 0 : _l.position.distanceTo(this.followTarget.position);
        // If distance is higher than some espilon, and Eves quaternion isn't the same as the targetQuaternion, then rotate towards the targetQuaternion.
        if (distance > 0.0001 && !((_o = (_m = this.animationController) === null || _m === void 0 ? void 0 : _m.model) === null || _o === void 0 ? void 0 : _o.quaternion.equals(this.targetQuaternion))) {
            this.targetQuaternion.z = 0; // so that it rotates around the Y axis
            this.targetQuaternion.x = 0; // so that it rotates around the Y axis
            this.targetQuaternion.normalize(); // always normalise quaternions before use.
            (_q = (_p = this.animationController) === null || _p === void 0 ? void 0 : _p.model) === null || _q === void 0 ? void 0 : _q.quaternion.rotateTowards(this.targetQuaternion, delta * 20);
        }
        // update which animationAction Eve should be playing
        (_r = this.animationController) === null || _r === void 0 ? void 0 : _r.update(delta);
    };
    return Player;
}());
exports["default"] = Player;
