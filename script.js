const API_KEY = 'sk-verxrwbgvwvrmrxdskdcvpvtrjwabrkryinkykzuuxxkhwro';

async function analyzeText() {
    const inputText = document.getElementById('inputText').value.trim();
    const loading = document.getElementById('loading');
    const resultDiv = document.getElementById('result');
    
    if (!inputText) {
        alert('请输入对话内容');
        return;
    }

    loading.classList.remove('hidden');
    resultDiv.innerHTML = '';

    try {
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
        resultDiv.innerHTML = `<div class="error">错误: ${error.message}</div>`;
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
