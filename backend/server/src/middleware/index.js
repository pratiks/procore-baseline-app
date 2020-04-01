import * as jwtUtil from 'jwt-simple';
import * as reqCtx from 'request-context';

import { logger } from '../../src/utils/logger';

const moduleLogger = logger({ name: 'module:middleware' });

/**
 * @function authMiddleware
 * @description authMiddleware is responsible for validated the access_token for each request.
 * @param req { object }
 * @param res  { object }
 * @param next { function }
 * @return
 */
const authMiddleware = async (req, res, next) => {
	moduleLogger.info(`process middleware authorization for url ${req.url}`);
	let isJwtValid;
	isJwtValid = validateAccessToken();
	isJwtValid ? next() : res.redirect('/api/authorization');
};

/**
 * @function validateAccessToken
 * @description validate the accessToken.  Please note, the accessToken is stored by context request. see context file.
 * @private
 * @returns { boolean } returns true or false if access token is valid or not.
 */
const validateAccessToken = function() {
	/*  context-request stores request information in namespace request */
	const accessToken = reqCtx.get('request:token');

	try {
		jwtUtil.decode(accessToken, process.env.CLIENT_SECRET, true, 'HS256');
		moduleLogger.info(`access token has been successfully validated`);
	} catch (e) {
		moduleLogger.info(`error decoding jwt, jwt validation failed - ${e} `);
		return false;
	}
	return true;
};

/**
 * @function unlessFunction
 * @description unlessFunction iterates through an array of paths ( with corresponding methods ) and verifies if the
 * current path during the middleware processing is whitelisted.
 * @param req { object }
 * @return {boolean}
 */
const unlessFunction = req => {
	const whiteListArray = [
		{ method: 'GET', path: '/api/authorization' },
		{ method: 'GET', path: '/api/callback' },
		{ method: 'POST', path: '/api/procore/refresh'  }
	];

	for (const listItem of whiteListArray) {
		if (
			req.method === `OPTIONS` ||
			(req.method === listItem.method &&
				(listItem.strict ? req.url === listItem.path : req.url.indexOf(listItem.path) !== -1))
		) {
			moduleLogger.info(`${req.url} was whitelisted`);
			return true;
		}
	}

	return false;
};

export { authMiddleware, unlessFunction };
