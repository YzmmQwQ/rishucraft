# 🍐RishuCRAFT NEXT

拟人化的 AI Minecraft Player，基于广大 LLM 和 <a href="https://prismarinejs.github.io/mineflayer/#/">Mineflayer</a>。

<p align="center">
  <a href="https://github.com/mindcraft-bots/mindcraft/blob/main/FAQ.md">F&Q</a> |
  <a href="https://discord.gg/mp73p35dzC">社群</a> |
  <a href="https://mindcraft-minecollab.github.io/index.html">网站</a> |
  <a href="https://github.com/mindcraft-bots/mindcraft/blob/main/minecollab.md">提点建议</a>
</p>

## 项目来源与许可证
RishuCraft 是 [Mindcraft](https://github.com/mindcraft-bots/mindcraft) 的衍生分支（fork），在其基础上进行中文本地化、功能扩展和兼容性调整。原始项目由 Kolby Nottingham 及 Mindcraft 贡献者开发；上游项目名称、链接和原作者信息在此明确保留。
本分支及其修改继续按照 [MIT License](LICENSE) 发布。MIT 许可证允许使用、复制、修改、合并、发布和再分发，但再分发本项目或其重要部分时，必须同时保留 `LICENSE` 中的原版权声明和许可声明。本仓库的修改不代表上游 Mindcraft 项目或其维护者的官方立场。

> [!CAUTION]
> 不要在启用代码编写功能时将此机器人连接到公共服务器。本项目允许 LLM 在你的计算机上编写并执行代码。代码虽然运行在沙箱中，但仍可能受到提示词注入攻击。代码编写功能默认关闭；如需启用，请在 `settings.js` 中将 `allow_insecure_coding` 设置为 `true`。请充分了解其中的风险。

# 快速开始

## 环境要求

- [Minecraft Java 版](https://www.minecraft.net/en-us/store/minecraft-java-bedrock-edition-pc)（最高支持 v1.21.11，推荐 v1.21.6）
- [Node.js](https://nodejs.org/)（最低 v22.13.0，支持并推荐 Node v24）
- 至少一个受支持 API 提供商的 API Key。请参阅[支持的 API](#模型定制)。默认使用 OpenAI。

> [!IMPORTANT]
> 在 Windows 上安装 Node.js 时，请确保勾选 `Automatically install the necessary tools`（自动安装所需工具）。
>
> 如果在 macOS 上运行 `npm install` 时遇到错误，请参阅 [FAQ](FAQ.md#common-issues) 排查原生模块的构建问题。

## 安装与运行

1. 确认已经满足上述环境要求。

2. 下载并解压[最新发行版](https://github.com/mindcraft-bots/mindcraft/releases/latest)，或者克隆本仓库。

3. 将 `keys.example.json` 重命名为 `keys.json`，然后填入 API Key（只需配置一个）。目标模型在 `andy.json` 或其他 Profile 中设置；其他模型请参考下方表格。

4. 在项目目录中打开终端或命令提示符，运行 `npm install`。

   默认关闭的 AI 视觉功能包含需要本地编译的原生 WebGL 依赖，因此不再阻塞普通安装。如需启用 `allow_vision`，请先安装系统 C++ 构建工具，再运行 `npm run install:vision`。

5. 启动一个 Minecraft 世界，并通过局域网开放到本机端口 `55916`。

6. 在项目目录中运行 `node main.js`。

如果遇到问题，请查看 [FAQ](https://github.com/mindcraft-bots/mindcraft/blob/main/FAQ.md)，或前往 [Discord](https://discord.gg/mp73p35dzC) 寻求支持。目前我们回复 GitHub Issue 的速度较慢。如需运行任务，请参阅 [MineCollab 说明](minecollab.md#installation)。

# 配置

## 模型定制

你可以在 `settings.js` 中配置项目参数，[查看该文件](settings.js)。

你可以在 `andy.json` 等 Profile 中配置 Agent 的名称、模型和提示词。对话与规划模型分别通过 `chat_model`、`plan_model` 指定；旧 `model` 字段仍兼容。你需要为所选 API 提供商配置正确的 API Key。所有支持的 API 如下。

<details>
<summary><strong>⭐ 查看支持的 API ⭐</strong></summary>

| API 名称 | 配置变量 | 文档 |
|------|------|------|
| `openai` | `OPENAI_API_KEY` | [文档](https://platform.openai.com/docs/models) |
| `google` | `GEMINI_API_KEY` | [文档](https://ai.google.dev/gemini-api/docs/models/gemini) |
| `anthropic` | `ANTHROPIC_API_KEY` | [文档](https://docs.anthropic.com/claude/docs/models-overview) |
| `xai` | `XAI_API_KEY` | [文档](https://docs.x.ai/docs) |
| `deepseek` | `DEEPSEEK_API_KEY` | [文档](https://api-docs.deepseek.com/) |
| `ollama`（本地） | 不适用 | [文档](https://ollama.com/library) |
| `qwen` | `QWEN_API_KEY` | [国际版](https://www.alibabacloud.com/help/en/model-studio/developer-reference/use-qwen-by-calling-api)/[中国版](https://help.aliyun.com/zh/model-studio/getting-started/models) |
| `mistral` | `MISTRAL_API_KEY` | [文档](https://docs.mistral.ai/getting-started/models/models_overview/) |
| `replicate` | `REPLICATE_API_KEY` | [文档](https://replicate.com/collections/language-models) |
| `groq`（不是 grok） | `GROQCLOUD_API_KEY` | [文档](https://console.groq.com/docs/models) |
| `huggingface` | `HUGGINGFACE_API_KEY` | [文档](https://huggingface.co/models) |
| `novita` | `NOVITA_API_KEY` | [文档](https://novita.ai/model-api/product/llm-api?utm_source=github_mindcraft&utm_medium=github_readme&utm_campaign=link) |
| `openrouter` | `OPENROUTER_API_KEY` | [文档](https://openrouter.ai/models) |
| `glhf` | `GHLF_API_KEY` | [文档](https://glhf.chat/user-settings/api) |
| `hyperbolic` | `HYPERBOLIC_API_KEY` | [文档](https://docs.hyperbolic.xyz/docs/getting-started) |
| `vllm` | 不适用 | 不适用 |
| `cerebras` | `CEREBRAS_API_KEY` | [文档](https://inference-docs.cerebras.ai/introduction) |
| `mercury` | `MERCURY_API_KEY` | [文档](https://www.inceptionlabs.ai/) |

</details>

更完整的模型配置方式和语法，请参阅[模型规格](#模型规格)。

本项目通过 [Ollama](https://ollama.com/) 支持本地模型，并提供了经过微调的模型。安装 Ollama 后，运行以下命令安装这些模型：

```bash
ollama pull sweaterdog/andy-4:micro-q8_0 && ollama pull embeddinggemma
```

## 在线服务器

要连接在线服务器，机器人需要一个正版 Microsoft/Minecraft 账号。你可以使用自己的账号，但如果还想同时以玩家身份进入服务器，则需要另一个账号。请在 `settings.js` 中修改以下配置：

```javascript
"host": "111.222.333.444",
"port": 55920,
"auth": "microsoft",

// 其余配置保持不变……
```

> [!IMPORTANT]
> Profile JSON 中的机器人名称必须与 Minecraft Profile 名称完全一致，否则机器人会不断与自己对话。

使用不同账号时，Mindcraft 会连接 Minecraft 启动器当前登录的账号。你可以先在启动器中切换账号并运行 `node main.js`，等待机器人连接成功后，再切回你的主账号。

### 外置登录（皮肤站 / authlib-injector）

Mindcraft 支持兼容 authlib-injector 的 Yggdrasil 皮肤站。先在 `settings.js` 中设置认证方式和皮肤站提供的 API 根地址：

```javascript
"auth": "yggdrasil",
"yggdrasil_server": "https://littleskin.cn/api/yggdrasil",
```

然后在不会提交到 Git 的 `keys.json` 中配置账号。键名默认使用 Agent Profile 的 `name`；下面的 `andy` 对应 `andy.json` 中的 Agent 名称：

```json
"YGGDRASIL_ACCOUNTS": {
  "andy": {
    "username": "皮肤站登录名或邮箱",
    "password": "皮肤站密码",
    "profile": "皮肤站角色名"
  }
}
```

`profile` 用于账号拥有多个角色时选择角色；只有一个角色时可以省略。多个机器人需要在 `YGGDRASIL_ACCOUNTS` 中分别配置账号，并让各 Agent 名称与对应的键名一致。也可以在 Profile 中用 `"yggdrasil_account": "另一个键名"` 指定账号。请勿把真实密码写入 `settings.js`、Profile 或 `keys.example.json`。

## 任务

任务会自动向机器人发送提示词，并指定需要获取的目标物品或需要建造的蓝图。以下命令会运行一个收集 4 个 `oak_log` 的简单任务：

`node main.js --task_path tasks/basic/single_agent.json --task_id gather_oak_logs`

任务 JSON 的格式示例如下：

```json
{
  "gather_oak_logs": {
    "goal": "Collect at least four logs",
    "initial_inventory": {
      "0": {
        "wooden_axe": 1
      }
    },
    "agent_count": 1,
    "target": "oak_log",
    "number_of_target": 4,
    "type": "techtree",
    "max_depth": 1,
    "depth": 0,
    "timeout": 300,
    "blocked_actions": {
      "0": [],
      "1": []
    },
    "missing_items": [],
    "requires_ctable": false
  }
}
```

`initial_inventory` 表示本轮任务开始时机器人拥有的物品；`target` 表示目标物品；`number_of_target` 表示成功完成任务所需收集的目标物品数量。

如果需要更多优化功能以及自动启动 Minecraft 世界，请按照 [MineCollab 说明](minecollab.md#installation)进行配置。

## Docker 容器

如果准备启用 `allow_insecure_coding`，建议在 Docker 容器中运行应用，以降低执行未知代码的风险。连接远程服务器之前强烈建议这样做，但 Docker 仍不能保证绝对安全。

```bash
docker build -t mindcraft . && docker run --rm --add-host=host.docker.internal:host-gateway -p 8080:8080 -p 3000-3003:3000-3003 -e SETTINGS_JSON='{"profiles":["./profiles/gemini.json"],"host":"host.docker.internal"}' --volume ./keys.json:/app/keys.json --name mindcraft mindcraft
```

或者直接运行：

```bash
docker-compose up --build
```

在 Docker 中运行时，如果希望机器人加入本机 Minecraft 服务器，需要通过特殊主机地址 `host.docker.internal` 从容器访问宿主机。请在 [settings.js](settings.js) 中加入以下配置：

```javascript
"host": "host.docker.internal", // 使用该地址代替 "localhost"，从容器连接宿主机上的 Minecraft
```

如需连接尚未受支持的 Minecraft 版本，可以尝试使用 [ViaProxy](services/viaproxy/README.md)。

# 机器人 Profile

机器人 Profile 是 `andy.json` 这类 JSON 文件，用于定义：

1. 机器人对话、规划、代码编写和嵌入所使用的后端 LLM。
2. 影响机器人行为的提示词。
3. 帮助机器人完成任务的示例。

## 模型规格

聊天和规划模型分别通过 `chat_model` 与 `plan_model` 指定。模型可以是简单字符串，例如 `"gpt-5.4"`，也可以使用更明确的 `"{api}/{model}"` 格式，例如 `"openrouter/google/gemini-2.5-pro"`。旧版 `model` 字段仍作为两者的兼容回退。

模型字段可以是字符串或对象。模型对象必须指定 `api`，还可选填 `model`、`url`、`api_key` 和额外的 `params`。`api_key` 填写的是 `keys.json` 中的字段名称，不是真实密钥。你可以为对话、规划、代码编写、视觉、嵌入和语音合成分别使用不同模型、URL 和 Key。示例如下：

```json
"chat_model": {
  "api": "openai",
  "model": "gpt-5.4-mini",
  "url": "https://chat-provider.example/v1/",
  "api_key": "CUSTOM_CHAT_API_KEY"
},
"plan_model": {
  "api": "openai",
  "model": "gpt-5.4",
  "url": "https://plan-provider.example/v1/",
  "api_key": "CUSTOM_PLAN_API_KEY",
  "params": {
    "max_tokens": 1000,
    "temperature": 1
  }
},
"code_model": {
  "api": "openai",
  "model": "gpt-5.4-mini",
  "url": "https://api.openai.com/v1/"
},
"vision_model": {
  "api": "openai",
  "model": "gpt-5.4",
  "url": "https://api.openai.com/v1/"
},
"embedding": {
  "api": "openai",
  "url": "https://api.openai.com/v1/",
  "model": "text-embedding-3-small"
},
"speak_model": {
  "api": "openai",
  "model": "tts-1",
  "voice": "echo",
  "url": "https://tts-provider.example/v1/",
  "api_key": "CUSTOM_TTS_API_KEY"
}
```

`chat_model` 只用于生成日常对话回复；`plan_model` 用于记忆总结、目标规划和是否回应等非对话推理。`code_model` 用于 `newAction` 代码编写，`vision_model` 用于图像理解，`embedding` 用于对文本进行嵌入以选择示例，`speak_model` 用于语音合成。未配置 `code_model` 或 `vision_model` 时会回退到 `plan_model`。旧 `model` 会同时作为 `chat_model` 和 `plan_model` 的回退。

可以通过 `chat_prompt` 自定义聊天提示词。留空或省略时使用项目内置提示词；填写后会完整替换内置的 `conversing` 提示词。支持 `$NAME`、`$MEMORY`、`$STATS`、`$INVENTORY`、`$COMMAND_DOCS`、`$EXAMPLES` 和 `$SELF_PROMPT` 等占位符：

```json
"chat_prompt": "你是 Minecraft 助手 $NAME。请使用简短自然的中文回复。\n$MEMORY\n$STATS\n$INVENTORY\n$COMMAND_DOCS\n$EXAMPLES\nConversation Begin:"
```

Profile 使用严格 JSON 格式，不能加入 `//` 或 `/* */` 注释。需要写配置说明时，可以像 `andy.json` 一样使用 `_comments` 字段；未使用的字段会被程序忽略。

所有 API 都有默认模型和 URL，因此这些字段可以省略。`params` 字段也是可选的，可传入对应 API 支持的任意附加参数，但嵌入模型不支持该字段。

## 嵌入模型

嵌入模型用于向量化文本，以便高效选择与对话和代码编写相关的示例。

支持的嵌入 API：`openai`、`google`、`replicate`、`huggingface`、`novita`

如果使用不受支持的模型，系统将回退到简单的词语重叠算法，性能可能下降。建议使用受支持的嵌入 API。

## 语音合成模型

语音合成模型用于朗读机器人回复，通过 `speak_model` 指定。它既支持 `"{api}/{model}/{voice}"` 字符串，例如 `"openai/tts-1/echo"`，也支持包含 `api`、`model`、`voice`、`url` 和 `api_key` 的对象。语音合成目前仅支持 `openai` 和 `google`；自定义 `api_key` 引用适用于 OpenAI 兼容语音接口。

## 通过命令行指定 Profile

程序默认使用 `settings.js` 中指定的 Profile。你可以通过 `--profiles` 参数指定一个或多个 Agent Profile：`node main.js --profiles ./profiles/andy.json ./profiles/jill.json`

# 参与贡献

欢迎为本项目做出贡献！相比 GitHub Issue，我们通常会更快处理 Pull Request。你也可以加入 [Discord](https://discord.gg/mp73p35dzC) 获取更及时的支持和开发方向。

本项目允许使用 AI 生成的代码，但请务必仔细审查。大量提交未经检查的低质量代码和文档会直接妨碍项目开发。

## 补丁

本项目依赖的部分 Node 模块存在缺陷。如需添加补丁，请先修改本地 `node_modules` 中对应模块的文件，然后运行 `npx patch-package [package-name]`。

## 开发团队

感谢所有为本项目做出贡献的人，特别是官方开发团队：[@MaxRobinsonTheGreat](https://github.com/MaxRobinsonTheGreat)、[@kolbytn](https://github.com/kolbytn)、[@icwhite](https://github.com/icwhite)、[@Sweaterdog](https://github.com/Sweaterdog)、[@Ninot1Quyi](https://github.com/Ninot1Quyi)、[@riqvip](https://github.com/riqvip)、[@uukelele-scratch](https://github.com/uukelele-scratch)、[@mrelmida](https://github.com/mrelmida)。

## 引用

本项目成果发表于论文 [Collaborating Action by Action: A Multi-agent LLM Framework for Embodied Reasoning](https://arxiv.org/abs/2504.17950)。如果你在研究中使用本项目，请引用：

```bibtex
@article{mindcraft2025,
  title = {Collaborating Action by Action: A Multi-agent LLM Framework for Embodied Reasoning},
  author = {White*, Isadora and Nottingham*, Kolby and Maniar, Ayush and Robinson, Max and Lillemark, Hansen and Maheshwari, Mehul and Qin, Lianhui and Ammanabrolu, Prithviraj},
  journal = {arXiv preprint arXiv:2504.17950},
  year = {2025},
  url = {https://arxiv.org/abs/2504.17950},
}
```

## 贡献者

感谢所有在 GitHub 及其他渠道提交问题、提出建议并帮助本项目不断完善的人。

![贡献者](https://contrib.rocks/image?repo=mindcraft-bots/mindcraft)
