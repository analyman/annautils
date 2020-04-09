import * as fs from 'fs';
import * as path from 'path';
import * as proc from 'process';
import * as util from 'util';

export function getStatOfFiles(dir: string, depth: number, cb: (err: Error, stats: fs.Stats[]) => void) //{
{
    let enter: number = 0;
    let result: fs.Stats[] = [];
    let error: Error = null;
    let func = (dir_: string, depth_: number) => {
        if(depth_ == -1) return;
        enter += 1;
        fs.stat(dir_, (err, stats) => {
            if(err || error) {
                error = err || error;
                if (--enter == 0)
                    return cb(error, result);
                return;
            }
            stats["filename"] = dir_;
            if (stats.isBlockDevice()) {
                stats["type"] = "block";
            } else if (stats.isDirectory()) {
                stats["type"] = "dir";
            } else if (stats.isFile()) {
                stats["type"] = "reg";
            } else if (stats.isCharacterDevice()) {
                stats["type"] = "char";
            } else if (stats.isSymbolicLink()) {
                stats["type"] = "symbol";
            } else if (stats.isFIFO()) {
                stats["type"] = "fifo";
            } else if (stats.isSocket()) {
                stats["type"] = "socket";
            } else {
                stats["type"] = "unknown";
            }
            result.push(stats);
            if (stats.isDirectory()) {
                enter += 1;
                fs.readdir(dir_, (errx, files: string[]) => {
                    if(errx || error) {
                        error = errx || error;
                        if (--enter == 0)
                            return cb(error, result);
                        return;
                    }
                    for (let ff of files)
                        func(path.join(dir_, ff), depth_ - 1);
                    if (--enter == 0) proc.nextTick(() => cb(null, result));
                });
            }
            if (--enter == 0) proc.nextTick(() => cb(null, result));
        });
    }
    func(dir, depth);
} //}

export const getStatOfFilesPromise: ((dir: string, depth: number) => Promise<fs.Stats[]>) = util.promisify(getStatOfFiles);

