const apiKey = 'sk-verxrwbgvwvrmrxdskdcvpvtrjwabrkryinkykzuuxxkhwro';
const apiUrl = 'https://api.siliconflow.cn/v1/chat/completions';

document.getElementById('chat-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const inputText = document.getElementById('user-input').value;
    const responseOutput = document.getElementById('response-output');
    
    if (!inputText.trim()) {
        alert('请输入对话内容');
        return;
    }

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'Qwen/Qwen2.5-Coder-32B-Instruct',
                messages: [{
                    role: 'user',
                    content: `请分析以下对话内容，并给出有助于建立更深层次亲密关系的回复建议：${inputText}`
                }],
                temperature: 0.7,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            throw new Error(`API请求失败：${response.status}`);
        }

        const data = await response.json();
        const reply = data.choices[0].message.content;
        responseOutput.value = reply;
    } catch (error) {
        console.error('Error:', error);
        responseOutput.value = '请求失败，请稍后重试';
    }
});
