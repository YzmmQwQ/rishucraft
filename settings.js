const settings = {
    "minecraft_version": "auto", // 也可以指定具体版本，例如 "1.21.6"
    "host": "127.0.0.1", // 也可以填写 "localhost" 或服务器 IP 地址
    "port": 55916, // 设为 -1 时自动扫描可用端口
    "auth": "offline", // 可选 "offline"、"microsoft"，或用于 authlib-injector 皮肤站的 "yggdrasil"
    "yggdrasil_server": "", // Yggdrasil API 根地址，例如 "https://littleskin.cn/api/yggdrasil"
    "yggdrasil_account": "", // keys.json > YGGDRASIL_ACCOUNTS 中的可选账号键名；默认使用 Profile 名称

    // MindServer 负责管理所有 Agent 并托管 WebUI
    "mindserver_port": 8080,
    
    "base_profile": "assistant", // 可选 survival、assistant、creative 或 god_mode
    "profiles": [
        "./andy.json",
        // "./profiles/gpt.json",
        // "./profiles/claude.json",
        // "./profiles/gemini.json",
        // "./profiles/llama.json",
        // "./profiles/qwen.json",
        // "./profiles/grok.json",
        // "./profiles/mistral.json",
        // "./profiles/deepseek.json",
        // "./profiles/mercury.json",
        // "./profiles/andy-4.json", // 最多支持 75 条消息

        // 使用多个 Profile 时，需要通过 /msg 分别与每个机器人交流
        // 单独 Profile 中的配置会覆盖基础 Profile 的配置
    ],

    "load_memory": false, // 加载上一次会话保存的记忆
    "init_message": "Respond with hello world and your name", // 机器人生成后向所有机器人发送的初始消息
    "only_chat_with": [], // 机器人只监听并私聊这些玩家；留空时使用公共聊天

    "speak": false,
    // 允许所有机器人通过文本转语音功能朗读回复。
    // 在每个 Profile 中以 {provider}/{model}/{voice} 格式指定语音模型。
    // 设为 "system" 时使用系统自带的基础文本转语音功能。
    // Windows 和 macOS 可直接使用；Linux 需要通过包管理器安装 espeak，例如：`apt install espeak` 或 `pacman -S espeak`。

    "chat_ingame": true, // 在 Minecraft 聊天栏中显示机器人回复
    "language": "en", // 自动与该语言互译；支持的语言名称：https://cloud.google.com/translate/docs/languages
    "render_bot_view": false, // 在浏览器的 localhost:3000、3001 等地址显示机器人视角

    "allow_insecure_coding": false, // 允许使用 newAction 命令，让模型在本机编写并运行代码；启用需自行承担风险
    "allow_vision": false, // 允许视觉模型将截图作为输入进行理解
    "blocked_actions" : ["!checkBlueprint", "!checkBlueprintLevel", "!getBlueprint", "!getBlueprintLevel"] , // 禁用并从文档中移除的命令，例如 ["!setMode"]
    "code_timeout_mins": -1, // 代码允许运行的分钟数；-1 表示不限制时间
    "relevant_docs_count": 5, // 提示词中选取的相关代码函数文档数量；-1 表示全部选取

    "max_messages": 15, // 上下文中保留的最大消息数量
    "num_examples": 2, // 提供给模型的示例数量
    "max_commands": -1, // 连续回复中允许使用的最大命令数量；-1 表示不限制
    "show_command_syntax": "full", // 可选 "full"（完整）、"shortened"（精简）或 "none"（不显示）
    "narrate_behavior": true, // 在聊天中描述简单的自动行为，例如“正在捡起物品”
    "chat_bot_messages": true, // 在公共聊天中发送给其他机器人的消息

    "spawn_timeout": 30, // 等待机器人生成的超时秒数；生成较慢时可适当增大
    "block_place_delay": 0, // 使用 newAction 时每次放置方块的间隔（毫秒），可降低被服务器反作弊系统踢出的风险
  
    "log_all_prompts": false, // 将所有提示词记录到文件
};

export default settings;
