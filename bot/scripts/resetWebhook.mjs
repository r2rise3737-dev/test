import 'dotenv/config';
const token = process.env.BOT_TOKEN;
if (!token) throw new Error('BOT_TOKEN missing');
const api = m => fetch(`https://api.telegram.org/bot${token}/${m}`, { method:'POST' }).then(r=>r.json());
console.log('deleteWebhook =>', await api('deleteWebhook'));
console.log('getWebhookInfo =>', await api('getWebhookInfo'));
