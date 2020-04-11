import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';

export function remove_rf(path_name: string, cb: (err: Error, del?: {file: number, dir: number}) => void) //{
{
    let error: Error = null;
    let del_dir: number = 0;
    let del_file: number = 0;
    let func = (p, c) => { /** recursive version of remove_rf */
        let enter: number = 0;
        let inc_enter = () => enter += 1;
        let dummycb = (errx) => {
            error = errx || error;
            enter -= 1;
            if (enter == 0)
                c(error, {file: del_file, dir: del_dir});
        }
        inc_enter();
        fs.stat(p, (e, stats) => {
            if(e || error) return dummycb(e);
            if(stats.isDirectory()) {
                fs.readdir(p, "utf8", (ep, files) => {
                    if (ep || error) return dummycb(ep);
                    let x = files.length;
                    if (x == 0) return fs.rmdir(p, (em) => dummycb(em));
                    for (let v of files) {
                        let dx = path.join(p, v);
                        func(dx, (ek) => {
                            error = ek || error;
                            x -= 1;
                            if(x == 0) {
                                if (error) return dummycb(error);
                                fs.rmdir(p, (en) => {
                                    if (en == null) del_dir += 1;
                                    dummycb(en);
                                });
                            }
                        });
                    }
                });
            } else {
                fs.unlink(p, (ex) => {
                    if (ex == null) del_file += 1;
                    dummycb(ex)
                });
            }
        });
    }
    func(path_name, cb);
} //}

export let remove_rf_promisify: (path_name: string) => Promise<{file: number, dir: number}> = util.promisify(remove_rf);

