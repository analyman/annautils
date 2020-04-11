#!/usr/bin/env node

import * as annautils from 'annautils';
import * as proc from 'process';

import getopt from 'node-getopt';

let __opt = getopt.create([
    ["p", "path=<pat>", "a valid path"],
    ["v", "",           "display number of file and directory be removed"],
    ["h", "help",       "show this help"]
]);
let opt = __opt.bindHelp().parseSystem();
let options = opt.options;

if (options["h"] == true) {
    __opt.showHelp();
    proc.exit(0);
}

let dir = options["p"] as string;
let vvv = options["v"];

if (dir == null) {
    if (opt.argv.length != 1) {
        __opt.showHelp();
        proc.exit(1);
    }
    dir = opt.argv[0];
}

annautils.fs.removeRecusive(dir, (err, statistics) => {
    if(vvv) console.log(statistics);
    if(err) throw err;
});

