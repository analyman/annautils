import * as fs from 'fs';
import * as util from 'util';
import * as path from 'path';

export function touch(dir: string, cb: (err) => void): void //{
{
    let cur = new Date();
    fs.open(dir, "a" , (err, fd) => {
        if(err) return cb(err);
        fs.futimes(fd, cur, cur, (err) => {
            if(err) return cb(err);
            fs.close(fd, err => cb(err));
        });
    });
} //}
export const touch_promisify: (dir: string) => Promise<void> = util.promisify(touch);


export function copyr(src: string, dst: string, cb: (err: Error, copy?: {file: number, dir: number}) => void) //{
{
    let error: Error = null;
    let copy_dir: number = 0;
    let copy_file: number = 0;
    let enter: number = 0;
    let inc_enter = () => enter += 1;

    let dummycb = (errx) => {
        error = errx || error;
        enter -= 1;
        if (enter == 0)
            cb(error, {file: copy_file, dir: copy_dir});
    }

    let func = (p, d, c) => {
        inc_enter();
        fs.stat(p, (e, stats) => {
            if(e || error) return dummycb(e);
            if(stats.isDirectory()) {
                inc_enter();
                fs.mkdir(d, {recursive: true}, (err) => {
                    if (err || error) return dummycb(err);
                    copy_dir += 1;
                    fs.readdir(p, "utf8", (ep, files) => {
                        if(ep || error) return dummycb(e);
                        for (let v of files) {
                            let xsrc = path.join(p, v);
                            let xdst = path.join(d, v);
                            func(xsrc, xdst, (ek) => {
                                error = ek || error;
                            });
                        }
                        dummycb(null);
                    });
                });
            } else {
                inc_enter();
                fs.copyFile(p, d, (ex) => {
                    if (ex == null) copy_file += 1;
                    dummycb(ex);
                });
            }
            dummycb(null);
        });
    }
    func(src, dst, cb);
} //}
export const copyr_promisify: ((src: string, dst: string) => Promise<{file: number, dir: number}>) = util.promisify(copyr);

