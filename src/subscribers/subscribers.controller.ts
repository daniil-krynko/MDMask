import {
    Body,
    Controller,
    Get,
    Post,
    UseGuards,
    UseInterceptors,
    ClassSerializerInterceptor,
    Inject
} from '@nestjs/common';
import { JwtAuthenticationGuard } from "../authentication/jwt-authentication.guard";
import { CreateSubscriberDto } from "./dto/createSubscriber.dto";
import { ClientProxy } from "@nestjs/microservices";
import { subscribe } from 'diagnostics_channel';

@Controller('subscribers')
@UseInterceptors(ClassSerializerInterceptor)
export default class SubscribersController {
    constructor(@Inject('SUBSCRIBERS_SERVICE') private subsribersService: ClientProxy) {}

    @Get()
    @UseGuards(JwtAuthenticationGuard)
    async getSubscribers() {
        return this.subsribersService.send({
            cmd: 'get-all-subscribers'
        }, '')
    }

    @Post()
    @UseGuards(JwtAuthenticationGuard)
    async createPost(@Body() subscriber: CreateSubscriberDto) {
        return this.subsribersService.send({
            cmd: 'add-subscriber'
        }, subscriber)
    }
}
