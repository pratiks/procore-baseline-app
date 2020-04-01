import { Router } from 'express';
import * as reqCtx from 'request-context';
import 'isomorphic-fetch';
import { client, me, oauth } from '@procore/js-sdk';
import { logger } from '../../../src/utils/logger';
import {config} from "../../../src/config";

// Read procore server from environment config file
const PROCORE_SERVER = config.get('procore.server')
//setup logger
const moduleLogger = logger({'name': 'moduleName:me'});
// Express router
const meRouter = Router();

/**
 * Show User Info
 * Returns information on the authenticated user. If a company_id or project_id parameter is included,
 * directory-specific information on the user will also be returned.
 */
meRouter.get('/me', async (req, res) => {

    moduleLogger.info(`fetching information about user`)
    const access_token = reqCtx.get('request:token');
    const pc = client(oauth(access_token), {}, PROCORE_SERVER);

    await pc.get(me({ action: '', id: null, qs: null }))
        .then((response) => {
            return res.send(response.body);
        })
        .catch(err => {
            moduleLogger.info(`error fetching information about user /me api endpoint`)
            console.log(err)
            res.send(err);
        });
})

export { meRouter };
