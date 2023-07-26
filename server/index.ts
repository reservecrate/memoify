import app from './app.ts';
import { PORT } from './utils/config.ts';
import { info } from './utils/logger.ts';

const port = PORT || 8080;

app.listen(port, () => info(`server running on port ${port}`));
