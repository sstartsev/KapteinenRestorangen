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
var RGBELoader_js_1 = require("three/addons/loaders/RGBELoader.js");
var Lensflare_js_1 = require("three/addons/objects/Lensflare.js");
var GLTFLoader_js_1 = require("three/examples/jsm/loaders/GLTFLoader.js");
var ocean_1 = require("./ocean"); // Adjust the path as needed
var Environment = /** @class */ (function () {
    function Environment(scene) {
        this.scene = scene;
        var oceanScene = ocean_1.createOceanScene();
        this.scene.add(oceanScene);
        this.scene.add(new three_1.GridHelper(50, 50));
        this.light = new three_1.DirectionalLight(0xeeaf61, Math.PI);
        this.light.position.set(-180, 0, -11);
        this.light.castShadow = true;
        this.scene.add(this.light);
        new GLTFLoader_js_1.GLTFLoader().load('/models/FinalCut/FinalCut.glb', function (gltf) {
            console.log(gltf);
            gltf.scene.traverse(function (child) {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            gltf.scene.scale.set(0.0254, 0.0254, 0.0254);
            gltf.scene.rotateY(-22);
            gltf.scene.position.set(0, 0, 0);
            scene.add(gltf.scene);
        });
        //const directionalLightHelper = new CameraHelper(this.light.shadow.camera)
        //this.scene.add(directionalLightHelper)
        var textureLoader = new three_1.TextureLoader();
        var textureFlare0 = textureLoader.load('img/lensflare0.png');
        var textureFlare3 = textureLoader.load('img/lensflare3.png');
        var lensflare = new Lensflare_js_1.Lensflare();
        lensflare.addElement(new Lensflare_js_1.LensflareElement(textureFlare0, 1000, 0));
        lensflare.addElement(new Lensflare_js_1.LensflareElement(textureFlare3, 500, 0.2));
        lensflare.addElement(new Lensflare_js_1.LensflareElement(textureFlare3, 250, 0.8));
        lensflare.addElement(new Lensflare_js_1.LensflareElement(textureFlare3, 125, 0.6));
        lensflare.addElement(new Lensflare_js_1.LensflareElement(textureFlare3, 62.5, 0.4));
        this.light.add(lensflare);
    }
    Environment.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new RGBELoader_js_1.RGBELoader().loadAsync('img/venice_sunset_1k.hdr').then(function (texture) {
                            texture.mapping = three_1.EquirectangularReflectionMapping;
                            _this.scene.environment = texture;
                            _this.scene.background = texture;
                            _this.scene.backgroundBlurriness = 3;
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return Environment;
}());
exports["default"] = Environment;
