import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { HydratedDocument } from "mongoose";
import { Document, ObjectId } from 'mongoose';

export type PostDocument = HydratedDocument<Post>;

@Schema()
export class Post extends Document {
  @Prop({required: true })
  @Transform(({value}) => value.toString())
  _id: ObjectId;

  @Prop({required: true })
  title: string;

  @Prop({required: true })
  content: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
