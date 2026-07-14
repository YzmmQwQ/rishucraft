import { randomUUID } from 'crypto';
import settings from '../agent/settings.js';
import { hasKey } from './keys.js';

function parseAccounts(value) {
    if (!value) return {};
    if (typeof value === 'object' && !Array.isArray(value)) return value;
    if (typeof value !== 'string') {
        throw new Error('YGGDRASIL_ACCOUNTS must be an object or a JSON object string.');
    }

    try {
        const accounts = JSON.parse(value);
        if (!accounts || typeof accounts !== 'object' || Array.isArray(accounts)) {
            throw new Error('not an object');
        }
        return accounts;
    } catch (err) {
        throw new Error(`Invalid YGGDRASIL_ACCOUNTS JSON: ${err.message}`);
    }
}

function requiredString(value, description) {
    if (typeof value !== 'string' || value.trim() === '') {
        throw new Error(`${description} is required for Yggdrasil authentication.`);
    }
    return value.trim();
}

function withoutTrailingSlash(url) {
    return requiredString(url, 'yggdrasil_server').replace(/\/+$/, '');
}

/**
 * Resolve one bot's credentials without putting passwords in settings.js.
 * Credentials may be stored in a YGGDRASIL_ACCOUNTS map, or in the flat
 * YGGDRASIL_USERNAME/YGGDRASIL_PASSWORD keys for a single-bot setup.
 */
export function resolveYggdrasilConfig(botName) {
    const accountKey = settings.profile?.yggdrasil_account || settings.yggdrasil_account || botName;
    const accounts = parseAccounts(hasKey('YGGDRASIL_ACCOUNTS'));
    const account = accounts[accountKey];

    const username = account?.username ?? hasKey('YGGDRASIL_USERNAME');
    const password = account?.password ?? hasKey('YGGDRASIL_PASSWORD');
    const profile = account?.profile ?? settings.profile?.yggdrasil_profile ?? settings.yggdrasil_profile ?? hasKey('YGGDRASIL_PROFILE');
    const apiRoot = withoutTrailingSlash(account?.server ?? settings.yggdrasil_server);

    if (!account && Object.keys(accounts).length > 0 && (!username || !password)) {
        throw new Error(`No Yggdrasil account named "${accountKey}" was found in YGGDRASIL_ACCOUNTS.`);
    }

    return {
        username: requiredString(username, 'Yggdrasil username'),
        password: requiredString(password, 'Yggdrasil password'),
        profile: typeof profile === 'string' && profile.trim() ? profile.trim() : null,
        authServer: `${apiRoot}/authserver`,
        sessionServer: `${apiRoot}/sessionserver`,
    };
}

async function postJson(fetchImpl, url, body) {
    let response;
    try {
        response = await fetchImpl(url, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(body),
        });
    } catch (err) {
        throw new Error(`Could not reach the Yggdrasil server: ${err.message}`);
    }

    const text = await response.text();
    let data = {};
    if (text) {
        try {
            data = JSON.parse(text);
        } catch {
            throw new Error(`Yggdrasil server returned invalid JSON (HTTP ${response.status}).`);
        }
    }

    if (!response.ok) {
        const message = data.errorMessage || data.error || response.statusText || `HTTP ${response.status}`;
        throw new Error(`Yggdrasil authentication failed: ${message}`);
    }
    return data;
}

function findProfile(profiles, name) {
    if (!name || !Array.isArray(profiles)) return null;
    const expected = name.toLowerCase();
    return profiles.find(profile => profile?.name?.toLowerCase() === expected) || null;
}

/** Authenticate and, when requested, select a particular skin-site profile. */
export async function authenticateYggdrasil(config, fetchImpl = globalThis.fetch) {
    const clientToken = randomUUID().replaceAll('-', '');
    let session = await postJson(fetchImpl, `${config.authServer}/authenticate`, {
        agent: { name: 'Minecraft', version: 1 },
        username: config.username,
        password: config.password,
        clientToken,
        requestUser: true,
    });

    const requestedProfile = findProfile(session.availableProfiles, config.profile);
    if (config.profile && !requestedProfile && session.selectedProfile?.name?.toLowerCase() !== config.profile.toLowerCase()) {
        const available = (session.availableProfiles || []).map(item => item.name).filter(Boolean).join(', ');
        throw new Error(`Yggdrasil profile "${config.profile}" was not found${available ? `. Available profiles: ${available}` : ''}.`);
    }

    if (requestedProfile && session.selectedProfile?.id !== requestedProfile.id) {
        session = await postJson(fetchImpl, `${config.authServer}/refresh`, {
            accessToken: session.accessToken,
            clientToken: session.clientToken || clientToken,
            selectedProfile: requestedProfile,
            requestUser: true,
        });
    }

    if (!session.accessToken || !session.selectedProfile?.id || !session.selectedProfile?.name) {
        const available = (session.availableProfiles || []).map(item => item.name).filter(Boolean).join(', ');
        const hint = available ? ` Set a profile explicitly; available profiles: ${available}.` : '';
        throw new Error(`Yggdrasil server did not return a selected Minecraft profile.${hint}`);
    }

    return {
        ...session,
        clientToken: session.clientToken || clientToken,
    };
}

/** Create the custom authentication hook expected by minecraft-protocol. */
export function createYggdrasilAuth(config, fetchImpl = globalThis.fetch) {
    return (client, options) => {
        authenticateYggdrasil(config, fetchImpl).then(session => {
            client.session = session;
            client.username = session.selectedProfile.name;
            client.uuid = session.selectedProfile.id;
            options.accessToken = session.accessToken;
            client.emit('session', session);
            options.connect(client);
        }).catch(err => {
            client.emit('error', err);
        });
    };
}
