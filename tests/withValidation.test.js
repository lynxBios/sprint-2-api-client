import assert from 'node:assert';
import { withValidation } from '../src/tasks.js';

async function testAllowedStatus() {
  const response = new Response('{"id": 1}', {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });

  function fetchFn() {
    return response;
  }

  const validatedFetch = withValidation(fetchFn, [200]);
  const result = await validatedFetch();

  assert.deepStrictEqual(result, { id: 1 });
}

async function testRejectedStatus() {
  const response404 = new Response('User not found', {
    status: 404,
  });

  async function fetchFn404() {
    return response404;
  }

  const validatedFetch404 = withValidation(fetchFn404, [200]);

  await assert.rejects(validatedFetch404(), {
    message: 'HTTP 404: User not found',
  });
}

async function testArgumentForwarding() {
  let receivedUserId;
  const response = new Response('{}', {
    status: 200,
  });

  async function fetchFnArgs(userId) {
    receivedUserId = userId;
    return response;
  }

  const validatedFetchArgs = withValidation(fetchFnArgs, [200]);
  await validatedFetchArgs(42);
  assert.strictEqual(receivedUserId, 42);
}

await testAllowedStatus();
await testRejectedStatus();
await testArgumentForwarding();
