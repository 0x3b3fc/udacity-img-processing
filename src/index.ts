// import all packages
import express from 'express';
import routes from './routes/main';
import file from './files/file';

const app = express();
const PORT = 5000;

//routes
app.use(routes);

//server configuration
app.listen(PORT, async () => {
  await file.create_thumb_path();
  console.log('server runs on: http://localhost:5000');
});

export default app;
