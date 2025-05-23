"use strict";
exports.__esModule = true;
var three_1 = require("three");
var FollowCam = /** @class */ (function () {
    function FollowCam(scene, camera, renderer) {
        var _this = this;
        this.pivot = new three_1.Object3D();
        this.yaw = new three_1.Object3D();
        this.pitch = new three_1.Object3D();
        this.onDocumentMouseMove = function (e) {
            _this.yaw.rotation.y -= e.movementX * 0.002;
            var v = _this.pitch.rotation.x - e.movementY * 0.002;
            // limit range
            if (v > -1 && v < 1) {
                _this.pitch.rotation.x = v;
            }
        };
        this.onDocumentMouseWheel = function (e) {
            e.preventDefault();
            var v = _this.camera.position.z + e.deltaY * 0.005;
            // limit range
            if (v >= 0.5 && v <= 10) {
                _this.camera.position.z = v;
            }
        };
        this.camera = camera;
        this.yaw.position.y = 1.15; // the initial height that the camera is being positioned
        document.addEventListener('pointerlockchange', function () {
            if (document.pointerLockElement === renderer.domElement) {
                renderer.domElement.addEventListener('mousemove', _this.onDocumentMouseMove);
                renderer.domElement.addEventListener('wheel', _this.onDocumentMouseWheel);
            }
            else {
                renderer.domElement.removeEventListener('mousemove', _this.onDocumentMouseMove);
                renderer.domElement.removeEventListener('wheel', _this.onDocumentMouseWheel);
            }
        });
        scene.add(this.pivot);
        this.pivot.add(this.yaw);
        this.yaw.add(this.pitch);
        this.pitch.add(camera); // adding the perspective camera to the hierarchy
    }
    return FollowCam;
}());
exports["default"] = FollowCam;
