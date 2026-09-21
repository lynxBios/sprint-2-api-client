import 'dotenv/config';
import { ReqResClient } from './ReqResClient.js';
import assert from 'node:assert';

const USER_IDS = [1, 2, 3];
const EXPECTED_USERS_COUNT = USER_IDS.length;

const client = new ReqResClient();

const requests = USER_IDS.map((id) => {
  return client.getUser(id);
});

const requestedUsersList = await Promise.all(requests);

const usersEmail = requestedUsersList.map((user) => {
  return user.data.email;
});

assert.ok(Array.isArray(usersEmail));
assert.strictEqual(usersEmail.length, EXPECTED_USERS_COUNT);
