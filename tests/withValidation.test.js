import assert from 'node:assert';

import { withValidation } from '../src/tasks.js';

const SUCCESS_STATUS = 200;
const NOT_FOUND_STATUS = 404;
const TEST_USER_ID = 42;
const SUCCESS_RESPONSE_BODY = '{"id": 1}';
const EXPECTED_RESPONSE = { id: 1 };
const ERROR_RESPONSE_BODY = 'User not found';
const EMPTY_RESPONSE_BODY = '{}';

async function testAllowedStatus() {
  const response = new Response(SUCCESS_RESPONSE_BODY, {
    status: SUCCESS_STATUS,
    headers: { 'Content-Type': 'application/json' },
  });

  function fetchFn() {
    return response;
  }

  const validatedFetch = withValidation(fetchFn, [SUCCESS_STATUS]);
  const result = await validatedFetch();

  assert.deepStrictEqual(result, EXPECTED_RESPONSE);
}

async function testRejectedStatus() {
  const response = new Response(ERROR_RESPONSE_BODY, {
    status: NOT_FOUND_STATUS,
  });

  async function fetchFn404() {
    return response;
  }

  const validatedFetch404 = withValidation(fetchFn404, [SUCCESS_STATUS]);

  await assert.rejects(validatedFetch404(), {
    message: `HTTP ${NOT_FOUND_STATUS}: ${ERROR_RESPONSE_BODY}`,
  });
}

async function testArgumentForwarding() {
  let receivedUserId;

  const response = new Response(EMPTY_RESPONSE_BODY, {
    status: SUCCESS_STATUS,
  });

  async function fetchFnArgs(userId) {
    receivedUserId = userId;
    return response;
  }

  const validatedFetchArgs = withValidation(fetchFnArgs, [SUCCESS_STATUS]);

  await validatedFetchArgs(TEST_USER_ID);

  assert.strictEqual(receivedUserId, TEST_USER_ID);
}

await testAllowedStatus();
await testRejectedStatus();
await testArgumentForwarding();
