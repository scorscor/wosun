const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;
const MESSAGES_FILE = path.join(__dirname, 'data', 'messages.json');

// 中间件
app.use(express.json());
app.use(express.static(__dirname));

// 确保数据目录存在
async function ensureDataDir() {
  const dataDir = path.join(__dirname, 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }

  try {
    await fs.access(MESSAGES_FILE);
  } catch {
    await fs.writeFile(MESSAGES_FILE, JSON.stringify([]));
  }
}

// 读取留言
async function readMessages() {
  try {
    const data = await fs.readFile(MESSAGES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// 写入留言
async function writeMessages(messages) {
  await fs.writeFile(MESSAGES_FILE, JSON.stringify(messages, null, 2));
}

// 验证留言内容
function validateMessage(message) {
  if (!message || typeof message !== 'string') {
    return { valid: false, error: '留言内容不能为空' };
  }

  const trimmed = message.trim();

  if (trimmed.length === 0) {
    return { valid: false, error: '留言内容不能为空' };
  }

  if (trimmed.length > 200) {
    return { valid: false, error: '留言不能超过200字' };
  }

  // 检测英文字符
  if (/[a-zA-Z]/.test(trimmed)) {
    return { valid: false, error: '留言不允许包含英文字符' };
  }

  // 检测代码符号
  const codePatterns = /[<>{}[\]();=+\-*/%&|^~`$#@!\\]/;
  if (codePatterns.test(trimmed)) {
    return { valid: false, error: '留言不允许包含代码或特殊符号' };
  }

  return { valid: true, message: trimmed };
}

// API: 获取留言数量
app.get('/api/messages/count', async (req, res) => {
  try {
    const messages = await readMessages();
    res.json({ count: messages.length });
  } catch (error) {
    console.error('读取留言数量失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取今天的留言数量
function getTodayMessageCount(messages) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTimestamp = today.getTime();

  return messages.filter(msg => {
    const msgDate = new Date(msg.timestamp);
    msgDate.setHours(0, 0, 0, 0);
    return msgDate.getTime() === todayTimestamp;
  }).length;
}

// API: 提交留言
app.post('/api/messages', async (req, res) => {
  try {
    const { message } = req.body;

    // 验证留言
    const validation = validateMessage(message);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    // 读取现有留言
    const messages = await readMessages();

    // 检查今天的留言数量
    const todayCount = getTodayMessageCount(messages);
    if (todayCount >= 999) {
      return res.status(429).json({ error: '今日留言已达上限（999条），请明天再来' });
    }

    // 添加新留言
    const newMessage = {
      id: Date.now(),
      content: validation.message,
      timestamp: new Date().toISOString(),
    };

    messages.push(newMessage);

    // 保存留言
    await writeMessages(messages);

    res.json({ success: true, message: newMessage });
  } catch (error) {
    console.error('保存留言失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 启动服务器
async function startServer() {
  await ensureDataDir();
  app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
  });
}

startServer();