import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  fibonacci = (n) => {
    return n < 1
      ? 0
      : n <= 2
        ? 1
        : this.fibonacci(n - 1) + this.fibonacci(n - 2);
  };
}
