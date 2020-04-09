import * as annautils from 'annautils';

annautils.fs.promisify.getStatsOfFiles("/", 2).then((stats) => {
    console.log(JSON.stringify(stats, null, 1));
}, (err) => {
    console.log(err);
});

