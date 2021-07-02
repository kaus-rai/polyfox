import path from "path";
import fs from "fs";

export async function sortDirFiles(dirPath) {
    const files = await fs.promises.readdir(dirPath);
    return files
        .map(fileName => ({
        name: fileName,
        time: fs.statSync(`${dirPath}/${fileName}`).mtime.getTime(),
        }))
        .sort((a, b) => a.time - b.time)
        .map(file => file.name);
}

export async function deleteLogFile(logPath, logLimit) {
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
            console.log(e);
        }
    }
}
