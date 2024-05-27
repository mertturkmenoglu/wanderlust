import {
  UserCreatedPayload,
  UserDeletedPayload,
  UserUpdatedPayload,
} from '../../../common';

export async function handleUserCreate(payload: UserCreatedPayload) {
  console.log('User created', payload);
}

export async function handleUserUpdate(payload: UserUpdatedPayload) {
  console.log('User updated', payload);
}

export async function handleUserDelete(payload: UserDeletedPayload) {
  console.log('User deleted', payload);
}
