export interface BaseEvent<T = any> {
  id: string;
  type: string;
  payload: T;
  createdAt: string;
  correlationId: string;
}
