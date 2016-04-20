/* jshint node:true */
"use strict";

var once = require("once");

module.exports = function(file, options, callback) {
	// Handle `options` parameter being optional
	if ( ! callback) {
		callback = options;
		options = {};
	}

	// Make sure the callback is called only once
	callback = once(callback);

	// Command-line arguments to pass to fpcalc
	var args = [];

	// `-length` command-line argument
	if (options.length) {
		args.push("-length", options.length);
	}

	// `-raw` command-line argument
	if (options.raw) {
		args.push("-raw");
	}

	args.push(file);

	run(args, options)
		.on("error", callback)
		.pipe(parse())
		.on("data", function(results) {
			if (options.raw) {
				var fingerprint = results.fingerprint
					.split(",")
					.map(function(value) {
						return parseInt(value);
					});
				results.fingerprintRaw = results.fingerprint;
				results.fingerprint = new Buffer(fingerprint.length * 4);
				for (var i = 0; i < fingerprint.length; i ++) {
					results.fingerprint.writeInt32BE(fingerprint[i], i * 4, true);
				}
			}
			callback(null, results);
		});
};

// -- Run fpcalc command

var spawn = require("child_process").spawn,
	es = require("event-stream"),
	concat = require("concat-stream"),
	filter = require("stream-filter"),
	reduce = require("stream-reduce");

// Runs the fpcalc tool and returns a readable stream that will emit stdout
// or an error event if an error occurs
function run(args, options) {
	var
		// The command to run
		command = options.command || "fpcalc",

		// Start the  fpcalc child process
		cp = spawn(command, args),

		// Create the stream that we will eventually return. This stream
		// passes through any data (cp's stdout) but does not emit an end
		// event so that we can make sure the process exited without error.
		stream = es.through(null, function() {});

	// Pass fpcalc stdout through the stream
	cp.stdout.pipe(stream);

	// Catch fpcalc stderr errors even when exit code is 0
	// See https://bitbucket.org/acoustid/chromaprint/issue/2/fpcalc-return-non-zero-exit-code-if
	cp.stderr.pipe(concat(function(data) {
		if (data &&
			(data = data.toString()) &&
			data.slice(0, 6) === "ERROR:") {
			stream.emit("error", new Error(data));
		}
	}));

	// Check process exit code and end the stream
	cp.on("close", function(code) {
		if (code !== 0) {
			stream.emit("error", new Error("fpcalc failed"));
		}

		stream.queue(null);
	});

	return stream;
}

// -- fpcalc stdout stream parsing

function parse() {
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
		}, {})
	);
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
