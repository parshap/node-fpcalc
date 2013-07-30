"use strict";

var path = require("path"),
	test = require("tape"),
	fpcalc = require("../");

var TEST_FILE = path.join(__dirname, "test.mp3");

test("test audio fingerprint", function(t) {
	t.plan(4);
	fpcalc(TEST_FILE, function(err, result) {
		t.ifError(err);
		t.ok(result.file);
		t.ok(result.duration);
		t.ok(result.fingerprint);
	});
});
