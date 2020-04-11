import * as chmod from './lib/chmod';
import * as streamx from './lib/stream';
import * as info from './lib/info';
import * as miscx from './lib/misc';
import * as cproc from './lib/child_process';
import * as rm_rf from './lib/rm_rf';

export namespace fs {
    export const chmodRecursive = chmod.chmod_files;
    export const getStatsOfFiles = info.getStatOfFiles;

    export const removeRecusive = rm_rf.remove_rf;

    export namespace promisify {
        export const chmodRecursive = chmod.chmodFiles;
        export const getStatsOfFiles = info.getStatOfFilesPromise;
        export const removeRecusive = rm_rf.remove_rf_promisify;
    }
}

export namespace stream {
    export  const fdWriteToWritable = streamx.fwriteToWritable;
    export  const pathWriteToWritable = streamx.writeToWritable;
    export const fdWriteToWritableSync = streamx.fwriteToWritableSync;
    export  const pathWriteToWritableSync = streamx.writeToWritableSync;

    export namespace promisify {
        export  const fdWriteToWritable = streamx.fwriteToWritable_promisify;
        export  const pathWriteToWritable = streamx.writeToWritable_promisify;
    }
}

export namespace misc {
    export const makeId = miscx.makeid;
}

export namespace child_process {
    export const runTo = cproc.run_to;
    export namespace promisify {
        export const runTo = cproc.run_to_promisify;
    }
}

