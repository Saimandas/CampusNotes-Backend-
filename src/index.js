import db from './db/index.js';
import app from './app.js';

const PORT = process.env.PORT;

db()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is listening at ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Database connection failed", err);
  });
