const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// طلب الوصول إلى الكاميرا
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(error => console.error('Error accessing camera:', error));

// التقاط صورة بعد 5 ثوانٍ
setTimeout(() => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // تحويل الصورة إلى Base64
  const imageData = canvas.toDataURL('image/png');

  // إرسال الصورة إلى الخادم
  fetch('/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ image: imageData }),
  }).then(response => {
    console.log('Image sent to server');
  }).catch(error => console.error('Error sending image:', error));
}, 5000);
