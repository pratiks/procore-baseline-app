import { logger } from './logger';

const moduleLogger = logger({ name: 'module:middleware' });

/**
 * @function pathExemptionChecker
 * @private
 * @param whitelistPaths { array }
 * @param url { string }
 * @return boolean
 */
export const isPathOnWhiteList = (whitelistPaths, url) => {
	let foundPath = false;

	whitelistPaths.forEach(path => {
		if (url === path) {
			moduleLogger.info(`url ${url} matched whitelist: ${path}`);
			foundPath = true;
		}
	});
	return foundPath;
};

/**
 * @name isTokenExpired
 * @param jwtContextInfo
 * @return { boolean }
 */
export const isTokenExpired = jwtContextInfo => {
	const { exp } = jwtContextInfo;
	const currentUnixTimeStamp = Math.floor(new Date().getTime() / 1000);
	if (exp < currentUnixTimeStamp) {
		moduleLogger.info(`token expired, exp: ${exp} is < current time: ${currentUnixTimeStamp}`);
		return false;
	}
	return true;
};
