import { Injectable } from "@nestjs/common";
import { RabbitMQConnectionService } from "./rabbitmq-connection.service";

@Injectable()
export class RabbitMQBootstrapService {
  constructor(private readonly connection: RabbitMQConnectionService) {}

  async init() {
    await this.connection.connect();
  }
}