/**
 *
 * Update Redirect Url everytime ngrok changes.
 * https://developers.procore.com/developer_apps/4ab731c7-cace-49d1-9ff5-4252415ce6d8
 */

import { Router } from 'express';
import 'isomorphic-fetch';

import { logger } from '../../src/utils/logger';
import { token, refresh, authorize } from '@procore/js-sdk';
import { getApplicationEnvironment } from '../../src/config';
import * as reqCtx from "request-context";
const environment = getApplicationEnvironment();

// Define logger
const moduleLogger = logger({'name': 'moduleName:auth'});
const authRouter = Router();

/**
 * @description
 * Authorizes the client by concatenating the authorizationUrl which then subsequently calls the
 * callback url for this app.
 */
authRouter.get('/authorization', (req, res) => {

  /*  Authorization endpoint generates the callback url using the authorize function from SDK
     Example: `${hostname}/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${uri}`
     */
    const authorizationUrl = authorize({
            clientId: process.env.CLIENT_ID,
            uri: process.env.REDIRECT_URI
        },
        process.env.PROCORE_SERVER
    )

    moduleLogger.info(`authorization url ${authorizationUrl}, client should redirect to callback url set by developer after user is logs in.`);
    res.redirect(authorizationUrl);
});


/*
 * This endpoint is the redirect URL after user has successfully logged in to procore.
 * The Redirect url for the route is setup by the app developer at developer.procore.com.
 */
authRouter.get('/callback', async (req, res) => {

        const response = await token({
            id: process.env.CLIENT_ID,
            secret: process.env.CLIENT_SECRET,
            uri: process.env.REDIRECT_URI,
            code: req.query.code,
        },
        process.env.PROCORE_SERVER);

        const { access_token , refresh_token }  = response;
        moduleLogger.info(`callback response requested token with code and was successful: ${access_token}`)

      //fetch user

      //user


      res.redirect(`http://localhost:9000/#/Dashboard?access_token=${access_token}&refresh_token=${refresh_token}`);
});

authRouter.post('/procore/refresh', async (req, res) => {

    const access_token = reqCtx.get('request:access_token')
    const {  refresh_token }  =  reqCtx.get('request:body');

    moduleLogger.info(`refresh and access token exist, get a new token`)
    await fetch(
        `${process.env.PROCORE_SERVER}/oauth/token?grant_type=refresh_token&$client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&redirect_uri=${process.env.URI}&refresh_token=${refresh_token}`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        }
    ).then((response) => {
        console.log('getting a response....!!!')
        return res.status(response.status).send(response.data);
    }).catch((err) => {
        console.log(err)
        return res.status(err.status).send(err)
    })
});

/**
 * @name revokeToken
 * @description
 * revokeToken function is a promise that executes when invoked to revoke accessToken from procore backend.
 * @param accessToken
 * @return {Promise<Response>}
 */
const revokeToken = async (accessToken) => {
   console.log(`revoking accessToken `, accessToken)
   return await fetch(
        `${process.env.PROCORE_SERVER}/oauth/revoke`,
        {
            method: 'POST',
            body: {
                "token": `${accessToken}`,
                "client_id": `${process.env.CLIENT_ID}`,
                "client_secret": `${process.env.CLIENT_SECRET}`
            }
        });

}

/**
 * @function refreshToken
 * @description refreshToken function returns promise to provide a new token when proper credentials and tokens are provided.
 * @param { string } accessToken
 * @param { string } refreshToken
 * @return {Promise<Response>}
 */
const refreshToken = async (accessToken, refreshToken) => {
    moduleLogger.info(`refresh token call`, accessToken, refreshToken)
    return refresh({
        id: `${process.env.CLIENT_ID}`,
        secret: `${process.env.CLIENT_SECRET}`,
        token: accessToken, uri: `${process.env.URI}`,
        refresh: refreshToken },
        `${process.env.PROCORE_SERVER}`)
}




export { authRouter, revokeToken };
