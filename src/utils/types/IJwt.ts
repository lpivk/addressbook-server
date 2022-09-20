import { Schema } from 'mongoose';

export interface IJwt extends Object {
  id: Schema.Types.ObjectId;
  expiresIn: number;
}
