#!/usr/bin/env node

import * as annautils from 'annautils';
import * as proc from 'process';

const getopt = require('node-getopt');

let __opt = getopt.create([
    ["d", "dir=<dir>",     "directory"],
    ["e", "regex=<regex>",   "regular expression"],
    ["r", "rep=<replaceText>", "replace text"],
    ["h", "help",          "show this help"]
]);
let opt = __opt.bindHelp().parseSystem();
let options = opt.options;

if (options["h"] == true) {
    __opt.showHelp();
    proc.exit(0);
}

let dir   = options["d"];
let repl  = options["r"];
let regex = options["e"];

if (dir == null || repl == null || regex == NaN) {
    __opt.showHelp();
    proc.exit(1);
}

annautils.fs.fileRenameRegex(dir, new RegExp(regex), repl, (err) => {
    if(err) throw err;
});

