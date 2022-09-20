import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';

import { IController } from './utils/types/IController';

export class App {
  private express: Application;
  private port: number;

  constructor(port: number, controllers: IController[]) {
    this.express = express();
    this.port = port;

    this.initialiseDatabaseConnection();
    this.initialiseMiddleware();
    this.initialiseControllers(controllers);
  }

  private initialiseDatabaseConnection(): void {
    const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env;

    try {
      mongoose.connect(
        `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`
      );
      console.log('Connected to MongoDB.');
    } catch (error) {
      const err = error as Error;
      console.log('Connection to MongoDB failed.', err.message);
    }
  }

  private initialiseMiddleware(): void {
    this.express.use(cors());
    this.express.use(morgan('dev'));
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: false }));
  }

  private initialiseControllers(controllers: IController[]): void {
    controllers.forEach((controller) => {
      this.express.use('/api', controller.router);
    });
  }

  public listen(): void {
    this.express.listen(this.port, () => {
      console.log(`Server running on port ${this.port}.`);
    });
  }
}
