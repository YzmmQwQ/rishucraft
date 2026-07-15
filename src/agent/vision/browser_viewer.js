import settings from '../settings.js';

const activeViewers = new WeakSet();

export async function addBrowserViewer(bot, count_id, force = false) {
    if (activeViewers.has(bot)) return true;
    if (!force && !settings.render_bot_view) return false;

    const prismarineViewer = (await import('prismarine-viewer')).default;
    prismarineViewer.mineflayer(bot, { port: 3000+count_id, firstPerson: true, });
    activeViewers.add(bot);
    return true;
}
