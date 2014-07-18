# node-fpcalc

Calculate [AcoustID](http://acoustid.org/) audio fingerprint for a given
audio file using the [Chromaprint fpcalc
tool](http://acoustid.org/chromaprint).

# Example

```js
var fpcalc = require("fpcalc");
fpcalc("./audio.mp3", function(err, result) {
	if (err) throw err;
	console.log(result.file, result.duration, result.fingerprint);
});
```

# API

## `fpcalc(file, [options,] callback)`

Calculates the fingerprint of the given audio file.

*File* must be the path to an audio file.

*Options* may be an object with any of the following keys:

 * `length`: Length of the audio data used for fingerprint calculation
   (passed as `-length` option)
 * `command`: Path to the fpcalc command to use (defaults to `"fpcalc"`)

*Callback* must be a function that will be called with `callback(err,
result)` once the fingerprint is calculated. The *result object* will
contain the following keys:

 * `file`: Path to the audio file
 * `duration`: Duration of audio file in seconds
 * `fingerprint`: Fingerprint of audio file

# Installation

**The [*fpcalc* command-line tool](http://acoustid.org/chromaprint) must
be installed.** This is often available via your package manager (e.g.,
`apt-get install libchromaprint-tools` or `brew install chromaprint`).

```
npm install fpcalc
```
