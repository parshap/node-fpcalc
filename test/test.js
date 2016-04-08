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
		t.ok(result.fingerprint);
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

test("fingerprint output", function(t) {
	t.plan(5);

	fpcalc(TEST_FILE, {raw: true}, function(err, result) {
		t.ok(result.fingerprint);
		t.ok(Buffer.isBuffer(result.fingerprint));
	});

	fpcalc(TEST_FILE, function(err, result) {
		t.ok(result.fingerprint);
		t.equal(typeof result.fingerprint, "string");
		t.ok(/^[-_a-zA-Z0-9]+$/.test(result.fingerprint));
	});
});
