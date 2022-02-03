"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeMeta = exports.runMeta = exports.addMeta = exports.deleteMeta = exports.getMeta = exports.setMeta = void 0;
function setMeta(metadata, key, value) {
    metadata[key] = value;
}
exports.setMeta = setMeta;
function getMeta(metadata, key, init) {
    const result = metadata[key];
    if (result === undefined && init !== undefined) {
        setMeta(metadata, key, init);
    }
    return metadata[key];
}
exports.getMeta = getMeta;
function deleteMeta(metadata, key) {
    delete metadata[key];
}
exports.deleteMeta = deleteMeta;
function addMeta(metadata, key, value = 1) {
    const check = metadata[key];
    if (check !== undefined && typeof check !== "number") {
        return;
    }
    metadata[key] = (check || 0) + value;
}
exports.addMeta = addMeta;
function runMeta(metadata, key, type, ...argv) {
    const check = metadata[key];
    const test = check && check[type];
    if (typeof test !== "function") {
        return undefined;
    }
    return test(...argv);
}
exports.runMeta = runMeta;
function mergeMeta(target, value) {
    Object.keys(value).forEach((key) => {
        setMeta(target, key, value[key]);
    });
}
exports.mergeMeta = mergeMeta;
