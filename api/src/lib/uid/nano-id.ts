import { customAlphabet } from "nanoid";

const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowercase = "abcdefghijklmnopqrstuvwxyz";
const numbers = "0123456789";
const alphanumeric = uppercase + lowercase + numbers;

export const nanoid = customAlphabet(alphanumeric, 21);
