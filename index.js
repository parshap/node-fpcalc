"use strict";

var COMMAND = "fpcalc";

var run = require("comandante"),
	split = require("split");

module.exports = function(file, options, callback) {
	if ( ! callback) {
		callback = options;
		options = {};
	}

	var args = [];

	if (options.length) {
		args.push("-length", options.length);
	}

	args.push(file);

	// Create a result object to build as data comes in
	var result = {};

	function onData(data) {
		var parts = data.split("=", 2),
			name = parts[0].toLowerCase(),
			value = parts[1];

		if (name) {
			result[name.toLowerCase()] = value;
		}
	}

	function onEnd() {
		callback(null, result);
	}

	run(COMMAND, args)
		.pipe(split())
		.on("data", onData)
		.on("end", onEnd)
		.on("error", callback);
};
