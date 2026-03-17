// 字符计数
const messageInput = document.getElementById('messageInput');
const charCount = document.getElementById('charCount');
const submitBtn = document.getElementById('submitBtn');
const submitMessage = document.getElementById('submitMessage');
const messageCount = document.getElementById('messageCount');

// 更新字符计数
messageInput.addEventListener('input', () => {
  const length = messageInput.value.length;
  charCount.textContent = length;

  if (length > 200) {
    charCount.style.color = '#f44336';
  } else {
    charCount.style.color = '#999';
  }
});

// 提交留言
submitBtn.addEventListener('click', async () => {
  const message = messageInput.value.trim();

  // 验证留言
  if (!message) {
    showMessage('请输入留言内容', 'error');
    return;
  }

  if (message.length > 200) {
    showMessage('留言不能超过200字', 'error');
    return;
  }

  // 验证是否包含英文或代码
  if (/[a-zA-Z]/.test(message)) {
    showMessage('留言不允许包含英文字符', 'error');
    return;
  }

  // 检测常见代码符号
  const codePatterns = /[<>{}[\]();=+\-*/%&|^~`$#@!\\]/;
  if (codePatterns.test(message)) {
    showMessage('留言不允许包含代码或特殊符号', 'error');
    return;
  }

  // 禁用按钮防止重复提交
  submitBtn.disabled = true;
  submitBtn.textContent = '提交中...';

  try {
    const response = await fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();

    if (response.ok) {
      showMessage('留言提交成功！', 'success');
      messageInput.value = '';
      charCount.textContent = '0';
      loadMessageCount();
    } else {
      showMessage(data.error || '提交失败，请重试', 'error');
    }
  } catch (error) {
    showMessage('网络错误，请稍后重试', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = '提交留言';
  }
});

// 显示提示消息
function showMessage(text, type) {
  submitMessage.textContent = text;
  submitMessage.className = `submit-message ${type}`;

  setTimeout(() => {
    submitMessage.className = 'submit-message';
  }, 3000);
}

// 加载留言数量
async function loadMessageCount() {
  try {
    const response = await fetch('/api/messages/count');
    const data = await response.json();

    if (response.ok) {
      messageCount.textContent = data.count;
    }
  } catch (error) {
    console.error('加载留言数量失败:', error);
  }
}

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// 页面加载时获取留言数量
loadMessageCount();