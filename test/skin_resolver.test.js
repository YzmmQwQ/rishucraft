import test from 'node:test';
import assert from 'node:assert/strict';
import { createCanvas, loadImage } from 'canvas';
import { renderSkinHead, resolveSkinTexture } from '../src/utils/skin_resolver.js';

function profileWithSkin(url) {
    return {
        properties: [{
            name: 'textures',
            value: Buffer.from(JSON.stringify({ textures: { SKIN: { url } } })).toString('base64')
        }]
    };
}

test('resolves a Yggdrasil skin from its configured session server', async () => {
    const calls = [];
    const fetchImpl = async url => {
        calls.push(String(url));
        return { ok: true, json: async () => profileWithSkin('https://skin.example/textures/rishu.png') };
    };
    const url = await resolveSkinTexture({
        auth: 'yggdrasil',
        username: 'RishuQwQ',
        uuid: '23cbe086-9d50-33b2-8afb-9c5108514be0',
        sessionServer: 'https://skin.example/api/yggdrasil/sessionserver'
    }, fetchImpl);

    assert.equal(url, 'https://skin.example/textures/rishu.png');
    assert.deepEqual(calls, [
        'https://skin.example/api/yggdrasil/sessionserver/session/minecraft/profile/23cbe0869d5033b28afb9c5108514be0?unsigned=false'
    ]);
});

test('looks up an official UUID before resolving its Mojang skin', async () => {
    const calls = [];
    const fetchImpl = async url => {
        calls.push(String(url));
        if (calls.length === 1) return { ok: true, json: async () => ({ id: '123456781234123412341234567890ab' }) };
        return { ok: true, json: async () => profileWithSkin('https://textures.minecraft.net/texture/example') };
    };
    const url = await resolveSkinTexture({ auth: 'offline', username: 'RishuQwQ' }, fetchImpl);

    assert.equal(url, 'https://textures.minecraft.net/texture/example');
    assert.deepEqual(calls, [
        'https://api.mojang.com/users/profiles/minecraft/RishuQwQ',
        'https://sessionserver.mojang.com/session/minecraft/profile/123456781234123412341234567890ab?unsigned=false'
    ]);
});

test('falls back to a Yggdrasil name lookup when the supplied UUID has no profile', async () => {
    const correctUuid = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
    const calls = [];
    const fetchImpl = async (url, options) => {
        calls.push(String(url));
        if (calls.length === 1) return { ok: true, status: 200, text: async () => '' };
        if (options?.method === 'POST') {
            return { ok: true, status: 200, text: async () => JSON.stringify([{ id: correctUuid, name: 'RishuQwQ' }]) };
        }
        return { ok: true, status: 200, text: async () => JSON.stringify(profileWithSkin('https://skin.example/textures/fallback.png')) };
    };

    const url = await resolveSkinTexture({
        auth: 'yggdrasil',
        username: 'RishuQwQ',
        uuid: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
        sessionServer: 'https://skin.example/api/yggdrasil/sessionserver'
    }, fetchImpl);

    assert.equal(url, 'https://skin.example/textures/fallback.png');
    assert.deepEqual(calls, [
        'https://skin.example/api/yggdrasil/sessionserver/session/minecraft/profile/bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb?unsigned=false',
        'https://skin.example/api/yggdrasil/api/profiles/minecraft',
        `https://skin.example/api/yggdrasil/sessionserver/session/minecraft/profile/${correctUuid}?unsigned=false`
    ]);
});

test('renders the face and transparent outer skin layer into a square avatar', async () => {
    const skin = createCanvas(64, 64);
    const skinContext = skin.getContext('2d');
    skinContext.fillStyle = '#ff0000';
    skinContext.fillRect(8, 8, 8, 8);
    skinContext.fillStyle = '#00ff00';
    skinContext.fillRect(40, 8, 1, 1);
    const source = skin.toBuffer('image/png');
    const image = await renderSkinHead('https://skin.example/skin.png', async () => ({
        ok: true,
        status: 200,
        arrayBuffer: async () => source.buffer.slice(source.byteOffset, source.byteOffset + source.byteLength)
    }));

    const rendered = await loadImage(image);
    const output = createCanvas(64, 64);
    const outputContext = output.getContext('2d');
    outputContext.drawImage(rendered, 0, 0);
    assert.deepEqual([...outputContext.getImageData(2, 2, 1, 1).data], [0, 255, 0, 255]);
    assert.deepEqual([...outputContext.getImageData(20, 20, 1, 1).data], [255, 0, 0, 255]);
});
