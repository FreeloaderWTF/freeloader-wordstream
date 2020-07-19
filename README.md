# Freeloader WordStream [<img alt="Freeloader Logo" src="https://www.freeloader.wtf/favicon.svg" height="90" align="right" />](https://www.freeloader.wtf/)

[Freeloader WordStream](https://wordstream.freeloader.wtf/) is a simple webapp that sends endless stream of words.
 
[Try it!](https://wordstream.freeloader.wtf/words.txt)

## Running

It is a TypeScript node.js app, so:

```bash
npm install
npm run build
npm run start
```

See the `run.sh` for how I run it in development.

In order to run it on a cloud service, the service need to support streaming responses.  Sort of obvious, but it is often buried in the fine print.  For example: Google CloudRun does not support streaming, while Heroku does.

## Contributing

Contributions are welcome!  Please follow the standard Github [Fork & Pull Request Workflow](https://gist.github.com/Chaser324/ce0505fbed06b947d962)

## License

[GNU Affero General Public License v3.0](LICENSE.txt)

## Credits

[![Cloudflare](https://www.vectorlogo.zone/logos/cloudflare/cloudflare-ar21.svg)](https://www.cloudflare.com/ "CDN")
[![Git](https://www.vectorlogo.zone/logos/git-scm/git-scm-ar21.svg)](https://git-scm.com/ "Version control")
[![Github](https://www.vectorlogo.zone/logos/github/github-ar21.svg)](https://github.com/ "Code hosting")
[![Koa](https://www.vectorlogo.zone/logos/koajs/koajs-ar21.svg)](https://koajs.com/ "Web framework")
[![Node.js](https://www.vectorlogo.zone/logos/nodejs/nodejs-ar21.svg)](https://nodejs.org/ "Application Server")
[![npm](https://www.vectorlogo.zone/logos/npmjs/npmjs-ar21.svg)](https://www.npmjs.com/ "JS Package Management")
[![pino](https://www.vectorlogo.zone/logos/getpinoio/getpinoio-ar21.svg)](https://www.getpino.io/ "Logging")
[![TypeScript](https://www.vectorlogo.zone/logos/typescriptlang/typescriptlang-ar21.svg)](https://www.typescriptlang.org/ "Programming Language")
[![Ubuntu](https://www.vectorlogo.zone/logos/ubuntu/ubuntu-ar21.svg)](https://www.ubuntu.com/ "Word list")
