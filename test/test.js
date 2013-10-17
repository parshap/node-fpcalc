/* jshint node:true */
"use strict";

var path = require("path"),
	test = require("tape"),
	fpcalc = require("../");

var TEST_FILE = path.join(__dirname, "test.mp3");

test("get audio fingerprint", function(t) {
	fpcalc(TEST_FILE, function(err, result) {
		t.ifError(err);
		t.ok(result.file);
		t.ok(result.duration);
		t.equal(result.fingerprint, "AQAAT2bCawriI7l83FEc7BF-vN3xhQqeSEcTKugv_OHw48lBTj9ybN9EXEdSJSGuFXe-oUGVX7gUNExiBmXnQ-MD_5hy7rgF_vCYXGD0HD-m_8jLQt6R58TH5YCXnQhPaHmOPBHOHH9g6UZ8JoHybwh9HUws4zr4C-E7JMuJOeRxCvdkhJsSHcni_Dhx_MfX40cdX8gjQrmFnCduZYZ_EZMShhp2kUUzpTkaLmxx0iGaG1WmBGeyeQABmAAECQMYE4AwY4FSQnBCJAPIEAIEAEI4IgQhxBoCmDEGIEIAMggCAxQSgCgHjAOAAGAEcEQoQyxQRBEDEBCACAA");
		t.end();
	});
});

test("bad file path", function(t) {
	fpcalc("bad/path", function(err) {
		t.ok(err);
		t.end();
	});
});

test("no file path", function(t) {
	fpcalc(undefined, function(err) {
		t.ok(err);
		t.end();
	});
});

test("non-audio file", function(t) {
	fpcalc(path.join(__dirname, "/../index.js"), function(err) {
		t.ok(err);
		t.end();
	});
});
