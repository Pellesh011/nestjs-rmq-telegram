import { BaseEvent } from "../types/event.interface";

export interface QueuePublisher {
  publish<T>(event: BaseEvent<T>): Promise<void>;
}