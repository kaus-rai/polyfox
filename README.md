PolyFox Log Rotator
===================

NodeJS Log Rotator 

## Install

```
npm install polyfox
```

## Options

 - *path*:     Array of Directories where rotation needs to be done
 - *limit*:    Limitation of files needs to be present in the directory. Default Limit is 10
 - *compress*  Option to provide compression for the log files
 

## Example Usage
```javascript
    // Rotate every day or every 5 megabytes, whatever comes first.
    let polyRotateConfig = require('polyfox').rotateLog(
        {
            path : ["logs", "test"], //Array of Directories
            limit : 7, //Optional : Default number is 10
            compress: true //Optional : Default Compression is gz
        }
    );
```

## NPM Maintainers

The npm module for this library will be maintained by:

* [Kaustubh](http://github.com/komekez)

## License

polyfox is licensed under the Creative Commons Zero v1.0 Universal License.

## Features for Next Release
- Addition of Self Compression without any Dependencies
- More option for compression (compression type)

### Last Updated : 14th July 2021