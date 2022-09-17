import { Router, RequestHandler } from "express";
import { IController } from "../../utils/types/IController";
import { IOrder } from "./order.interface";
import { OrderService } from "./order.service";

export default class OrderController implements IController {
  public path = "/orders";
  public router = Router();
  private OrderService = new OrderService();

  constructor() {
    this.initialiseRoutes();
  }

  private initialiseRoutes(): void {
    this.router.get(`${this.path}/`, this.getOrdersByUserId);
    this.router.get(`${this.path}/:id`, this.getOrderById);
    this.router.post(`${this.path}/`, this.addNewOrder);
  }

  private getOrderById: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;

      const order = await this.OrderService.findOrderById(id);

      res.status(200).json(order);
    } catch (error) {
      const err = error as Error;

      res.status(400).json({ message: err.message });
    }
  };

  private getOrdersByUserId: RequestHandler = async (req, res) => {
    try {
      const { userId } = req.query as { userId: string };

      const orders = await this.OrderService.findOrdersByUserId(userId);

      res.status(200).json(orders);
    } catch (error) {
      const err = error as Error;

      res.status(400).json({ message: err.message });
    }
  };

  private addNewOrder: RequestHandler = async (req, res) => {
    try {
      const order: IOrder = req.body;

      const newOrderId = await this.OrderService.addNewOrder(order);

      res.status(201).json({ id: newOrderId });
    } catch (error) {
      const err = error as Error;

      res.status(400).json({ message: err.message });
    }
  };
}
