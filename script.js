// 请替换为你的API密钥
const API_KEY = 'sk-verxrwbgvwvrmrxdskdcvpvtrjwabrkryinkykzuuxxkhwro';

// 初始化事件监听
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('analyzeBtn').addEventListener('click', analyzeText);
});

async function analyzeText() {
    const input = document.getElementById('inputText').value.trim();
    if (!input) {
        alert('请输入对话内容');
        return;
    }
    const inputText = document.getElementById('inputText').value.trim();
    const loading = document.getElementById('loading');
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = ''; // 清空之前的结果
    
    if (!inputText) {
        showError('请输入对话内容');
        return;
    }

    showLoading();

    try {
        // 直接调用硅基流动API
        const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "deepseek-ai/DeepSeek-V3",
                messages: [{
                    role: "user",
                    content: `请分析以下对话内容，给出能帮助建立更深层次亲密关系的回复建议。要求：\n1. 体现深度共情\n2. 包含开放式问题\n3. 建议具体可操作\n4. 语言自然口语化\n\n对话内容：${inputText}`
                }],
                temperature: 0.7,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            throw new Error(`API请求失败: ${response.status}`);
        }

        const data = await response.json();
        const reply = data.choices[0].message.content;
        
        // 创建带复制按钮的结果框
        const resultBox = document.createElement('div');
        resultBox.innerHTML = `
            <button class="copy-btn" onclick="copyToClipboard(this)">复制</button>
            <div class="content">${reply}</div>
        `;
        resultDiv.appendChild(resultBox);
        
    } catch (error) {
        let errorMessage = '分析失败：';
        
        // 错误分类处理
        if (error.message.includes('Failed to fetch')) {
            errorMessage += '网络连接失败，请检查网络设置';
        } else if (error.message.includes('401')) {
            errorMessage += 'API密钥无效，请检查密钥配置';
        } else if (error.message.includes('429')) {
            errorMessage += '请求过于频繁，请稍后再试';
        } else {
            errorMessage += `系统错误：${error.message}`;
        }
        
        showError(errorMessage);
    } finally {
        loading.classList.add('hidden');
    }
}

function copyToClipboard(button) {
    const content = button.nextElementSibling.textContent;
    navigator.clipboard.writeText(content).then(() => {
        button.textContent = '已复制!';
        setTimeout(() => button.textContent = '复制', 2000);
    });
}

// 显示错误信息
function showError(message) {
    const errorBox = document.createElement('div');
    errorBox.className = 'error-alert';
    errorBox.innerHTML = `
        ⚠️ ${message}
        <span class="close-btn" onclick="this.parentElement.remove()">&times;</span>
    `;
    document.body.prepend(errorBox);
    setTimeout(() => errorBox.remove(), 5000);
}

// 显示加载状态
function showLoading() {
    const loading = document.getElementById('loading');
    loading.classList.remove('hidden');
    // 添加加载动画
    loading.innerHTML = `
        <div class="spinner"></div>
        <div>深度分析中...（约需10-20秒）</div>
    `;
}

// 隐藏加载状态
function hideLoading() {
    const loading = document.getElementById('loading');
    loading.classList.add('hidden');
    loading.innerHTML = '分析中...（约需10-20秒）'; // 重置原始内容
}
