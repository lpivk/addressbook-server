import "dotenv/config";

import { App } from "./App";

import UserController from "./resources/auth/user.controller";
import ContactController from "./resources/contact/contact.controller";
import OrderController from "./resources/order/order.controller";

const app = new App(Number(process.env.PORT), [
  new UserController(),
  new ContactController(),
  new OrderController(),
]);

app.listen();
