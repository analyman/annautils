import * as chmod from './lib/chmod';
import * as streamx from './lib/stream';

export namespace fs {
    export const chmodRecursive = chmod.chmod_files;

    export namespace promisify {
        export const chmodRecursive = chmod.chmodFiles;
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
