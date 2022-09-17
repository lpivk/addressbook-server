import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";

import http from "http";
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

import { SerialPort, ReadlineParser } from "serialport";

import { IController } from "./utils/types/IController";

export class App {
  private server: http.Server;
  private app: Application;
  private port: number;
  private io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

  constructor(port: number, controllers: IController[]) {
    this.app = express();
    this.port = port;

    this.server = http.createServer(this.app);
    this.io = new Server(this.server, {
      cors: { origin: "http://localhost:3000" },
    });

    this.initialiseDatabaseConnection();
    this.initialiseMiddleware();
    this.initialiseControllers(controllers);
    this.initialiseSocket();

    this.forwardSerialPortData();

    // setInterval(() => this.io.emit("products", "{id: 0001}"), 1000);
  }

  private initialiseDatabaseConnection(): void {
    const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env;

    try {
      mongoose.connect(
        `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`
      );
      console.log("Connected to MongoDB.");
    } catch (error) {
      const err = error as Error;
      console.log("Connection to MongoDB failed.", err.message);
    }
  }

  private initialiseMiddleware(): void {
    this.app.use(cors());
    this.app.use(morgan("dev"));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
  }

  private initialiseControllers(controllers: IController[]): void {
    controllers.forEach((controller) => {
      this.app.use("/api", controller.router);
    });
  }

  private initialiseSocket(): void {
    this.io.on("connection", (socket) => {
      console.log("Socket connected.", socket.id);

      socket.join("product-room");

      socket.on("disconnect", (reason) => {
        console.log(reason);
      });
    });
  }

  private async forwardSerialPortData() {
    const serialport = new SerialPort({
      baudRate: 115200,
      path: `COM6`,
      autoOpen: false,
    });

    serialport.open(function (err) {
      if (err) {
        console.log(err);
      } else console.log("COM6 open.");
    });

    const parser = serialport.pipe(new ReadlineParser());
    parser.on("data", (data) => {
      console.log(data);
      if (data.includes("id")) this.io.emit("products", data);
    });
  }

  public listen(): void {
    this.server.listen(this.port, () => {
      console.log(`Server running on port ${this.port}.`);
    });
  }
}
