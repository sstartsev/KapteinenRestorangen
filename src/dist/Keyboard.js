"use strict";
exports.__esModule = true;
var Keyboard = /** @class */ (function () {
    function Keyboard(renderer) {
        var _this = this;
        this.keyMap = {};
        this.onDocumentKey = function (e) {
            _this.keyMap[e.code] = e.type === 'keydown';
        };
        document.addEventListener('pointerlockchange', function () {
            if (document.pointerLockElement === renderer.domElement) {
                document.addEventListener('keydown', _this.onDocumentKey);
                document.addEventListener('keyup', _this.onDocumentKey);
            }
            else {
                document.removeEventListener('keydown', _this.onDocumentKey);
                document.removeEventListener('keyup', _this.onDocumentKey);
            }
        });
    }
    return Keyboard;
}());
exports["default"] = Keyboard;
