const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');

const app = express();
const PORT = 3000;

// إعداد Telegram
const BOT_TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN';
const CHAT_ID = 'YOUR_CHAT_ID';

// إعداد المجلدات
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.static('public'));

// استقبال الصورة من المتصفح
app.post('/upload', (req, res) => {
  const { image } = req.body;

  // استخراج بيانات Base64
  const base64Data = image.replace(/^data:image\/png;base64,/, '');
  const filePath = `uploads/image-${Date.now()}.png`;

  // حفظ الصورة محليًا
  fs.writeFileSync(filePath, base64Data, 'base64');

  // إرسال الصورة إلى Telegram
  const formData = new FormData();
  formData.append('chat_id', CHAT_ID);
  formData.append('photo', fs.createReadStream(filePath));

  axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, formData, {
    headers: formData.getHeaders(),
  })
    .then(() => {
      console.log('Image sent to Telegram');
      res.status(200).send('Image uploaded and sent to Telegram');
    })
    .catch(error => {
      console.error('Error sending image to Telegram:', error);
      res.status(500).send('Error uploading image');
    });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
