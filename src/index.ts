import 'dotenv/config';

import { App } from './App';

import UserController from './resources/auth/user.controller';
import ContactController from './resources/contact/contact.controller';

const app = new App(Number(process.env.PORT), [
  new UserController(),
  new ContactController(),
]);
app.listen();
