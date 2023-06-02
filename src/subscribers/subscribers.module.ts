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
      useFactory: (config: ConfigService) => (
        ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: config.get('SUBSCRIBERS_SERVICE_HOST'),
            port: config.get('SUBSCRIBERS_SERVICE_PORT')
          }
        })
      ),
      inject: [ConfigService]
    }
  ]
})
export class SubscribersModule {}
