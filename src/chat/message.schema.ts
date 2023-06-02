import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from "mongoose";
import { User } from "../users/schema/user.schema";

export type MessageDocument = mongoose.HydratedDocument<Message>;

@Schema()
export class Message {
    @Prop()
    content: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    author: User;
}

export const MessageSchema = SchemaFactory.createForClass(Message);