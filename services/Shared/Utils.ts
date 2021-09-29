import { APIGatewayProxyEvent } from "aws-lambda";

export function generateRandomId(): string {
  //return a nice random 10 char string
  return Math.random().toString(36).slice(2);
}

export function getEventBody(event: APIGatewayProxyEvent) {
  return typeof event.body === "object" ? event.body : JSON.parse(event.body);
}
