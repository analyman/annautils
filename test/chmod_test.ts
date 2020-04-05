import * as annautils from 'annautils';
import * as utilx from 'util';

async function xx() {
    let x = await annautils.fs.promisify.chmodRecursive("./cccc", "777", 2, /.*/);
    console.log(`something, ${x}`); 
}

xx().then(() => {
    console.log("yes");
}, (err) => {
    console.log(err);
});

