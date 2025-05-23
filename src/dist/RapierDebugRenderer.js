"use strict";
exports.__esModule = true;
var three_1 = require("three");
var RapierDebugRenderer = /** @class */ (function () {
    function RapierDebugRenderer(scene, world) {
        this.enabled = true;
        this.world = world;
        this.mesh = new three_1.LineSegments(new three_1.BufferGeometry(), new three_1.LineBasicMaterial({ color: 0xffffff, vertexColors: true }));
        this.mesh.frustumCulled = false;
        scene.add(this.mesh);
    }
    RapierDebugRenderer.prototype.update = function () {
        if (this.enabled) {
            var _a = this.world.debugRender(), vertices = _a.vertices, colors = _a.colors;
            this.mesh.geometry.setAttribute('position', new three_1.BufferAttribute(vertices, 3));
            this.mesh.geometry.setAttribute('color', new three_1.BufferAttribute(colors, 4));
            this.mesh.visible = true;
        }
        else {
            this.mesh.visible = false;
        }
    };
    return RapierDebugRenderer;
}());
exports["default"] = RapierDebugRenderer;
