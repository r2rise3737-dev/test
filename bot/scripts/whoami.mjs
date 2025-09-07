import 'dotenv/config';
const me = await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/getMe`).then(r=>r.json());
console.log('getMe =>', me);
