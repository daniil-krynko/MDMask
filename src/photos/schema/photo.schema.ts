import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from "mongoose";
import { HydratedDocument } from "mongoose";
import { User } from "../../users/schema/user.schema"

export type PhotoDocument = HydratedDocument<Photo>;

@Schema()
export class Photo {
    @Prop({ required: true, unique: true })
    title: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    isSwapped: boolean;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    userOwner: User;
}

export const PhotoSchema = SchemaFactory.createForClass(Photo);