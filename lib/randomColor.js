"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomColor = void 0;
var getRandomColor = function () {
    return "#".concat(Math.floor(Math.random() * 16777215).toString(16));
};
exports.getRandomColor = getRandomColor;
