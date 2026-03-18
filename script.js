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

// 下载弹框逻辑
const downloadModal = document.getElementById('downloadModal');
const modalClose = document.querySelector('.modal-close');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const windowsBtn = document.querySelector('.btn-download[data-platform="windows"]');
const macBtn = document.querySelector('.btn-download[data-platform="mac"]');

// 下载链接配置
const DOWNLOAD_CONFIG = {
  windows: {
    url: 'https://pan.baidu.com/s/1c9A83QpTu1o-JZ6ePENvjQ',
    code: 'scor',
    title: 'Windows 版本下载'
  },
  macNew: {
    url: 'https://pan.baidu.com/s/1RLByPLnOOfG5u-wMN8CQlw',
    code: 'scor',
    title: '新款 Mac 下载',
    desc: '适用于较新款的 Mac 系统'
  },
  macOld: {
    url: 'https://pan.baidu.com/s/1zRG7Az9xBovzdsIL30VfLA',
    code: 'scor',
    title: '老款 Mac 下载',
    desc: '适用于较老款的 Mac 系统'
  }
};

// 显示 Windows 下载弹框
function showWindowsModal() {
  const config = DOWNLOAD_CONFIG.windows;
  modalTitle.textContent = config.title;
  modalBody.innerHTML = `
    <div class="extract-code">
      <span class="extract-code-label">提取码：</span>
      <span class="extract-code-value">${config.code}</span>
    </div>
    <a href="${config.url}" target="_blank" class="download-btn">前往百度网盘下载</a>
  `;
  downloadModal.classList.add('active');
}

// 显示 Mac 版本选择弹框
function showMacModal() {
  modalTitle.textContent = '选择 Mac 版本';
  modalBody.innerHTML = `
    <div class="extract-code" style="margin-bottom: 20px;">
      <span class="extract-code-label">提取码：</span>
      <span class="extract-code-value">scor</span>
    </div>
    <div class="modal-options">
      <a href="${DOWNLOAD_CONFIG.macNew.url}" target="_blank" class="modal-option-btn">
        <div class="option-icon">💻</div>
        <div class="option-text">
          <div class="option-name">新款 Mac</div>
          <div class="option-desc">适用于较新款的 Mac 系统</div>
        </div>
      </a>
      <a href="${DOWNLOAD_CONFIG.macOld.url}" target="_blank" class="modal-option-btn">
        <div class="option-icon">🖥️</div>
        <div class="option-text">
          <div class="option-name">老款 Mac</div>
          <div class="option-desc">适用于较老款的 Mac 系统</div>
        </div>
      </a>
    </div>
  `;
  downloadModal.classList.add('active');
}

// 点击 Windows 版本按钮
windowsBtn.addEventListener('click', (e) => {
  e.preventDefault();
  showWindowsModal();
});

// 点击 Mac 版本按钮，弹出选择弹框
macBtn.addEventListener('click', (e) => {
  e.preventDefault();
  showMacModal();
});

// 点击关闭按钮
modalClose.addEventListener('click', () => {
  downloadModal.classList.remove('active');
});

// 点击弹框外部关闭
downloadModal.addEventListener('click', (e) => {
  if (e.target === downloadModal) {
    downloadModal.classList.remove('active');
  }
});

// ESC 键关闭弹框
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && downloadModal.classList.contains('active')) {
    downloadModal.classList.remove('active');
  }
});
