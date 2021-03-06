import * as fs from 'fs';
import { Writable } from 'stream';
import * as util from 'util';
import * as proc from 'process';

export function fwriteToWritable(fd: number, startPosition: number, writer: Writable, length: number = -1,
                         chunksize: number = 1024, callend: boolean = true, cb: (err: Error, nbytes: number) => void = null): void //{
{
    if (chunksize <= 0) {
        return cb(new Error("bad chunksize"), 0);
    }
    let writed: number = 0;
    let write_error: Error = null;
    let writer_onerror = (err) => {
        write_error = err;
    };
    writer.on("error", writer_onerror);

    let wrap_cb = (err, nbytes) => {
        writer.removeListener("error", writer_onerror);
        writer.removeListener("drain", func);
        if (cb == null) {
            if (err == null)
                return;
            else
                throw err;
        }
        return cb(err, nbytes);
    };

    let func = () => {
        let chunks: number;
        if ( writed + chunksize > length && length >= 0)
            chunks = length - writed;
        else
            chunks = chunksize;
        let buf = Buffer.alloc(chunks);
        fs.read(fd, buf, 0, chunks, writed + startPosition, (err, n, b) => {
            if (err || write_error)
                return wrap_cb(err || write_error, writed);
            writed += n;
            let cont: boolean = true;
            if (n != chunksize) { // last chunk
                if (n != 0) {
                    let lb = Buffer.alloc(n);
                    buf.copy(lb, 0, 0, n);
                    writer.write(lb);
                }
                if (writed < length)
                    return wrap_cb(new Error(`EOF but can't read length of ${length}`), writed);
                if (callend) writer.end();
                return wrap_cb(null, writed);
            } else
                cont = writer.write(buf);
            if (cont)
                proc.nextTick(func);
            else
                writer.once("drain", func);
        });
    };
    func();
} //}

type fx = (fd: number, startPosition: number, 
           writer: Writable, length: number, 
           chunksize: number, callend: boolean) => Promise<number>; 
const fwriteToWritable_promisify_x: fx = util.promisify(fwriteToWritable) as fx;
export function fwriteToWritable_promisify(fd: number, startPosition: number, writer: Writable, 
    length: number = -1, chunksize: number = 1024, callend: boolean = true) {
    return fwriteToWritable_promisify_x(fd, startPosition, writer, length, chunksize, callend);
}

export function writeToWritable(path: string, startPosition: number, writer: Writable, length: number = -1,
                         chunksize: number = 1024, callend: boolean = true, cb?: (err, nbytes) => void): void //{
{
    fs.open(path, "r", (err, fd) => {
        if (err != null)
            return cb(err, 0);
        fwriteToWritable(fd, startPosition, writer, length, chunksize, callend, cb);
    });
} //}

type fb = (path: string, startPosition: number, 
           writer: Writable, length: number, 
           chunksize: number, callend: boolean) => Promise<number>; 
const writeToWritable_promisify_x: fb = util.promisify(writeToWritable) as fb;
export function writeToWritable_promisify(path: string, startPosition: number, writer: Writable, 
    length: number = -1, chunksize: number = 1024, callend: boolean = true) {
    return writeToWritable_promisify_x(path, startPosition, writer, length, chunksize, callend);
}

export function fwriteToWritableSync(fd: number, startPosition: number, writer: Writable, 
                    length: number = -1, chunksize: number = 1024, callend: boolean = true): number //{
{
    if (chunksize <= 0 || (length != -1 && length < 0)) {
        throw new Error("argument error");
    }
    let writed: number = 0;
    while(writed <= length || length == -1) {
        let buf = Buffer.alloc(chunksize);
        let chunks;
        if (writed + chunksize <= length || length == -1)
            chunks = chunksize;
        else
            chunks = length - writed;
        let nn = fs.readSync(fd, buf, 0, chunks, writed + startPosition);
        writed += nn;
        if (nn == chunksize) {
            writer.write(buf);
        } else { // last chunk
            if (nn != 0) {
                let nbuf = Buffer.alloc(nn);
                buf.copy(nbuf, 0, 0, nn);
                writer.write(nbuf);
            }
            if (writed != length && length != -1)
                throw new Error("write length error");
            if (callend) writer.end();
            break;
        }
    }
    return writed;
} //}
export function writeToWritableSync(path: string, startPosition: number, writer: Writable, length: number = -1,
                         chunksize: number = 1024, callend: boolean = true): number //{
{
    let fd = fs.openSync(path, "r");
    let n = fwriteToWritableSync(fd, startPosition, writer, length, chunksize, callend);
    fs.closeSync(fd);
    return n;
} //}

