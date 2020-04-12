import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';

type stringSort = (s1: string, s2: string) => number;
type renameFunc = (a1: string, n1: number) => string;

export function files_rename(dir: string, sort: stringSort, rename: renameFunc, cb: (err: Error) => void) //{
{
    fs.readdir(dir, (err, files) => {
        if(err) cb(err);
        files = files.sort(sort);
        let len = files.length;
        let error: Error = null;
        let ccbb = (err) => {
            len -= 1;
            error = err || error;
            if (len == 0) cb(err || error);
        }
        for (let i = 0; i<files.length; i++) {
            if (error) ccbb(null);
            let repname;
            try {
                repname = rename(files[i], i);
            } catch (err) {
                ccbb(err);
                continue;
            }
            fs.rename(path.join(dir, files[i]), path.join(dir, repname), ccbb);
        }
    });
} //}
export const files_rename_promisify: (dir: string, sort: stringSort, rename: renameFunc) => void = util.promisify(files_rename);

function sortByAlpha(s1: string, s2: string) {
    return s1.localeCompare(s2);
}

function emptySort(s1: string, s2: string) {
    return -1;
}

/**
 * @param {string} name original name
 * @param {regex}  execute this regex with the name
 * @param {string} replaceText &1, &2, &3 ... &9 represent the group, &0 represent @see seqnum, && is &
 *                             if &num > maximum group of the regex, raise an error
 * @param {number} seqnum
 * @exception {Error} @see replaceText
 * @return {string} if this regex matches the original name, then return the replaced string, 
 *                  otherwise null.
 */
function renameByRegex(name: string, regex: RegExp, replaceText: string, seqnum: number) //{
{
    let re = regex.exec(name);
    if(re == null) return null;
    let rep_len = replaceText.length;
    let x1 = replaceText.split(/&[0-9]/);
    let ret = [];
    let num: number = 0;
    for( let v of x1) {
        num += v.length;
        ret.push(v);
        if(num == rep_len) break;
        num += 1;
        let ff = parseInt(replaceText.charAt(num));
        num += 1;
        if (ff == 0) ret.push(seqnum.toString());
        else {
            if (re[ff] == null) throw new Error("replace expression exceed the maximum group of the regex");
            ret.push(re[ff]);
        }
    }
    return ret.join('');
} //}

export function files_rename_regex(dir: string, regex: RegExp, replaceText: string, cb: (err) => void) {
    files_rename(dir, emptySort, (s1: string, n1: number): string => {
        return renameByRegex(s1, regex, replaceText, n1);
    }, cb);
};
export const files_rename_regex_promisify: (dir: string, regex: RegExp, replaceText: string) => void = 
    util.promisify(files_rename_regex);
