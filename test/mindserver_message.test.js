import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { io as createClient } from 'socket.io-client';
import { createMindServer, registerAgent } from '../src/mindcraft/mindserver.js';

test('forwards a WebUI message to the connected agent and returns its acknowledgement', async (t) => {
    const agentName = `MessageTest_${process.pid}`;
    const server = createMindServer(false, 0);
    await once(server, 'listening');
    const port = server.address().port;
    const url = `http://localhost:${port}`;

    registerAgent({ profile: { name: agentName }, minecraft_version: 'auto' }, 3000);

    const agentSocket = createClient(url, { forceNew: true, reconnection: false });
    const webSocket = createClient(url, { forceNew: true, reconnection: false });
    t.after(async () => {
        agentSocket.close();
        webSocket.close();
        if (server.listening) await new Promise(resolve => server.close(resolve));
    });

    await Promise.all([once(agentSocket, 'connect'), once(webSocket, 'connect')]);

    let received;
    agentSocket.on('send-message', (data, callback) => {
        received = data;
        callback({ success: true });
    });
    agentSocket.emit('connect-agent-process', agentName);
    agentSocket.emit('login-agent', agentName);
    await new Promise(resolve => setImmediate(resolve));

    const response = await new Promise(resolve => {
        webSocket.emit('send-message', agentName, { from: 'spoofed', message: '  hello from web  ' }, resolve);
    });

    assert.deepEqual(response, { success: true });
    assert.deepEqual(received, { from: 'ADMIN', message: 'hello from web' });
});
