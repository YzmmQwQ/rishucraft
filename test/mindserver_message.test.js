import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { io as createClient } from 'socket.io-client';
import { createCanvas } from 'canvas';
import { createMindServer, registerAgent } from '../src/mindcraft/mindserver.js';

test('forwards a WebUI message to the connected agent and returns its acknowledgement', async (t) => {
    const agentName = `MessageTest_${process.pid}`;
    const server = createMindServer(false, 0);
    await once(server, 'listening');
    const port = server.address().port;
    const url = `http://localhost:${port}`;
    const nativeFetch = globalThis.fetch;

    registerAgent({ profile: { name: agentName }, minecraft_version: 'auto', auth: 'yggdrasil' }, 3000);

    const agentSocket = createClient(url, { forceNew: true, reconnection: false });
    const webSocket = createClient(url, { forceNew: true, reconnection: false });
    t.after(async () => {
        agentSocket.close();
        webSocket.close();
        globalThis.fetch = nativeFetch;
        if (server.listening) await new Promise(resolve => server.close(resolve));
    });

    await Promise.all([once(agentSocket, 'connect'), once(webSocket, 'connect')]);

    let received;
    agentSocket.on('send-message', (data, callback) => {
        received = data;
        callback({ success: true });
    });
    let viewerRequested = false;
    agentSocket.on('start-viewer', callback => {
        viewerRequested = true;
        callback({ success: true, port: 3000 });
    });
    agentSocket.emit('connect-agent-process', agentName);
    const loginResponse = await new Promise(resolve => {
        agentSocket.emit('login-agent', agentName, {
            username: 'RishuQwQ',
            uuid: '23cbe086-9d50-33b2-8afb-9c5108514be0',
            sessionServer: 'https://skin.example/api/yggdrasil/sessionserver'
        }, resolve);
    });
    assert.deepEqual(loginResponse, { success: true });

    const response = await new Promise(resolve => {
        webSocket.emit('send-message', agentName, { from: 'spoofed', message: '  hello from web  ' }, resolve);
    });

    assert.deepEqual(response, { success: true });
    assert.deepEqual(received, { from: 'ADMIN', message: 'hello from web' });

    const viewerResponse = await new Promise(resolve => {
        webSocket.emit('start-agent-viewer', agentName, resolve);
    });
    assert.equal(viewerRequested, true);
    assert.deepEqual(viewerResponse, { success: true, port: 3000 });

    const skinProfile = {
        properties: [{
            name: 'textures',
            value: Buffer.from(JSON.stringify({
                textures: { SKIN: { url: 'https://skin.example/textures/rishu.png' } }
            })).toString('base64')
        }]
    };
    const skinCanvas = createCanvas(64, 64);
    skinCanvas.getContext('2d').fillRect(8, 8, 8, 8);
    const skinImage = skinCanvas.toBuffer('image/png');
    globalThis.fetch = async requestUrl => {
        const request = String(requestUrl);
        if (request === 'https://skin.example/textures/rishu.png') {
            return {
                ok: true,
                status: 200,
                arrayBuffer: async () => skinImage.buffer.slice(skinImage.byteOffset, skinImage.byteOffset + skinImage.byteLength)
            };
        }
        assert.equal(request, 'https://skin.example/api/yggdrasil/sessionserver/session/minecraft/profile/23cbe0869d5033b28afb9c5108514be0?unsigned=false');
        return { ok: true, status: 200, json: async () => skinProfile };
    };
    const skinResponse = await nativeFetch(`${url}/assets/skin/${agentName}.png`);
    assert.equal(skinResponse.status, 200);
    assert.equal(skinResponse.headers.get('content-type'), 'image/png');
    assert.ok((await skinResponse.arrayBuffer()).byteLength > 0);
});
