import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { makeServer } from '../dist/server.js';

test('pull-only server does not advertise or accept event subscriptions', async t => {
  const server = makeServer(async () => { throw Error('no reads expected'); });
  const client = new Client({ name: 'pull-only-test', version: '1.0.0' });
  const [a,b] = InMemoryTransport.createLinkedPair();
  await Promise.all([server.connect(a),client.connect(b)]);
  t.after(async () => { await client.close(); await server.close(); });
  assert.equal(client.getServerCapabilities().events, undefined);
  assert.equal((await client.listTools()).tools.length, 5);
  const resultSchema = { parse: value => value };
  // Unknown methods must fail before any Google access or worker IPC.
  for (const method of ['events/list','events/subscribe','events/unsubscribe']) {
    await assert.rejects(client.request({ method, params: {} }, resultSchema), /not found|Unknown|unsupported/i);
  }
});
