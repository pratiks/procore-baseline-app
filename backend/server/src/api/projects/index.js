import { Router } from 'express';
import * as reqCtx from 'request-context';
import 'isomorphic-fetch';
import { client, projects, oauth } from '@procore/js-sdk';
import { logger } from '../../../src/utils/logger';
import {config} from "../../../src/config";

// Read procore server from environment config file
const PROCORE_SERVER = config.get('procore.server')
//setup logger
const moduleLogger = logger({'name': 'moduleName:projects'});
// Express router
const projectsRouter = Router();


projectsRouter.get('/projects', async (req, res) => {

    const { company_id } =  reqCtx.get('request:query');
    const accessToken = reqCtx.get('request:token');

    const pc = client(oauth(accessToken), {}, PROCORE_SERVER);

    await pc.get(projects({action: '', qs: { company_id } } ))
        .then((response) =>
        {
            moduleLogger.info(`fetching projects for companyId ${company_id}`)
            res.send(response)
        })
        .catch(err =>
        {
            moduleLogger.error(`error fetching projects for `, err.response.body)
                res.status(err.response.status).json(err)
        });

})




export { projectsRouter };
