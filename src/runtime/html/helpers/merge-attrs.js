"use strict";

var attrsHelper = require("./attrs");
var hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * Merges attribute objects into a string.
 */
module.exports = function mergeAttrs() {
    var result = "";
    var currentAttrs = {};
    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i];
        if (source != null) {
            // eslint-disable-next-line no-constant-condition
            if ("MARKO_DEBUG" && typeof source !== "object") {
                throw new Error("A non object was passed as a dynamic attributes value.");
            }

            for (var k in source) {
                if (hasOwnProperty.call(source, k)) {
                    currentAttrs[k] = source[k];
                }
            }
        }
    }

    return result + attrsHelper(currentAttrs);
};
