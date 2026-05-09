import { BaseEvent } from "../../types/event.interface";

export abstract class QueuePublisherService {
    abstract publish(event: BaseEvent): Promise<void>
}