import amqplib from 'amqplib';
import {
  LocationCreatedPayload,
  LocationDeletedPayload,
  LocationUpdatedPayload,
  MQEventPayload,
  MQQueue,
} from '../../../common';
import { logger } from '../logger';

export async function initLocationsEventHandlers() {
  const conn = await amqplib.connect('amqp://localhost');
  const queue: MQQueue = 'locations';
  const ch = await conn.createChannel();
  await ch.assertQueue(queue);
  logger.info('Locations event consumer running');

  await ch.consume(queue, (msg) => {
    if (msg !== null) {
      ch.ack(msg);
      router(msg);
    } else {
      console.log('Consumer cancelled by server');
    }
  });
}

function router(msg: amqplib.ConsumeMessage) {
  const str = msg.content.toString();
  const payload = JSON.parse(str) as MQEventPayload;

  switch (payload.type) {
    case 'location-created':
      handleLocationCreate(payload.payload);
      break;
    case 'location-updated':
      handleLocationUpdate(payload.payload);
      break;
    case 'location-deleted':
      handleLocationDelete(payload.payload);
      break;
    default:
      break;
  }
}

async function handleLocationCreate(payload: LocationCreatedPayload) {
  console.log('Location created', payload);
}

async function handleLocationUpdate(payload: LocationUpdatedPayload) {
  console.log('Location updated', payload);
}

async function handleLocationDelete(payload: LocationDeletedPayload) {
  console.log('Location deleted', payload);
}
