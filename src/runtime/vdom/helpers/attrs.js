"use strict";

var changeCase = require("../../helpers/_change-case");
var classHelper = require("../../helpers/class-value");
var styleHelper = require("../../helpers/style-value");

/**
 * Helper for processing dynamic attributes
 */
module.exports = function(attributes) {
    if (attributes) {
        var newAttributes = {};

        for (var attrName in attributes) {
            var val = attributes[attrName];
            if (attrName === "renderBody") {
                continue;
            }

            if (attrName === "class") {
                val = classHelper(val);
            } else if (attrName === "style") {
                val = styleHelper(val);
            } else {
                attrName = changeCase.___camelToDashCase(attrName);
            }

            newAttributes[attrName] = val;
        }

        return newAttributes;
    }

    return attributes;
};

