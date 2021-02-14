"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractQueryParameter = extractQueryParameter;
exports.getTime = getTime;

function extractQueryParameter(url, parameter) {
  var parsedUrl = new URL(url);
  return parsedUrl.searchParams.get(parameter);
}

function getTime() {
  return Math.round(new Date().getTime() / 1000);
}