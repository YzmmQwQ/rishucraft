(() => {
    const dictionaries = {
        'zh-CN': {
            strings: {
                agentConsole: '智能体控制台',
                yourWorkspace: '你的工作区',
                agents: '智能体',
                dashboardIntro: '在一个页面中查看智能体状态、发送消息并管理所有 Minecraft 会话。',
                interfaceLanguage: '界面语言',
                newAgent: '新建智能体',
                disconnectAll: '断开全部智能体',
                fullShutdown: '完全关闭',
                createAgent: '创建智能体',
                close: '关闭',
                profileNotUploaded: '角色配置：未上传',
                profileUploaded: '角色配置：{name}',
                createAgentHint: '配置参数，然后上传角色配置并创建智能体。',
                uploadProfile: '上传角色配置',
                agentSettings: '智能体设置',
                settingsFor: '{name} 的设置',
                agentSettingsHint: '修改设置并应用，智能体随后将重新启动。',
                discardChanges: '放弃更改',
                applyRestart: '应用并重启',
                mindServerOnline: 'MindServer 在线',
                mindServerOffline: 'MindServer 离线',
                invalidProfile: '角色配置 JSON 无效：{error}',
                unknownError: '未知错误',
                noAgentsTitle: '还没有智能体',
                noAgentsDescription: '创建一个智能体，即可开始监控 Minecraft 中的活动。',
                online: '在线',
                connecting: '连接中',
                offline: '离线',
                joiningWorld: '· 正在进入世界',
                settings: '设置',
                inventory: '背包',
                idle: '空闲',
                acting: '执行中',
                chatting: '聊天中',
                thinking: '思考中',
                stopped: '已停止',
                health: '生命值：{value}/{max}',
                hunger: '饥饿值：{value}/{max}',
                biome: '生物群系：{value}',
                gameMode: '游戏模式：{value}',
                inventorySlots: '背包槽位：{used}/{total}',
                equipped: '手持：{value}',
                none: '无',
                armor: '装备',
                head: '头部',
                chest: '胸部',
                legs: '腿部',
                feet: '脚部',
                mainHand: '主手',
                empty: '空',
                latest: '最新',
                waitingOutput: '正在等待智能体输出…',
                messagePlaceholder: '向 {name} 发送消息…',
                send: '发送',
                stopAction: '停止动作',
                stayStill: '保持不动',
                restart: '重启',
                disconnect: '断开连接',
                connect: '连接',
                connectingButton: '连接中…',
                remove: '移除',
                shutdownConfirm: '确定要完全关闭吗？\n这会停止全部智能体并关闭服务器。'
            },
            settings: {
                minecraft_version: ['Minecraft 版本', '使用的 Minecraft 版本；填写 auto 可自动检测。'],
                host: ['服务器地址', '要连接的 Minecraft 服务器地址。'],
                port: ['服务器端口', 'Minecraft 服务器端口；填写 -1 可自动检测。'],
                auth: ['验证方式', '登录 Minecraft 使用的验证方式。'],
                yggdrasil_server: ['Yggdrasil 地址', '使用 Yggdrasil 验证时的 authlib-injector API 根地址。'],
                yggdrasil_account: ['Yggdrasil 账号', 'keys.json 中 YGGDRASIL_ACCOUNTS 的账号键；留空时使用角色名称。'],
                base_profile: ['基础配置', '可选 survival、assistant、creative 或 god_mode，分别适用于不同玩法。'],
                load_memory: ['加载记忆', '启动时是否加载智能体之前的记忆。'],
                init_message: ['初始消息', '智能体启动后收到的第一条系统消息；留空则不发送。'],
                only_chat_with: ['仅与这些智能体聊天', '限制聊天对象的智能体列表；空列表表示公开聊天。'],
                speak: ['语音朗读', '是否在主机上朗读文字消息。'],
                language: ['自动翻译语言', '使用 Google 翻译自动互译时采用的语言。'],
                allow_vision: ['允许视觉', '是否允许智能体使用视觉能力。'],
                blocked_actions: ['禁用动作', '禁止智能体执行的动作列表。'],
                relevant_docs_count: ['相关文档数量', '让模型编写代码时加入提示词的相关函数文档数量。'],
                max_messages: ['最大消息数', '上下文中保留的最近消息数量上限。'],
                num_examples: ['示例数量', '为改善模型回答而选择的示例数量。'],
                max_commands: ['连续命令上限', '连续回答中允许的最大命令数；-1 表示不限。'],
                narrate_behavior: ['播报自动行为', '是否在聊天中显示“正在捡取物品”等自动行为。'],
                log_all_prompts: ['记录全部提示词', '是否把所有提示词写入文件；日志可能非常多。'],
                show_command_syntax: ['命令显示方式', '命令语法显示为 full、shortened 或 none。'],
                chat_ingame: ['发送到游戏聊天', '是否在 Minecraft 聊天中显示智能体消息。'],
                chat_bot_messages: ['公开智能体间消息', '是否公开显示智能体之间收发的消息。'],
                render_bot_view: ['显示智能体视角', '是否渲染智能体视角供查看；这不会赋予智能体视觉。'],
                allow_insecure_coding: ['允许不安全代码', '允许模型通过 newAction 在主机上编写并运行代码，存在安全风险。'],
                code_timeout_mins: ['代码超时（分钟）', '代码允许运行的分钟数；-1 表示不限时。'],
                task: ['启动任务', '启动时交给智能体的任务对象；null 表示没有任务。'],
                spawn_timeout: ['生成超时（秒）', '等待机器人在游戏中生成的最长时间；生成较慢时可调大。']
            }
        },
        en: {
            strings: {
                agentConsole: 'Agent console', yourWorkspace: 'Your workspace', agents: 'Agents',
                dashboardIntro: 'Monitor agent state, send messages, and manage every Minecraft session from one place.',
                interfaceLanguage: 'Language', newAgent: 'New Agent', disconnectAll: 'Disconnect All Agents',
                fullShutdown: 'Full Shutdown', createAgent: 'Create Agent', close: 'Close',
                profileNotUploaded: 'Profile: Not uploaded', profileUploaded: 'Profile: {name}',
                createAgentHint: 'Configure settings, then upload a profile and create the agent.',
                uploadProfile: 'Upload Profile', agentSettings: 'Agent Settings', settingsFor: '{name} Settings',
                agentSettingsHint: 'Modify settings then apply to restart the agent.', discardChanges: 'Discard Changes',
                applyRestart: 'Apply & Restart', mindServerOnline: 'MindServer online', mindServerOffline: 'MindServer offline',
                invalidProfile: 'Invalid profile JSON: {error}', unknownError: 'Unknown error',
                noAgentsTitle: 'No agents yet', noAgentsDescription: 'Create an agent to start monitoring Minecraft activity from this workspace.',
                online: 'Online', connecting: 'Connecting', offline: 'Offline', joiningWorld: '· joining world',
                settings: 'Settings', inventory: 'Inventory', idle: 'Idle', acting: 'Acting', chatting: 'Chatting',
                thinking: 'Thinking', stopped: 'Stopped', health: 'health: {value}/{max}', hunger: 'hunger: {value}/{max}',
                biome: 'biome: {value}', gameMode: 'gamemode: {value}', inventorySlots: 'inventory slots: {used}/{total}',
                equipped: 'equipped: {value}', none: 'none', armor: 'Armor', head: 'head', chest: 'chest', legs: 'legs',
                feet: 'feet', mainHand: 'main hand', empty: 'empty', latest: 'LATEST', waitingOutput: 'Waiting for agent output…',
                messagePlaceholder: 'Message {name}...', send: 'Send', stopAction: 'Stop action', stayStill: 'Stay still',
                restart: 'Restart', disconnect: 'Disconnect', connect: 'Connect', connectingButton: 'Connecting...', remove: 'Remove',
                shutdownConfirm: 'Are you sure you want to perform a full shutdown?\nThis will stop all agents and close the server.'
            },
            settings: {}
        }
    };

    function normalizeLanguage(language) {
        return String(language || '').toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
    }

    function getInitialLanguage() {
        try {
            const saved = localStorage.getItem('rishucraft-ui-language');
            if (saved) return normalizeLanguage(saved);
        } catch { /* localStorage may be unavailable */ }
        return 'zh-CN';
    }

    function translate(language, key, values = {}) {
        const lang = normalizeLanguage(language);
        const template = dictionaries[lang].strings[key] ?? dictionaries.en.strings[key] ?? key;
        return template.replace(/\{(\w+)\}/g, (_, name) => values[name] ?? `{${name}}`);
    }

    function getSetting(language, key, fallbackDescription = '') {
        const lang = normalizeLanguage(language);
        const translated = dictionaries[lang].settings[key];
        return {
            label: translated?.[0] || key,
            description: translated?.[1] || fallbackDescription
        };
    }

    window.RishuI18n = { normalizeLanguage, getInitialLanguage, translate, getSetting };
})();
