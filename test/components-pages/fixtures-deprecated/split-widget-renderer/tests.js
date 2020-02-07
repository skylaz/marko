var expect = require("chai").expect;

it("should allow widget to be split from renderer", function() {
    var widget = window.appButtonSplit;
    expect(widget.el.textContent).to.equal("Test Button");
    widget.setLabel("New Label");
    expect(widget.el.textContent).to.equal("New Label");
});
