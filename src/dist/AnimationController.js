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
var THREE = require("three/src/Three.js");
var Eve_1 = require("./Eve");
var AnimationController = /** @class */ (function () {
    function AnimationController(scene, keyboard) {
        this.wait = false;
        this.animationActions = {};
        this.speed = 0;
        this.scene = scene;
        this.keyboard = keyboard;
    }
    AnimationController.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.model = new Eve_1["default"]();
                        return [4 /*yield*/, this.model.init(this.animationActions)];
                    case 1:
                        _a.sent();
                        this.activeAction = this.animationActions['idle'];
                        this.scene.add(this.model);
                        return [2 /*return*/];
                }
            });
        });
    };
    AnimationController.prototype.setAction = function (action) {
        var _a;
        if (this.activeAction != action) {
            (_a = this.activeAction) === null || _a === void 0 ? void 0 : _a.fadeOut(0.1);
            action.reset().fadeIn(0.1).play();
            this.activeAction = action;
            switch (action) {
                case this.animationActions['walk']:
                    this.speed = 5.25;
                    break;
                case this.animationActions['run']:
                case this.animationActions['jump']:
                    this.speed = 16;
                    break;
                case this.animationActions['pose']:
                case this.animationActions['idle']:
                    this.speed = 0;
                    break;
                case this.animationActions['enteringacar']:
                    this.speed = 16;
                    break;
            }
        }
    };
    AnimationController.prototype.update = function (delta) {
        var _this = this;
        var _a, _b;
        if (!this.wait) {
            var actionAssigned = false;
            if (this.keyboard.keyMap['Space']) {
                this.setAction(this.animationActions['jump']);
                actionAssigned = true;
                this.wait = true; // blocks further actions until jump is finished
                setTimeout(function () { return (_this.wait = false); }, 1200);
            }
            if (!actionAssigned &&
                this.keyboard.keyMap['KeyW'] && this.keyboard.keyMap['ShiftLeft']) {
                this.setAction(this.animationActions['run']);
                actionAssigned = true;
            }
            if (!actionAssigned && this.keyboard.keyMap['KeyW']) {
                this.setAction(this.animationActions['walk']);
                actionAssigned = true;
            }
            if (!actionAssigned && this.keyboard.keyMap['KeyQ']) {
                this.setAction(this.animationActions['pose']);
                actionAssigned = true;
            }
            // Dedicated block for "E" that ensures enteringacar plays fully
            if (!actionAssigned && this.keyboard.keyMap['KeyE']) {
                // Only trigger if not already playing
                if (this.activeAction !== this.animationActions['enteringacar']) {
                    var enteringCarAction = this.animationActions['enteringacar'];
                    // Configure the action to only loop once
                    enteringCarAction.setLoop(THREE.LoopOnce, 1);
                    enteringCarAction.clampWhenFinished = true;
                    if (enteringCarAction.clampWhenFinished == true) {
                        (_a = this.model) === null || _a === void 0 ? void 0 : _a.position.set(9, 0, -3);
                    }
                    // Optionally, reset the action to start from the beginning
                    enteringCarAction.reset();
                    this.setAction(enteringCarAction);
                    actionAssigned = true;
                    this.wait = true;
                }
            }
            // New block for "F" that plays enteringacar in reverse
            if (!actionAssigned && this.keyboard.keyMap['KeyF']) {
                if (this.activeAction !== this.animationActions['enteringacar']) {
                    var enteringCarAction = this.animationActions['enteringacar'];
                    enteringCarAction.setLoop(THREE.LoopOnce, 1);
                    enteringCarAction.clampWhenFinished = true;
                    enteringCarAction.timeScale = -1; // This makes it play in reverse
                    enteringCarAction.reset();
                    // Set time to the end of the animation to start playing backwards from there
                    enteringCarAction.time = enteringCarAction.getClip().duration;
                    this.setAction(enteringCarAction);
                    actionAssigned = true;
                    this.wait = true;
                    // Add a listener to reset to idle when reverse animation completes
                    var duration = enteringCarAction.getClip().duration * 1000; // Convert to milliseconds
                    setTimeout(function () {
                        _this.wait = false;
                        _this.setAction(_this.animationActions['idle']);
                    }, duration);
                }
            }
            if (!actionAssigned) {
                this.setAction(this.animationActions['idle']);
            }
        }
        // update the Eve model's animation mixer
        (_b = this.model) === null || _b === void 0 ? void 0 : _b.update(delta);
    };
    return AnimationController;
}());
exports["default"] = AnimationController;
