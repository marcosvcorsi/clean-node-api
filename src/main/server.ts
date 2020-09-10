import 'module-alias/register';

import { MongoHelper } from '@/infra/db/mongodb/helpers/mongoHelper';
import database from './config/database';

MongoHelper.connect(database.mongoUrl)
  .then(async () => {
    const app = await (await import('./config/app')).default;

    app.listen(process.env.PORT || 3333, () =>
      console.log(`Server is running on port ${process.env.PORT || 3333}`),
    );
  })
  .catch(console.error);
