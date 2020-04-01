import { Router } from 'express';
import httpProxy from 'http-proxy';
import {logger} from "../../lib/logger";
const moduleLogger = logger({'name': 'module:proxy'});


/*
Create a proxy server with custom application logic
*/
const proxyServer = httpProxy.createProxyServer({
  target: `${process.env.PROCORE_SERVER}`
});
export const proxyRouter = Router();


/*
To modify the proxy connection before data is sent, you can listen
for the 'proxyReq' event. When the event is fired, you will receive
the following arguments:

(http.ClientRequest proxyReq, http.IncomingMessage req,
 http.ServerResponse res, Object options). This mechanism is useful when
you need to modify the proxy request before the proxy connection
is made to the target.

*/
proxyServer.on('proxyReq', function(proxyReq, req, res, options) {
  const accessToken = req.session.accessToken
  console.log(accessToken)
  moduleLogger.info(`set accessToken before request of ${req.path}`)
  proxyReq.setHeader('Authorization', `Bearer ${accessToken}`);
});

proxyRouter.use((req, res) => {
  moduleLogger.info(`request incoming for proxy url: ${req.url}`)
  proxyServer.web(req, res, {
    changeOrigin: true,
    target: process.env.PROCORE_SERVER,
  });
});

proxyServer.on('proxyRes',  async function(proxyRes, req, res) {

  //
})
