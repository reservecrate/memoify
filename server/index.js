const app = require('./app');
const config = require('./utils/config');
const logger = require('./utils/logger');

const port = config.PORT || 8080;

app.listen(port, () => {
  logger.info(`server running on port ${port}`);
});
