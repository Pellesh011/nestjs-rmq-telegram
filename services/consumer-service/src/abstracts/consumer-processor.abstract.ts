import { BaseEvent } from "../types/event.interface";

export abstract class ConsumerProcessorService {
    abstract process(event: BaseEvent): Promise<void>
    abstract handleError(err: any): any
}