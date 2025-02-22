"use strict";

var complain = "MARKO_DEBUG" && require("complain");
var attrHelper = require("./attr");
var classAttrHelper = require("./class-attr");
var styleAttrHelper = require("./style-attr");

// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
var invalidAttrNameCharacters = /[\s'"</=\\]/u;
var validAttrs = new Set();
var invalidAttrs = new Set();

module.exports = function attrs(arg) {
  if (typeof arg === "object") {
    var out = "";
    for (var attrName in arg) {
      if (attrName === "style") {
        out += styleAttrHelper(arg[attrName]);
      } else if (attrName === "class") {
        out += classAttrHelper(arg[attrName]);
      } else if (attrName !== "renderBody" && isValidAttrName(attrName)) {
        out += attrHelper(attrName, arg[attrName]);
      }
    }
    return out;
  } else if (typeof arg === "string") {
    // eslint-disable-next-line no-constant-condition
    if ("MARKO_DEBUG") {
      complain(
        "Passing a string as a dynamic attribute value is deprecated - More details: https://github.com/marko-js/marko/wiki/Deprecation:-String-as-dynamic-attribute-value"
      );
    }
    return arg;
  }
  return "";
};

function isValidAttrName(attrName) {
  if (validAttrs.has(attrName)) return true;
  if (invalidAttrs.has(attrName)) return false;

  if (invalidAttrNameCharacters.test(attrName)) {
    invalidAttrs.add(attrName);
    return false;
  }

  validAttrs.add(attrName);
  return true;
}
