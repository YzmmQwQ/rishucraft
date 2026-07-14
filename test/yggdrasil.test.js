import test from 'node:test';
import assert from 'node:assert/strict';
import { authenticateYggdrasil, createYggdrasilAuth } from '../src/utils/yggdrasil.js';

function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { 'content-type': 'application/json' },
    });
}

const baseConfig = {
    username: 'login@example.com',
    password: 'secret',
    profile: null,
    authServer: 'https://skin.example/api/yggdrasil/authserver',
    sessionServer: 'https://skin.example/api/yggdrasil/sessionserver',
};

test('authenticates a single-profile Yggdrasil account', async () => {
    const fetchImpl = (url, options) => {
        assert.equal(url, `${baseConfig.authServer}/authenticate`);
        const body = JSON.parse(options.body);
        assert.equal(body.username, baseConfig.username);
        assert.equal(body.password, baseConfig.password);
        return Promise.resolve(jsonResponse({
            accessToken: 'access-token',
            clientToken: body.clientToken,
            selectedProfile: { id: 'uuid', name: 'Andy' },
        }));
    };

    const session = await authenticateYggdrasil(baseConfig, fetchImpl);
    assert.equal(session.selectedProfile.name, 'Andy');
    assert.equal(session.accessToken, 'access-token');
});

test('selects the requested profile for a multi-profile account', async () => {
    const calls = [];
    const fetchImpl = (url, options) => {
        calls.push(url);
        const body = JSON.parse(options.body);
        if (url.endsWith('/authenticate')) {
            return Promise.resolve(jsonResponse({
                accessToken: 'first-token',
                clientToken: body.clientToken,
                availableProfiles: [
                    { id: 'one', name: 'Alice' },
                    { id: 'two', name: 'Andy' },
                ],
                selectedProfile: { id: 'one', name: 'Alice' },
            }));
        }
        assert.deepEqual(body.selectedProfile, { id: 'two', name: 'Andy' });
        return Promise.resolve(jsonResponse({
            accessToken: 'selected-token',
            clientToken: body.clientToken,
            selectedProfile: body.selectedProfile,
        }));
    };

    const session = await authenticateYggdrasil({ ...baseConfig, profile: 'andy' }, fetchImpl);
    assert.equal(session.selectedProfile.name, 'Andy');
    assert.equal(session.accessToken, 'selected-token');
    assert.deepEqual(calls, [
        `${baseConfig.authServer}/authenticate`,
        `${baseConfig.authServer}/refresh`,
    ]);
});

test('custom auth hook supplies the authenticated session to minecraft-protocol', async () => {
    const events = [];
    const client = {
        emit(name, value) { events.push([name, value]); },
    };
    let connected = false;
    const options = {
        connect(receivedClient) {
            assert.equal(receivedClient, client);
            connected = true;
        },
    };
    const fetchImpl = (_url, request) => Promise.resolve(jsonResponse({
        accessToken: 'access-token',
        clientToken: JSON.parse(request.body).clientToken,
        selectedProfile: { id: 'uuid', name: 'Andy' },
    }));

    createYggdrasilAuth(baseConfig, fetchImpl)(client, options);
    await new Promise(resolve => globalThis.setImmediate(resolve));

    assert.equal(client.username, 'Andy');
    assert.equal(client.uuid, 'uuid');
    assert.equal(options.accessToken, 'access-token');
    assert.equal(events[0][0], 'session');
    assert.equal(connected, true);
});
