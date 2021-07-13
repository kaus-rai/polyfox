const  path = require("path");
const  fs = require("fs");
const  chokidar = require("chokidar");
const compressing = require("compressing")

/**
 * Returns the files in the given directory in sorted order
*/ 
async function sortDirFiles(dirPath) {
    const files = await fs.promises.readdir(dirPath);
    return files
        .map(fileName => ({
        name: fileName,
        time: fs.statSync(`${dirPath}/${fileName}`).mtime.getTime(),
        }))
        .sort((a, b) => a.time - b.time)
        .map(file => file.name);
}

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

async function compressLogs(logPath) {
    if(logPath) {
        const directoryPath = path.join(logPath);
        try {
            const sortedFiles = await sortDirFiles(directoryPath);
            if(sortedFiles) {
                const toBeCompressed = sortedFiles.slice(sortedFiles.length-2,sortedFiles.length-1);
                toBeCompressed.map(function(filename){
                    compressing.gzip.compressFile(directoryPath+"/"+filename, directoryPath+"/"+filename+".gz")
                    fs.unlink(directoryPath+"/"+filename, function(err) {})
                }) 
            }
        } catch (e) {
            console.log(e);
        }
    }

}

/*
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
        logPaths = '/Users/kaus/Documents/Projects/poly/logs/';
        let watcher = chokidar.watch(logPaths, {persistent: true});
        //Event Listener will be fired on addition of any file in directory
        watcher
            .on('add', async function(path) {
                //To run the function only if the log file is added
                if(path.substring(path.length, path.lastIndexOf(".")+1) !== "gz") {
                    let dirname = path.substring(0, path.lastIndexOf("/"));
                    await deleteLogFile(dirname, limit);
                    if(logConfig.compress) {
                        await compressLogs(dirname);
                    }
                }
            });
    } catch(e) {
        console.log(e);
    }
}
