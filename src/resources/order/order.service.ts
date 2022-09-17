import { OrderModel } from "./order.model";
import { IOrder } from "./order.interface";

export class OrderService {
  public async findOrderById(_id: string) {
    const order = await OrderModel.findById(_id);
    if (!order) throw new Error("Contact does not exist.");

    return order;
  }

  public async findOrdersByUserId(userId: string) {
    return await OrderModel.find({ userId });
  }

  public async addNewOrder(order: IOrder) {
    const newOrder = await OrderModel.create(order);

    return newOrder._id;
  }
}
