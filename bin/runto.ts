#!/usr/bin/env node

import * as proc from 'process';
import * as annautils from 'annautils';
import * as util from 'util';

const __usage =
`Usage ${proc.argv[1]} [-n times] [-c consumer] <cmd argv>

    -n     times how many times this command expected to run, -1 means infinity (default)
    -c     the consumer command, every time the cmd is exit, 
           stdout of the cmd will pass to stdin of consumer, 
           and next run will wait consumer exit. If consumer doesn't 
           present, just redirect to stdout.
`;

function usage() {
    proc.stdout.write(__usage);
}

function main() {
    let i = 2;
    let times = null;
    let consumer = null;
    let stop =false;
    while (!stop) {
        if (i >= proc.argv.length) {
            usage();
            proc.exit(1);
        }
        switch (proc.argv[i]) {
            case "-n":
                times = parseInt(proc.argv[i + 1]);
                if(!util.isNumber(times)) {
                    usage();
                    proc.exit(1);
                }
                i += 2;
                break;
            case "-c":
                consumer = proc.argv[i + 1];
                i += 2;
                break;
            default:
                if (times != null) {
                    stop = true;
                    break;
                }
                let n = parseInt(proc.argv[i + 1]);
                if (util.isNumber(n))
                    times = n;
                else
                    stop = true;
                break;
        }
    }
    times = times || -1;
    let cmd = null;
    annautils.child_process.promisify.runTo
}


