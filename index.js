/* jshint node:true */
"use strict";

module.exports = function(file, options, callback) {
	// Handle `options` parameter being optional
	if ( ! callback) {
		callback = options;
		options = {};
	}

	// Command-line arguments to pass to fpcalc
	var args = [];

	// `-length` command-line argument
	if (options.length) {
		args.push("-length", options.length);
	}

	args.push(file);

	run(args)
		.on("error", callback)
		.pipe(parse(callback.bind(null, null)));
};

// -- Run fpcalc command

var spawn = require("child_process").spawn,
	fpcalc = spawn.bind(null, "fpcalc"),
	es = require("event-stream"),
	concat = require("concat-stream");

// Runs the fpcalc tool and returns a readable stream that will emit stdout
// or an error event if an error occurs
function run(args) {
	var
		// Create fpcalc child process
		cp = fpcalc(args),
		// Create a through stream that passes through data but does not end
		// when the source stream ends. We will manually end the stream once
		// the child processes closes.
		stream = es.through(null, function() {});

	// Pass fpcalc stdout through the stream
	cp.stdout.pipe(stream);

	// Catch fpcalc stderr errors even when exit code is 0
	// See https://bitbucket.org/acoustid/chromaprint/issue/2/fpcalc-return-non-zero-exit-code-if
	cp.stderr.pipe(concat(function(data) {
		data = data.toString();
		if (data && data.slice(0, 6) === "ERROR:") {
			stream.emit("error", new Error(data));
		}
	}));

	// End the stream when the child processes closes
	cp.on("close", function() {
		stream.queue(null);
	});

	return stream;
}

// -- fpcalc stdout stream parsing

function parse(callback) {
	return es.pipeline(
		// Parse one complete line at a time
		es.split(),
		// Only use non-empty lines
		filter(Boolean),
		// Parse each line into name/value pair
		es.mapSync(parseData),
		// Reduce data into single result object to pass to callback
		reduce(function(result, data) {
			result[data.name] = data.value;
			return result;
		}, {}, callback)
	);
}

// Create a through stream that only passes data that passes the given test
// @TODO Extract this to own module
function filter(test) {
	return es.mapSync(function(data) {
		if (test(data)) {
			return data;
		}
	});
}

// Reduce stream data into a single value
// @TODO Extract this to own module
function reduce(fn, acc, callback) {
	return es.through(function(data) {
		acc = fn(acc, data);
	}, function() {
		callback(acc);
	});
}

// Data is given as lines like `FILE=path/to/file`, so we split the
// parts out to a name/value pair
function parseData(data) {
	var index = data.indexOf("=");
	return {
		name: data.slice(0, index).toLowerCase(),
		value: data.slice(index + 1),
	};
}
