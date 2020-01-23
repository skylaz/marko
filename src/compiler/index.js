"use strict";

var babel = require("@babel/core");
var markoBabelPlugin = require("babel-plugin-marko");
var extend = require("raptor-util/extend");
var globalConfig = require("./config");
var ok = require("assert").ok;
var fs = require("fs");
var pkg = require("../../package.json");
var taglib = require("../taglib");
var defaults = extend({}, globalConfig);

var defaultOptionsExportDefinition = {
    get: function() {
        return globalConfig;
    },
    enumerable: true,
    configurable: false
};

Object.defineProperties(exports, {
    defaultOptions: defaultOptionsExportDefinition,
    config: defaultOptionsExportDefinition
});

function configure(newConfig) {
    if (!newConfig) {
        newConfig = {};
    }

    globalConfig = extend({}, defaults);
    extend(globalConfig, newConfig);
}

function _compile(src, filename, userConfig, callback) {
    ok(filename, '"filename" argument is required');
    ok(typeof filename === "string", '"filename" argument should be a string');

    var markoConfig = {};
    var baseBabelConfig = {
        filename: filename,
        sourceFileName: filename,
        sourceType: "module",
        plugins: [[markoBabelPlugin, markoConfig]]
    };

    extend(markoConfig, globalConfig);

    if (userConfig) {
        extend(markoConfig, userConfig);
    }

    if (markoConfig.writeVersionComment) {
        baseBabelConfig.auxiliaryCommentBefore =
            "Compiled using marko@" + pkg.version + " - DO NOT EDIT";
    }

    if (markoConfig.babelConfig) {
        extend(baseBabelConfig, markoConfig.babelConfig);
    }

    var babelConfig = babel.loadPartialConfig(baseBabelConfig).options;
    let result;

    try {
        const compiled = babel.transformSync(src, babelConfig);
        result = userConfig.sourceOnly
            ? compiled.code
            : {
                  code: compiled.code,
                  meta: compiled.metadata.marko
              };
    } catch (e) {
        if (callback) {
            return callback(e);
        } else {
            throw e;
        }
    }

    if (callback) {
        callback(null, result);
    } else {
        return result;
    }
}

function compile(src, filename, options, callback) {
    if (typeof options === "function") {
        callback = options;
        options = null;
    }

    options = options || {};
    options.sourceOnly = options.sourceOnly !== false;

    return _compile(src, filename, options, callback);
}

function compileForBrowser(src, filename, options, callback) {
    if (typeof options === "function") {
        callback = options;
        options = null;
    }

    options = extend(
        {
            output: "vdom",
            meta: false,
            sourceOnly: false
        },
        options
    );

    return compile(src, filename, options, callback);
}

function compileFile(filename, options, callback) {
    if (typeof options === "function") {
        callback = options;
        options = null;
    }

    options = options || {};
    options.sourceOnly = options.sourceOnly !== false;

    if (callback) {
        fs.readFile(filename, { encoding: "utf8" }, function(err, templateSrc) {
            if (err) {
                return callback(err);
            }

            _compile(templateSrc, filename, options, callback);
        });
    } else {
        let templateSrc = fs.readFileSync(filename, { encoding: "utf8" });
        return _compile(templateSrc, filename, options, callback);
    }
}

function compileFileForBrowser(filename, options, callback) {
    if (typeof options === "function") {
        callback = options;
        options = null;
    }

    options = extend(
        { output: "vdom", meta: false, sourceOnly: false },
        options
    );
    return compileFile(filename, options, callback);
}

exports.compileFile = compileFile;
exports.compile = compile;
exports.compileForBrowser = compileForBrowser;
exports.compileFileForBrowser = compileFileForBrowser;

exports.configure = configure;

Object.defineProperties(exports, {
    taglibLookup: {
        get() {
            return taglib.lookup;
        }
    },
    taglibLoader: {
        get() {
            return taglib.loader;
        }
    },
    taglibFinder: {
        get() {
            return taglib.finder;
        }
    }
});

exports.clearCaches = function clearCaches() {
    taglib.clearCache();
};

exports.registerTaglib = function(filePath) {
    ok(typeof filePath === "string", '"filePath" should be a string');
    taglib.registerFromFile(filePath);
    exports.clearCaches();
};

exports.isVDOMSupported = true;
exports.modules = require("./modules");
