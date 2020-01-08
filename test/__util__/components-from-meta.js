const path = require("path");

const getComponents = (module.exports = (template, components) => {
    var meta = template.meta;
    components = components || {};
    if (meta) {
        if (!components[meta.id]) {
            components[meta.id] = template.path;

            if (meta.tags) {
                meta.tags.forEach(tagRelativePath => {
                    var tagPath =
                        "." === tagRelativePath[0]
                            ? path.resolve(
                                  path.dirname(template.path),
                                  tagRelativePath
                              )
                            : tagRelativePath;
                    var tagTemplate = require(tagPath);
                    tagTemplate = tagTemplate.default || tagTemplate;
                    components = getComponents(tagTemplate, components);
                });
            }
        }
    }
    return components;
});
