import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { KafkaService } from './kafka.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'FIBO_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'app-gateway',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'kafka-microservices',
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [KafkaService],
})
export class AppModule {}
