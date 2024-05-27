import amqplib from 'amqplib';
import { MQEventPayload, MQQueue } from '../../../common';
import { handleUserCreate, handleUserDelete, handleUserUpdate } from './users';

async function consumer() {
  const conn = await amqplib.connect('amqp://localhost');
  const queue: MQQueue = 'user';
  const ch = await conn.createChannel();
  await ch.assertQueue(queue);

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

consumer();
