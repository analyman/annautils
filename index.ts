import * as chmod from './lib/chmod';
import * as streamx from './lib/stream';
import * as info from './lib/info';

export namespace fs {
    export const chmodRecursive = chmod.chmod_files;
    export const getStatsOfFiles = info.getStatOfFiles;

    export namespace promisify {
        export const chmodRecursive = chmod.chmodFiles;
        export const getStatsOfFiles = info.getStatOfFilesPromise;
    }
}

export namespace stream {
    export  const fdWriteToWritable = streamx.fwriteToWritable;
    export  const pahtWriteToWritable = streamx.writeToWritable;

    export namespace promisify {
        export  const fdWriteToWritable = streamx.fwriteToWritable_promisify;
        export  const pahtWriteToWritable = streamx.writeToWritable_promisify;
    }
}
