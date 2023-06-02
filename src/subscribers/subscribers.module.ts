import { Module } from '@nestjs/common';
import  SubscribersController from './subscribers.controller';
import { SubscribersService } from './subscribers.service';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";

@Module({
  imports: [ConfigModule],
  controllers: [SubscribersController],
  providers: [
    {
      provide: 'SUBSCRIBERS_SERVICE',
      useFactory: (config: ConfigService) => {
        // rabbitmq.env
        const user = config.get('RABBITMQ_USER');
        const password = config.get('RABBITMQ_PASSWORD');
        const host = config.get('RABBITMQ_HOST');
        const queueName = config.get('RABBITMQ_QUEUE_NAME');

        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [`amqp://${user}:${password}@${host}`],
            queue: queueName,
            queueOptions: {
              durable: true,
            },
          },
        })
      },
      inject: [ConfigService],
    }
  ]
})
export class SubscribersModule {}
