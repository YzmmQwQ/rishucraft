function normalizeUuid(uuid) {
    const compact = String(uuid || '').replaceAll('-', '').toLowerCase();
    return /^[0-9a-f]{32}$/.test(compact) ? compact : null;
}

async function fetchJson(fetchImpl, url, options) {
    const response = await fetchImpl(url, options);
    if (!response.ok) throw new Error(`Skin service returned HTTP ${response.status}.`);
    if (typeof response.text !== 'function') return response.json();
    const body = await response.text();
    if (!body.trim()) throw new Error(`Skin service returned an empty response for ${url}.`);
    try {
        return JSON.parse(body);
    } catch (error) {
        throw new Error(`Skin service returned invalid JSON for ${url}: ${error.message}`);
    }
}

function decodeSkinUrl(profile) {
    const encoded = profile?.properties?.find(property => property?.name === 'textures')?.value;
    if (!encoded) throw new Error('Profile does not contain a textures property.');

    let textures;
    try {
        textures = JSON.parse(Buffer.from(encoded, 'base64').toString('utf8'));
    } catch (error) {
        throw new Error(`Profile contains invalid skin data: ${error.message}`);
    }

    const skinUrl = textures?.textures?.SKIN?.url;
    let parsed;
    try {
        parsed = new URL(skinUrl);
    } catch {
        throw new Error('Profile skin URL is invalid.');
    }
    if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('Profile skin URL uses an unsupported protocol.');
    return parsed.href;
}

async function resolveOfficialUuid(username, fetchImpl) {
    if (!username) throw new Error('A Minecraft username is required to resolve an official skin.');
    const profile = await fetchJson(
        fetchImpl,
        `https://api.mojang.com/users/profiles/minecraft/${encodeURIComponent(username)}`
    );
    const uuid = normalizeUuid(profile?.id);
    if (!uuid) throw new Error(`No official Minecraft profile was found for ${username}.`);
    return uuid;
}

async function resolveYggdrasilUuid(username, sessionServer, fetchImpl) {
    if (!username) throw new Error('A profile name is required to resolve a Yggdrasil skin.');
    const apiRoot = sessionServer.replace(/\/sessionserver\/?$/i, '');
    const profiles = await fetchJson(fetchImpl, `${apiRoot}/api/profiles/minecraft`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify([username])
    });
    const match = Array.isArray(profiles)
        ? profiles.find(profile => profile?.name?.toLowerCase() === username.toLowerCase()) || profiles[0]
        : null;
    const uuid = normalizeUuid(match?.id);
    if (!uuid) throw new Error(`No Yggdrasil profile was found for ${username}.`);
    return uuid;
}

export async function resolveSkinTexture(identity, fetchImpl = globalThis.fetch) {
    const auth = String(identity?.auth || 'offline').toLowerCase();
    const username = String(identity?.username || '').trim();
    const isYggdrasil = auth === 'yggdrasil';
    const sessionServer = isYggdrasil
        ? String(identity?.sessionServer || '').replace(/\/+$/, '')
        : 'https://sessionserver.mojang.com';
    if (isYggdrasil && !/^https?:\/\//i.test(sessionServer)) {
        throw new Error('Yggdrasil session server is unavailable.');
    }

    let uuid = normalizeUuid(identity?.uuid);
    if (!uuid) {
        uuid = isYggdrasil
            ? await resolveYggdrasilUuid(username, sessionServer, fetchImpl)
            : await resolveOfficialUuid(username, fetchImpl);
    }

    const fetchProfile = profileUuid => fetchJson(
        fetchImpl,
        `${sessionServer}/session/minecraft/profile/${profileUuid}?unsigned=false`
    );
    let profile;
    try {
        profile = await fetchProfile(uuid);
    } catch (error) {
        if (!isYggdrasil || !identity?.uuid) throw error;
        const resolvedUuid = await resolveYggdrasilUuid(username, sessionServer, fetchImpl);
        if (resolvedUuid === uuid) throw error;
        uuid = resolvedUuid;
        profile = await fetchProfile(uuid);
    }
    return decodeSkinUrl(profile);
}

export async function renderSkinHead(skinUrl, fetchImpl = globalThis.fetch) {
    const response = await fetchImpl(skinUrl);
    if (!response.ok) throw new Error(`Skin texture returned HTTP ${response.status}.`);
    const texture = Buffer.from(await response.arrayBuffer());
    if (!texture.length) throw new Error('Skin texture is empty.');
    if (texture.length > 4 * 1024 * 1024) throw new Error('Skin texture is too large.');

    const image = await loadImage(texture);
    if (image.width < 64 || image.height < 16 || image.width % 64 !== 0) {
        throw new Error(`Unsupported skin dimensions: ${image.width}x${image.height}.`);
    }

    const scale = image.width / 64;
    const canvas = createCanvas(64, 64);
    const context = canvas.getContext('2d');
    context.imageSmoothingEnabled = false;
    context.clearRect(0, 0, 64, 64);
    context.drawImage(image, 8 * scale, 8 * scale, 8 * scale, 8 * scale, 0, 0, 64, 64);
    context.drawImage(image, 40 * scale, 8 * scale, 8 * scale, 8 * scale, 0, 0, 64, 64);
    return canvas.toBuffer('image/png');
}

export { decodeSkinUrl, normalizeUuid };
import { createCanvas, loadImage } from 'canvas';
