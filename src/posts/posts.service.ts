import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import CreatePostDto from './dto/createPost.dto';
import { PostDocument } from './schema/post.schema';
import UpdatePostDto from './dto/updatePost.dto';

@Injectable()
export default class PostsService {
  constructor(
    @InjectModel('Post')
    private readonly postModel: Model<PostDocument>,
  ) {}

  async getAllPosts() {
    return this.postModel.find().exec();
  }

  async getPostById(id: string) {
    const post = await this.postModel.findById(id).exec();
    if (post) {
      return post;
    }
    throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }

  async createPost(post: CreatePostDto) {
    const newPost = new this.postModel(post);
    await newPost.save();
    return newPost;
  }

  async updatePost(id: string, post: UpdatePostDto) {
    const updatedPost = await this.postModel.findByIdAndUpdate(id, post, {
      new: true,
    }).exec();
    if (updatedPost) {
      return updatedPost;
    }
    throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }

  async deletePost(id: string) {
    const deleteResponse = await this.postModel.deleteOne({ _id: id }).exec();
    if (deleteResponse.deletedCount === 0) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
  }
}
