"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var GLTFLoader_js_1 = require("three/examples/jsm/loaders/GLTFLoader.js");
var DRACOLoader_js_1 = require("three/examples/jsm/loaders/DRACOLoader.js");
var Eve = /** @class */ (function (_super) {
    __extends(Eve, _super);
    function Eve() {
        var _this = _super.call(this) || this;
        var dracoLoader = new DRACOLoader_js_1.DRACOLoader();
        dracoLoader.setDecoderPath('jsm/libs/draco/');
        _this.glTFLoader = new GLTFLoader_js_1.GLTFLoader();
        _this.glTFLoader.setDRACOLoader(dracoLoader);
        return _this;
    }
    Eve.prototype.init = function (animationActions) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, eve, idle, run, jump, pose, enteringacar, enteringcarAction;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Promise.all([
                            this.glTFLoader.loadAsync('/models/sym/eve$@walk.glb'),
                            this.glTFLoader.loadAsync('/models/sym/eve@idle.glb'),
                            this.glTFLoader.loadAsync('/models/sym/eve@run.glb'),
                            this.glTFLoader.loadAsync('/models/sym/eve@jump.glb'),
                            this.glTFLoader.loadAsync('/models/sym/eve@pose.glb'),
                            this.glTFLoader.loadAsync('/models/sym/eve@enteringacar.glb'),
                        ])];
                    case 1:
                        _a = _b.sent(), eve = _a[0], idle = _a[1], run = _a[2], jump = _a[3], pose = _a[4], enteringacar = _a[5];
                        eve.scene.traverse(function (m) {
                            if (m.isMesh) {
                                m.castShadow = true;
                            }
                        });
                        this.mixer = new three_1.AnimationMixer(eve.scene);
                        // Create all animation actions first
                        animationActions['idle'] = this.mixer.clipAction(idle.animations[0]);
                        animationActions['walk_full'] = this.mixer.clipAction(eve.animations[0]);
                        animationActions['walk'] = this.mixer.clipAction(three_1.AnimationUtils.subclip(eve.animations[0], 'walk', 0, 42));
                        animationActions['run_full'] = this.mixer.clipAction(run.animations[0]);
                        animationActions['run'] = this.mixer.clipAction(three_1.AnimationUtils.subclip(run.animations[0], 'run', 0, 17));
                        // Handle jump animation
                        jump.animations[0].tracks = jump.animations[0].tracks.filter(function (e) { return !e.name.endsWith('.position'); });
                        animationActions['jump'] = this.mixer.clipAction(jump.animations[0]);
                        // Handle enteringacar animation
                        animationActions['enteringacar'] = this.mixer.clipAction(three_1.AnimationUtils.subclip(eve.animations[0], 'enteringacar', 0, 42));
                        // Handle pose animation
                        animationActions['pose'] = this.mixer.clipAction(pose.animations[0]);
                        // Handle enteringacar animation - keep position tracks
                        animationActions['enteringacar'] = this.mixer.clipAction(enteringacar.animations[0]);
                        enteringcarAction = animationActions['enteringacar'];
                        if (enteringcarAction) {
                            enteringcarAction.setLoop(THREE.LoopOnce, 1);
                            enteringcarAction.clampWhenFinished = true;
                        }
                        // Set initial animation
                        this.currentAction = animationActions['idle'];
                        this.currentAction.play();
                        this.add(eve.scene);
                        return [2 /*return*/];
                }
            });
        });
    };
    Eve.prototype.update = function (delta) {
        var _a;
        (_a = this.mixer) === null || _a === void 0 ? void 0 : _a.update(delta);
    };
    return Eve;
}(three_1.Group));
exports["default"] = Eve;
