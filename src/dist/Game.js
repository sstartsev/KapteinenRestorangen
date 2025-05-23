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
var THREE = require("three");
var three_1 = require("three");
var UI_1 = require("./UI");
var Player_1 = require("./Player");
var Environment_1 = require("./Environment");
var Car_1 = require("./Car");
var terrain_1 = require("./terrain");
var rapier3d_compat_1 = require("@dimforge/rapier3d-compat");
var RapierDebugRenderer_1 = require("./RapierDebugRenderer");
var lil_gui_module_min_js_1 = require("three/examples/jsm/libs/lil-gui.module.min.js");
var Game = /** @class */ (function () {
    function Game(scene, camera, renderer) {
        this.cameraPivot = new THREE.Object3D();
        this.keyMap = {}; // We'll need this later for controls
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.scene.add(this.cameraPivot); // Add camera pivot to scene
    }
    Game.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var gravity, gui, floorBody, floorShape, eastwallMesh, eastwallBody, eastwallShape, environment, ui;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, rapier3d_compat_1["default"].init()]; // This line is only needed if using the compat version
                    case 1:
                        _a.sent(); // This line is only needed if using the compat version
                        gravity = new three_1.Vector3(0.0, -9.81, 0.0);
                        this.world = new rapier3d_compat_1.World(gravity);
                        this.eventQueue = new rapier3d_compat_1.EventQueue(true);
                        this.terrain = new terrain_1["default"](this.scene, this.world);
                        this.rapierDebugRenderer = new RapierDebugRenderer_1["default"](this.scene, this.world);
                        gui = new lil_gui_module_min_js_1.GUI();
                        gui.add(this.rapierDebugRenderer, 'enabled').name('Rapier Degug Renderer');
                        // Initialize car after terrain
                        this.car = new Car_1["default"](this.keyMap, this.cameraPivot);
                        return [4 /*yield*/, this.car.init(this.scene, this.world, [0, 0.5, 0])
                            // the floor (using a cuboid)
                            // const floorMesh = new Mesh(new BoxGeometry(50, 1, 50), new MeshStandardMaterial())
                            // //floorMesh.receiveShadow = true
                            // floorMesh.position.y = -3
                            // this.scene.add(floorMesh)
                        ]; // Spawn car 5 units above ground
                    case 2:
                        _a.sent(); // Spawn car 5 units above ground
                        floorBody = this.world.createRigidBody(rapier3d_compat_1.RigidBodyDesc.fixed().setTranslation(0, -0.5, 0));
                        floorShape = rapier3d_compat_1.ColliderDesc.cuboid(25, 0.5, 25);
                        this.world.createCollider(floorShape, floorBody);
                        eastwallMesh = new three_1.Mesh(new three_1.BoxGeometry(10, 1.5, 1.5), new THREE.MeshBasicMaterial({
                            color: 0xff0000,
                            transparent: true,
                            opacity: 0.5
                        }));
                        eastwallMesh.receiveShadow = false;
                        eastwallMesh.position.set(5, 1.5, -5); //=================================================================//mesh an collider on same heights
                        eastwallBody = this.world.createRigidBody(rapier3d_compat_1.RigidBodyDesc.fixed().setTranslation(1.1, 1.5, -3.7)) //mesh an collider on same heights
                        ;
                        eastwallShape = rapier3d_compat_1.ColliderDesc.cuboid(3, 1.5, 0.15) //===size of an actuall real collider
                        ;
                        this.world.createCollider(eastwallShape, eastwallBody);
                        this.player = new Player_1["default"](this.scene, this.camera, this.renderer, this.world, [-9, 3, 0]); // SPAWN PLAYER COORDINATES
                        return [4 /*yield*/, this.player.init()];
                    case 3:
                        _a.sent();
                        environment = new Environment_1["default"](this.scene);
                        return [4 /*yield*/, environment.init()
                            //environment.light.target = this.player.followTarget
                        ];
                    case 4:
                        _a.sent();
                        ui = new UI_1["default"](this.renderer);
                        ui.show();
                        return [2 /*return*/];
                }
            });
        });
    };
    Game.prototype.update = function (delta) {
        var _this = this;
        var _a, _b, _c, _d, _e;
        ;
        this.world.timestep = Math.min(delta, 0.1);
        (_a = this.world) === null || _a === void 0 ? void 0 : _a.step(this.eventQueue);
        (_b = this.eventQueue) === null || _b === void 0 ? void 0 : _b.drainCollisionEvents(function (_, __, started) {
            var _a, _b;
            if (started) {
                (_a = _this.player) === null || _a === void 0 ? void 0 : _a.setGrounded();
                (_b = _this.car) === null || _b === void 0 ? void 0 : _b.update(delta);
            }
        });
        (_c = this.player) === null || _c === void 0 ? void 0 : _c.update(delta);
        (_d = this.car) === null || _d === void 0 ? void 0 : _d.update(delta); // Update car state (position, rotation)
        (_e = this.rapierDebugRenderer) === null || _e === void 0 ? void 0 : _e.update();
    };
    return Game;
}());
exports["default"] = Game;
