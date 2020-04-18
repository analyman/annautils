#!/usr/bin/env node

import * as annautils from 'annautils';
import * as proc from 'process';
import * as path from 'path';
import * as fs from 'fs';

import getopt from 'node-getopt';

let __opt = getopt.create([
    ["s", "src=<path>", "source file or directory"],
    ["d", "dst=<path>", "destination"],
    ["h", "help",       "show this help"]
]);
let opt = __opt.bindHelp().parseSystem();
let options = opt.options;

if (options["h"] == true) {
    __opt.showHelp();
    proc.exit(0);
}

let src = options["s"] as string;
let dst = options["d"] as string;

if (src == null && dst == null) {
    if (opt.argv.length != 2) {
        __opt.showHelp();
        proc.exit(1);
    }
    src = opt.argv[0];
    dst = opt.argv[1];
}

fs.stat(dst, (err, stat) => {
    if(!err && stat.isDirectory()) {
        dst = path.join(dst, path.basename(src));
    }
    annautils.fs.copyr(src, dst, (err, copy) => {
        if(err) throw err;
        console.log("copy file: " + copy.file + "\ncopy directory: " + copy.dir);
    });
});
