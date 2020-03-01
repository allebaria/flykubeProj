import express from 'express';
import bodyParser from 'body-parser';
import routes from './api/routes';
import config from './config';

const app = express();

app.use(bodyParser.json());
app.use('/api', routes);

app.listen(config.server.port, () => {
    return console.log(`server is listening on ${config.server.port}`);
});

export default app //For testing