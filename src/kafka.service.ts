import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Kafka, Admin } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit {
  private admin: Admin;

  constructor(@Inject('KAFKA_SERVICE') private readonly client: ClientKafka) {}

  public getFiboResult() {
    return new Promise<number>((resolve) => {
      this.client
        .send('fibo', { num: 40 }) // using object here
        .subscribe((result: number) => {
          resolve(result);
        });
    });
  }

  async onModuleInit() {
    await this.client.connect(); // required to use client.send()

    const kafka = new Kafka({
      clientId: 'my-app',
      brokers: ['localhost:9092'],
    });

    this.admin = kafka.admin();
    await this.admin.connect();

    const topics = await this.admin.listTopics();

    const topicList = [];

    if (!topics.includes('fibo')) {
      topicList.push({
        topic: 'fibo',
        numPartitions: 10,
        replicationFactor: 1,
      });
    }

    if (!topics.includes('fibo.reply')) {
      topicList.push({
        topic: 'fibo.reply',
        numPartitions: 10,
        replicationFactor: 1,
      });
    }

    if (topicList.length) {
      await this.admin.createTopics({ topics: topicList });
      console.log(
        'Kafka topics created:',
        topicList.map((t) => t.topic),
      );
    }

    await this.admin.disconnect();

    // Optional: Trigger a test request
    const result = await this.getFiboResult();
    console.log('Fibonacci result:', result);
  }
}
