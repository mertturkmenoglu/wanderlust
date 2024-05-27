import amqplib from 'amqplib';
import { MQEventPayload, MQQueue } from '../../../common';

import {
  UserCreatedPayload,
  UserDeletedPayload,
  UserUpdatedPayload,
} from '../../../common';
import { logger } from '../logger';

export async function initUsersEventHandlers() {
  const conn = await amqplib.connect('amqp://localhost');
  const queue: MQQueue = 'user';
  const ch = await conn.createChannel();
  await ch.assertQueue(queue);
  logger.info('Users event consumer running');

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
    case 'user-created':
      handleUserCreate(payload.payload);
      break;
    case 'user-updated':
      handleUserUpdate(payload.payload);
      break;
    case 'user-deleted':
      handleUserDelete(payload.payload);
      break;
    default:
      break;
  }
}

async function handleUserCreate(payload: UserCreatedPayload) {
  console.log('User created', payload);
}

async function handleUserUpdate(payload: UserUpdatedPayload) {
  console.log('User updated', payload);
}

async function handleUserDelete(payload: UserDeletedPayload) {
  console.log('User deleted', payload);
}
