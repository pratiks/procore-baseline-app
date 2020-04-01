import * as reqCtx from 'request-context';
import { logger } from '../../src/utils/logger';

const moduleLogger = logger({ name: 'module:middleware' });

/**
 * @name setContext middleware to store token in context object request:token before auth middleware.
 * @param { object } req request object
 * @param { object } res res object
 * @param { object } next next object
 * @return {string } token or empty string
 */
function setContext(req, res, next) {
	let session_access_token = '';
	let header_access_token = '';

	//todo improve logic here.
	if (req.hasOwnProperty('session')) {
		session_access_token = req['session']['accessToken'];
	}

	const headers = req['headers'];
	if (headers && headers.hasOwnProperty('authorization')) {
		const rawToken = headers['authorization'];
		header_access_token = rawToken.replace('Bearer ', '');
	}

	const access_token = header_access_token ? header_access_token : session_access_token;
	moduleLogger.info(`setting context for route ${req.url}`);

	//set token context
	reqCtx.set('request:token', access_token);

	//set other request properties
	reqCtx.set('request:query', req.query);
	reqCtx.set('request:params', req.params);
	reqCtx.set('request:body', req.body);
	next();
}

export { setContext }
