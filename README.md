Poly Log Rotator
===================

NodeJS Log Rotator 

## Install

```
npm install poly
```

## Options

 - *path*:     Array of Directories where rotation needs to be done
 - *limit*:    Limitation of files needs to be present in the directory. Default Limit is 10
 

## Example Usage
```javascript
    // Rotate every day or every 5 megabytes, whatever comes first.
    let polyRotateConfig = require('poly').rotateLog(
        {
            path : ["logs", "test"], //Array of Directories
            limit : 7 //Optional
        }
    );
```

## NPM Maintainers

The npm module for this library will be maintained by:

* [Kaustubh](http://github.com/komekez)

## License

poly is licensed under the MIT license.