import { Module } from '@nestjs/common';
import PostsController from './posts.controller';
import PostsService from './posts.service';
import { PostSchema } from './schema/post.schema';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [MongooseModule.forFeature([{ name: 'Post', schema: PostSchema}])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}