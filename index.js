import {deleteLogFile} from "./lib/rotate.js";
import chokidar  from "chokidar";

export class poly  {
    constructor(logConfig) {
        this.logConfig = logConfig;
    }
}

export function rotateLog(logConfig) {
    try {
        let limit = logConfig.limit || 10;
        let watcher = chokidar.watch(logConfig.path, {ignored: /^\./, persistent: true});
        watcher
            .on('add', function(path, stats) {
                let dirname = path.substring(0, path.lastIndexOf("/"));
                deleteLogFile(dirname, limit);
            });
    } catch(e) {
        console.log(e);
    }
}
