const OUTGOING_ECHO_TTL_MS = 30_000;

function normalizeMessage(message) {
    return String(message || '').replace(/\s+/g, ' ').trim();
}

export function normalizeUsername(username) {
    return String(username || '')
        .replace(/§[0-9A-FK-OR]/gi, '')
        .trim()
        .toLowerCase();
}

function usernameContains(normalizedUsername, ownName) {
    if (!normalizedUsername || !ownName) return false;
    if (normalizedUsername === ownName) return true;
    const escaped = ownName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`(?:^|[^a-z0-9_])${escaped}(?:$|[^a-z0-9_])`, 'i').test(normalizedUsername);
}

function pruneOutgoingChats(agent, now) {
    const recent = Array.isArray(agent._recentOutgoingChats) ? agent._recentOutgoingChats : [];
    agent._recentOutgoingChats = recent.filter(entry => now - entry.sentAt <= OUTGOING_ECHO_TTL_MS);
    return agent._recentOutgoingChats;
}

export function rememberOutgoingChat(agent, message, now = Date.now()) {
    const normalized = normalizeMessage(message);
    if (!normalized) return;
    const recent = pruneOutgoingChats(agent, now);
    recent.push({ message: normalized, sentAt: now });
}

export function isOwnChatMessage(agent, username, message, now = Date.now()) {
    const sender = normalizeUsername(username);
    const ownNames = [agent.name, agent.bot?.username, agent.bot?.player?.username]
        .map(normalizeUsername)
        .filter(Boolean);
    if (ownNames.some(ownName => usernameContains(sender, ownName))) return true;

    const normalizedMessage = normalizeMessage(message);
    if (!normalizedMessage) return false;
    return pruneOutgoingChats(agent, now).some(entry => entry.message === normalizedMessage);
}
