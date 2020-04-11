import * as child_proc from 'child_process';
import * as proc from 'process';
import * as util from 'util';


/**
 * run a cmd multiple time
 * @param cmd command path
 * @param argv arguments
 * @param times how many times this command expected to run, -1 means infinite
 * @param consumer when command exit, this function consumer the stdout and stderr, 
 *                 return true mean continue execute
 * @param callback error callback, optional
 */
export function run_to(cmd: string, argv: [], times: number, consumer: (stdout, stderr) => boolean, callback?: (err) => void): void //{
{
    if (times <= 0 && times != -1) return;
    let s_callback = (err) => {
        if(callback == null) return;
        else return callback(err);
    }
    let func = () => {
        if (times-- == 0) return;
        child_proc.execFile(cmd, argv, (err, stdout, stderr) => {
            if(err) return s_callback(err);
            if(!consumer(stdout, stderr))
                return s_callback(null);
            proc.nextTick(func);
        });
    }
    func();
} //}
export const run_to_promisify = util.promisify(run_to);

