const  path = require("path");
const  fs = require("fs");
const  chokidar = require("chokidar");
const compressing = require("compressing")

/**
 * Returns the files in the given directory in sorted order
*/ 
async function sortDirFiles(dirPath) {
    const filteredFiles = [];
    const files = await fs.promises.readdir(dirPath);
    files.map(function(filename) {
        if(['log', 'gz'].includes(filename.substring(filename.length, filename.lastIndexOf(".")+1))) {
                filteredFiles.push(filename)
        }
    })
    return filteredFiles
        .map(fileName => ({
            name: fileName,
            time: fs.statSync(`${dirPath}/${fileName}`).birthtime.getTime(),
        }))
        .sort((a, b) => a.time - b.time)
        .map(file => file.name);
}

/**
 * Remove the oldest log file wheneven new log file added
*/ 
async function deleteLogFile(logPath, logLimit) {
    if(logPath) {
        const directoryPath = path.join(logPath);
        try {
            const sortedFiles = await sortDirFiles(directoryPath);  
            if(sortedFiles && sortedFiles.length > logLimit) {
                const removeLogCount = sortedFiles.length - logLimit;
                const toBeRemovedFiles = sortedFiles.slice(0,removeLogCount);
                toBeRemovedFiles.map(function(filename) {
                    fs.unlink(directoryPath+"/"+filename, function(err) {
                    });
                })
            }
        } catch (e) {
        }
    }
}

/**
 * Compress the log files except for the latest log
*/ 
async function compressLogs(logPath) {
    if(logPath) {
        const directoryPath = path.join(logPath);
        try {
            const sortedFiles = await sortDirFiles(directoryPath);
            if(sortedFiles) {
                let compressFile = [];
                let toBeCompressed = sortedFiles.slice(0, sortedFiles.length-1);

                //Fetch only the files not having gz extensions
                toBeCompressed.map(function(file) {
                    if(file.substring(file.length, file.lastIndexOf(".")+1) !== "gz") {
                        compressFile.push(file)
                    }
                });

                //Compress the file and remove the log file
                compressFile.map(function(filename){
                    compressing.gzip.compressFile(directoryPath+"/"+filename, directoryPath+"/"+filename+".gz")
                    fs.unlink(directoryPath+"/"+filename, function(err) {})
                }) 
            }
        } catch (e) {
        }
    }

}

/**
    * Rotate the log according to the configuration
*/
exports.rotateLog = async (logConfig) => {
    try {
        //Complete path is build by taking the directory path and adding the relative path provided in the config
        let folderPath = __dirname.substring(0, __dirname.lastIndexOf("/node_modules"));
        let limit = logConfig.limit || 10;

        let logPaths = (logConfig.path).map(function(path){
            if(path.charAt(0) === "/") {
                return folderPath+path;
            }
            return folderPath+"/"+path;
        })
        let watcher = chokidar.watch(logPaths, {persistent: true});
        //Event Listener will be fired on addition of any file in directory
        watcher
            .on('add', async function(path) {

                //To run the compression and deletion only case of log file
                if(!["gz", "swp"].includes(path.substring(path.length, path.lastIndexOf(".")+1))) {
                    let dirname = path.substring(0, path.lastIndexOf("/"));
                    await deleteLogFile(dirname, limit);

                    //Option for compression
                    if(logConfig.compress) {
                        await compressLogs(dirname);
                    }
                }
            });
    } catch(e) {
    }
}
