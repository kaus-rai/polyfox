import path from "path";
import fs from "fs";

function deleteLogFile(logPath, logLimit) {
    if(logPath) {
        const directoryPath = path.join(logPath);
        try {
            fs.readdir(directoryPath, function(err, files){
                if(files.length > logLimit) {
                    const removeLogCount = files.length - logLimit;
                    const toBeRemovedFiles = files.slice(0,removeLogCount);
                    toBeRemovedFiles.map(function(filename) {
                        fs.unlink(directoryPath+"/"+filename, function(err) {
                            console.log(err);
                        });
                    })
                }
            })
        } catch (e) {
            console.log(e);
        } 
    }
}
