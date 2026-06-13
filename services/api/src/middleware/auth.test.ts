/// <reference types="node" />

import assert from 'node:assert/strict';
import { test, afterEach } from 'node:test';
import type { Response } from 'express';
import { verifyAuth, type AuthedRequest } from './auth';

const origNodeEnv = process.env.NODE_ENV;
const origSkip = process.env.SKIP_AUTH;

afterEach(() => {
  if (origNodeEnv === undefined) delete process.env.NODE_ENV;
  else process.env.NODE_ENV = origNodeEnv;
  if (origSkip === undefined) delete process.env.SKIP_AUTH;
  else process.env.SKIP_AUTH = origSkip;
});

function fakeReq(authHeader = ''): AuthedRequest {
  return { header: () => authHeader } as unknown as AuthedRequest;
}

/** 极简 res 桩:记录 status code;json() 无副作用。 */
function fakeRes(): { res: Response; code: () => number } {
  let code = 0;
  const res = {
    status(c: number) {
      code = c;
      return { json: () => undefined };
    },
  } as unknown as Response;
  return { res, code: () => code };
}

test('SKIP_AUTH bypass is active when NODE_ENV != production', async () => {
  process.env.SKIP_AUTH = '1';
  process.env.NODE_ENV = 'test';
  const req = fakeReq('');
  let nexted = false;
  await verifyAuth(req, fakeRes().res, () => {
    nexted = true;
  });
  assert.equal(nexted, true);
  assert.equal(req.uid, 'dev-user');
});

test('SKIP_AUTH is ignored in production: missing token -> 401, not bypassed', async () => {
  process.env.SKIP_AUTH = '1';
  process.env.NODE_ENV = 'production';
  const req = fakeReq(''); // no bearer token
  const { res, code } = fakeRes();
  let nexted = false;
  await verifyAuth(req, res, () => {
    nexted = true;
  });
  assert.equal(nexted, false);
  assert.equal(code(), 401);
  assert.equal(req.uid, undefined);
});
