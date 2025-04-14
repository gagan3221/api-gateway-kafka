import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { KafkaService } from './kafka.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly kafkaService: KafkaService,
  ) {}

  @Get('/fibonacci')
  async getFibo() {
    return this.appService.fibonacci(40);
  }
  @Get('/microservice-fibonacci')
  async getFibonacci() {
    const fibo = await this.kafkaService.onModuleInit().then(() => {
      return this.kafkaService.getFiboResult();
    });
    return fibo;
  }
}
