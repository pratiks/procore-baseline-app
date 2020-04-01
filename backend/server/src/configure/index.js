const bodyParser = require('body-parser')
import { projectsRouter } from '../api/projects';
import { meRouter } from '../api/me';
import { authRouter } from '../authentication';

let configure = (app) => {
    app.use(bodyParser.json())
    app.use('/api', projectsRouter);
    app.use('/api', authRouter);
    app.use('/api', meRouter);
    app.use('/favicon.ico', function(req, res) { res.send(200)})

}

export { configure }
