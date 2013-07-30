"use strict";

var COMMAND = "fpcalc",
	run = require("comandante"),
	fpcalc = run.bind(null, COMMAND),
	split = require("split");

module.exports = function(file, options, callback) {
	// Handle `options` parameter being optional
	if ( ! callback) {
		callback = options;
		options = {};
	}

	var
		// Result object to build as data is returned by fpcalc
		result = {},
		// Command-line arguments to pass to fpcalc
		args = [];

	// `-length` command-line argument
	if (options.length) {
		args.push("-length", options.length);
	}

	args.push(file);

	function onData(data) {
		// Data is given as lines like `FILE=path/to/file`, so we split the
		// parts out and build the `results` object
		var parts = data.split("=", 2),
			name = parts[0].toLowerCase(),
			value = parts[1];

		if (name) {
			result[name.toLowerCase()] = value;
		}
	}

	fpcalc(args)
		// parse one complete line at a time
		.pipe(split())
		// parse data into result object
		.on("data", onData)
		// return result object
		.on("end", callback.bind(null, null, result))
		// return error
		.on("error", callback);
};
