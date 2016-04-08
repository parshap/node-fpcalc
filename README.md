# fpcalc

This module is a wrapper around the [`fpcalc` command-line tool][chromaprint]
and provides a node interface to calculate [AcoustID][] audio
fingerprints for audio files.

[chromaprint]: http://acoustid.org/chromaprint
[acoustid]: http://acoustid.org/

## Installing Chromaprint

[`fpcalc` (provided by *Chromaprint*)][chromaprint] must be installed for
this module to function.

**OSX using Homebrew**

```
$ brew install chromaprint
```

**Ubuntu**

```
$ sudo apt-get install libchromaprint-tools
```

## Example

```js
var fpcalc = require("fpcalc");
fpcalc("./audio.mp3", function(err, result) {
  if (err) throw err;
  console.log(result.file, result.duration, result.fingerprint);
});
```

## API

### `fpcalc(file, [options,] callback)`

Calculates the fingerprint of the given audio file.

*File* must be the path to an audio file.

*Options* may be an object with any of the following keys:

 * `length`: Length of the audio data used for fingerprint calculation
   (passed as `-length` option)
 * `raw`: Output the raw uncompressed fingerprint (default: `false`)
 * `command`: Path to the fpcalc command (default: `"fpcalc"` - expects
   executable in `$PATH`)

*Callback* must be a function that will be called with `callback(err,
result)` once the fingerprint is calculated. The *result object* will
contain the following keys:

 * `file`: Path to the audio file
 * `duration`: Duration of audio file in seconds
 * `fingerprint`: Fingerprint of audio file - *Buffer* if `options.raw`,
   *String* otherwise

## Installation

```
npm install --save fpcalc
```
