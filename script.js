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
    showMessage('留言不能超过 200 字', 'error');
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

// 平滑滚动 - 只处理有效的锚点链接
document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || href.length <= 1) return;

    e.preventDefault();
    try {
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    } catch (error) {
      console.error('Invalid selector:', href);
    }
  });
});

// 页面加载时获取留言数量
loadMessageCount();

// 下载弹窗
(function() {
  const popup = document.getElementById('dlPopup');
  const closeBtn = document.querySelector('.dl-close');
  const title = document.getElementById('dlTitle');
  const content = document.getElementById('dlContent');
  const winBtn = document.querySelector('[data-platform="windows"]');
  const macBtn = document.querySelector('[data-platform="mac"]');

  const links = {
    win: { url: 'https://pan.baidu.com/s/1c9A83QpTu1o-JZ6ePENvjQ', code: 'scor' },
    macNew: { url: 'https://pan.baidu.com/s/1RLByPLnOOfG5u-wMN8CQlw', code: 'scor' },
    macOld: { url: 'https://pan.baidu.com/s/1zRG7Az9xBovzdsIL30VfLA', code: 'scor' }
  };

  function openPopup() {
    popup.classList.add('show');
  }

  function closePopup() {
    popup.classList.remove('show');
  }

  function showWin() {
    title.textContent = 'Windows 版本下载';
    content.innerHTML = `
      <div class="dl-code-box">
        <div class="dl-code-label">提取码</div>
        <div class="dl-code-value">${links.win.code}</div>
      </div>
      <a href="${links.win.url}" target="_blank" class="dl-link-btn">前往百度网盘下载</a>
    `;
    openPopup();
  }

  function showMac() {
    title.textContent = '选择 Mac 版本';
    content.innerHTML = `
      <div class="dl-code-box">
        <div class="dl-code-label">提取码</div>
        <div class="dl-code-value">${links.macNew.code}</div>
      </div>
      <a href="${links.macNew.url}" target="_blank" class="dl-option">
        <div class="dl-option-icon">💻</div>
        <div class="dl-option-text">
          <div class="dl-option-name">新款 Mac</div>
          <div class="dl-option-desc">适用于较新款的 Mac 系统</div>
        </div>
      </a>
      <a href="${links.macOld.url}" target="_blank" class="dl-option">
        <div class="dl-option-icon">🖥️</div>
        <div class="dl-option-text">
          <div class="dl-option-name">老款 Mac</div>
          <div class="dl-option-desc">适用于较老款的 Mac 系统</div>
        </div>
      </a>
    `;
    openPopup();
  }

  if (winBtn) {
    winBtn.onclick = function(e) {
      e.preventDefault();
      showWin();
    };
  }

  if (macBtn) {
    macBtn.onclick = function(e) {
      e.preventDefault();
      showMac();
    };
  }

  if (closeBtn) {
    closeBtn.onclick = closePopup;
  }

  if (popup) {
    popup.onclick = function(e) {
      if (e.target === popup) closePopup();
    };
  }

  document.onkeydown = function(e) {
    if (e.key === 'Escape' && popup.classList.contains('show')) {
      closePopup();
    }
  };
})();