import fs   from 'fs';
import util from 'util';
import path from 'path';

export function chmod_files(dir: string, mode: any, level: number = 1/* start with 1 */, 
                            filematch: RegExp = /.*/, cb: (err: Error, num: number) => void = null): void {
    let num: number = 0;
    let nerr: number = 0;
    let callback_m = (err, num: number) => {
        if (err) throw err;
    }
    let error: Error = null;
    let cn: number = 0;
    cb = cb || callback_m;
    let callback_x = (err) => {
        error = err;
        dec_cn();
    }
    let inc_cn = () => {
        cn += 1;
    }
    let dec_cn = () => {
        cn -= 1;
        if(cn == 0) cb(error, num);
    }
    let ffff = (d, l) => {
        if (l == 0) return;
        inc_cn();
        fs.readdir(d, "utf8", (err, files) => {
            if(err) nerr += 1;
            if(err || error) return callback_x(err || error);
            for (let file of files) {
                let new_path = path.join(dir, file);
                inc_cn();
                fs.stat(new_path, (err, stat) => {
                    if(err) nerr += 1;
                    if(err || error) return callback_x(err || error);
                    if(stat.isDirectory()) {
                        ffff(new_path, l - 1);
                    } else if (stat.isFile()) {
                        if (!filematch.test(new_path)) return dec_cn();
                        inc_cn();
                        fs.chmod(new_path, mode, (err) => {
                            if (!err) num += 1;
                            if(err) nerr += 1;
                            if(err || error) return callback_x(err || error);
                            dec_cn();
                        });
                    }
                    dec_cn();
                });
            }
            dec_cn();
        });
    }
    ffff(dir, level);
}

type fa = (dir: string, mode: any, level: number, filematch: RegExp) => Promise<number>;
export const chmodFiles: fa = util.promisify(chmod_files);

