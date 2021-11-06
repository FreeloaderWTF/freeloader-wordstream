import fs from 'fs';
import Koa from 'koa';
import KoaPinoLogger from 'koa-pino-logger';
import KoaRouter from 'koa-router';
import KoaStatic from 'koa-static';
import os from 'os';
import path from 'path';
import Pino from 'pino';

const app = new Koa();
app.proxy = true;

const logger = Pino();

app.use(KoaPinoLogger({ logger: logger }));

const words = fs.readFileSync(path.join(__dirname, '..', 'assets', 'words'), { encoding: 'utf-8'}).split('\n');
logger.info( { words: words.length }, 'wordlist loaded');

app.use(KoaStatic(path.join(__dirname, "..", "static"), { maxage: 24 * 60 * 60 * 1000 }));

app.use(async(ctx: Koa.Context, next) => {
    await next();
    const status = ctx.status || 404;
    if (status === 404) {
        ctx.redirect('/words.txt');
    }
});

const rootRouter = new KoaRouter();

const PassThrough = require('stream').PassThrough;

rootRouter.get('/words.txt', (ctx) => {
    plainText(ctx, 1000);
});

rootRouter.get('/fast.txt', (ctx) => {
    plainText(ctx, 100);
});

rootRouter.get('/slow.txt', (ctx) => {
    plainText(ctx, 5000);
});

rootRouter.get('/words.html', (ctx) => {
    html(ctx, 1000);
});

rootRouter.get('/fast.html', (ctx) => {
    html(ctx, 100);
});

rootRouter.get('/slow.html', (ctx) => {
    html(ctx, 5000);
});

function plainText(ctx:any, interval:number) {
    ctx.type = 'text/plain; charset=utf-8';

    //WTF Google?  https://stackoverflow.com/questions/35073009/disabling-chrome-buffering-when-streaming-text-data
    ctx.set('X-Content-Type-Options', 'nosniff');

    const stream = new PassThrough();
    let count = 0;
    const sender = setInterval(() => { count += 1; stream.write(words[ Math.floor(Math.random() * words.length) ] + '\n'); }, interval);
    ctx.req.on('close', () => { clearInterval(sender); logger.info({ count, reason: 'close'}, 'ended'); });
    ctx.req.on('finish', () => { clearInterval(sender); logger.info({ count, reason: 'finish'}, 'ended'); });
    ctx.req.on('error', () => { clearInterval(sender); logger.info({ count, reason: 'error'}, 'ended'); });

    ctx.body = stream;
}

function html(ctx: any, interval: number) {
    ctx.type = 'text/html; charset=utf-8';

    const stream = new PassThrough();
    let count = 0;
    const sender = setInterval(() => { count += 1; stream.write(`${words[Math.floor(Math.random() * words.length)]}<br/>\n`); }, interval);
    ctx.req.on('close', () => { clearInterval(sender); logger.info({ count, reason: 'close' }, 'ended'); });
    ctx.req.on('finish', () => { clearInterval(sender); logger.info({ count, reason: 'finish' }, 'ended'); });
    ctx.req.on('error', () => { clearInterval(sender); logger.info({ count, reason: 'error' }, 'ended'); });

    ctx.body = stream;

    stream.write(`<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body><h3>`)
}

rootRouter.get('/status.json', async (ctx: Koa.Context) => {
    const retVal: {[key:string]: any } = {};

    retVal["success"] = true;
    retVal["message"] = "OK";
    retVal["timestamp"] = new Date().toISOString();
    retVal["tech"] = "NodeJS " + process.version;
    retVal["lastmod"] = process.env['LASTMOD'] || null;
    retVal["commit"] = process.env['COMMIT'] || null;
    retVal["words"] = words.length;
    retVal["__dirname"] = __dirname;
    retVal["__filename"] = __filename;
    retVal["os.hostname"] = os.hostname();
    retVal["os.type"] = os.type();
    retVal["os.platform"] = os.platform();
    retVal["os.arch"] = os.arch();
    retVal["os.release"] = os.release();
    retVal["os.uptime"] = os.uptime();
    retVal["os.loadavg"] = os.loadavg();
    retVal["os.totalmem"] = os.totalmem();
    retVal["os.freemem"] = os.freemem();
    retVal["os.cpus.length"] = os.cpus().length;
    // too much junk: retVal["os.networkInterfaces"] = os.networkInterfaces();

    retVal["process.arch"] = process.arch;
    retVal["process.cwd"] = process.cwd();
    retVal["process.execPath"] = process.execPath;
    retVal["process.memoryUsage"] = process.memoryUsage();
    retVal["process.platform"] = process.platform;
    retVal["process.release"] = process.release;
    retVal["process.title"] = process.title;
    retVal["process.uptime"] = process.uptime();
    retVal["process.version"] = process.version;
    retVal["process.versions"] = process.versions;

    const callback = ctx.request.query['callback'];
    if (callback && callback.match(/^[$A-Za-z_][0-9A-Za-z_$]*$/) != null) {
        ctx.body = callback + '(' + JSON.stringify(retVal) + ');';
    } else {
        ctx.set('Access-Control-Allow-Origin', '*');
        ctx.set('Access-Control-Allow-Methods', 'GET');
        ctx.set('Access-Control-Max-Age', '604800');
        ctx.body = JSON.stringify(retVal);
    }
});

app.use(rootRouter.routes());

const listener = app.listen(process.env['PORT'] || "4000", function () {
    logger.info( { address: listener.address() }, 'Running');
});

