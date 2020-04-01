const convict = require('convict');
const dotenv = require('dotenv');

dotenv.config();

const config = convict({
	system: {
		environment: {
			default: 'development',
			doc: 'system environment type',
			env: 'ENV',
			format: String
		}
	},
	app: {
		port: {
			default: '8080',
			doc: 'Port',
			env: 'PORT',
			format: String
		},
		hostname: {
			default: 'c3dc89b8.ngrok.io',
			env: 'HOSTNAME',
			format: String
		},
		node_env: {
			default: 'development',
			doc: 'node environment type',
			env: 'NODE_ENV',
			format: String
		},
		redirect_uri: {
			default: 'https://api.ngrok.io/api/callback',
			env: 'REDIRECT_URI',
			format: String
		},
		session_password: {
			default: 'asdf',
			env: 'SESSION_PASSWORD',
			format: String
		},
		client_id: {
			default: '',
			env: 'CLIENT_ID',
			format: String
		},
		client_secret: {
			default: '',
			env: 'CLIENT_SECRET',
			format: String
		}
	},
	procore: {
		server: {
			default: 'https://sandbox.procore.com',
			doc: 'procore server open api url',
			env: 'PROCORE_SERVER',
			format: String
		}
	}
});

config.validate();

// Define object.
// This can have any number of properties of type any.
/**
 * @typedef {Object<string, any>} Environment
 * @property {string} [PROCORE_SERVER] authentication server
 * @property {string} [REDIRECT_URI]
 * @property {string} [CLIENT_ID]
 * @property {string} [CLIENT_SECRET]
 * @property {string} [NODE_ENV]
 * @property {string} [HOSTNAME]
 */

/**
 * @function getApplicationEnvironment
 * @description returns all environment variables relevant to the application that are declared at run time.
 * return { Environment }
 */
function getApplicationEnvironment() {
	/** @type { Environment } */
	return {
		PROCORE_SERVER: config.get('procore.server'),
		REDIRECT_URI: config.get('app.redirect_uri'),
		CLIENT_ID: config.get('app.client_id'),
		CLIENT_SECRET: config.get('app.client_secret'),
		NODE_ENV: config.get('app.node_env'),
		HOSTNAME: config.get('app.hostname')
	};
}

module.exports = { getApplicationEnvironment, config };
