import express from 'express';
import  cors from "cors";
import * as path from 'path';
import unless from 'express-unless';
import * as reqCtx from 'request-context';
import * as bodyParser from 'body-parser';


//project level imports
import {configure} from './src/configure';
import {setContext } from './src/middleware/context';
import { logger } from './src/utils/logger';
import { authMiddleware, unlessFunction } from './src/middleware';

// Declare server
export const app = express();


/*** Logging Setup ***/
const moduleLogger = logger({ name: 'module:middleware' });

/***** Views Setup ******/
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


/*********** Middlewares  Start ************/
app.use(require('express-bunyan-logger')(moduleLogger));
/*

import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';

const cookieOptions = {
	name: 'sessions',
	maxAge: 24 * 60 * 60 * 1000, // 1 day
	secret: process.env.SESSION_PASSWORD,
	secure: process.env.NODE_ENV === 'production'
};
app.use(cookieSession(cookieOptions));
app.use(cookieParser());

*/

// Static files setup
app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
//use cors middleware
const corsOptions = {
	origin: '*',
	optionsSuccessStatus: 200,
	AccessControlAllowOrigin: '*'
}
app.use(cors(corsOptions));


// wrap requests in the 'request' namespace
app.use(reqCtx.middleware('request'));
app.use(setContext);



// Authentication middleware todo: move whitelist array here
authMiddleware.unless = unless;
app.use(authMiddleware.unless({ custom: unlessFunction }))

/********** Middlewares End *********/


/** Routes & Database */
configure(app);

/**
 * Login
 * @description
 */
app.get('/app/login', (req, res, next) => {

	const accessToken = reqCtx.get('request:token');
	if (accessToken) {
		res.render('index', { accessToken });
	} else {
		res.redirect(process.env.PROCORE_SERVER);
	}
});

/**
 *
 * Logout
 * @description
 * When I logout of the app, revoke my token.
 * todo: fix logout and revoke token why does token revoke still allow token to continue working?
 */
app.get('/app/logout', async (req, res, next) => {
	const result = await revokeToken(req.session.accessToken);
	moduleLogger.info(`revoke token complete`);
	res.json({ status: result.status, redirect_url: process.env.PROCORE_SERVER });
});


/** Start Server */
console.log(`Starting Server on port ${process.env.PORT}....`);
app.listen(process.env.PORT, function() {
	console.log(`Server listening on port ${process.env.PORT}!`);
	const all_routes = require('express-list-endpoints');
	console.table(all_routes(app));
});
