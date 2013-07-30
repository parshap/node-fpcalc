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
		t.ok(result.fingerprint);
		t.end();
	});
});

test("bad file path", function(t) {
	fpcalc("bad/path", function(err, result) {
		t.ok(err);
		t.end();
	});
});
