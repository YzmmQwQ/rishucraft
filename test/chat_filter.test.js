import test from 'node:test';
import assert from 'node:assert/strict';
import { isOwnChatMessage, normalizeUsername, rememberOutgoingChat } from '../src/agent/chat_filter.js';

function makeAgent() {
    return {
        name: 'RishuQwQ',
        bot: {
            username: 'RishuQwQ',
            player: { username: 'RishuQwQ' }
        }
    };
}

test('normalizes Minecraft formatting in usernames', () => {
    assert.equal(normalizeUsername('  §aRishuQwQ  '), 'rishuqwq');
});

test('rejects chat sent by the agent under plain or decorated names', () => {
    const agent = makeAgent();
    assert.equal(isOwnChatMessage(agent, 'RishuQwQ', 'hello'), true);
    assert.equal(isOwnChatMessage(agent, '<§aRishuQwQ>', 'hello'), true);
    assert.equal(isOwnChatMessage(agent, '[Bot] RishuQwQ', 'hello'), true);
    assert.equal(isOwnChatMessage(agent, 'Yzmm_MC', 'hello'), false);
});

test('rejects a server echo of a recently sent message', () => {
    const agent = makeAgent();
    rememberOutgoingChat(agent, 'Hello world!', 1_000);
    assert.equal(isOwnChatMessage(agent, '', 'Hello   world!', 1_100), true);
    assert.equal(isOwnChatMessage(agent, 'Server', 'something else', 1_100), false);
    assert.equal(isOwnChatMessage(agent, 'Server', 'Hello world!', 31_001), false);
});
