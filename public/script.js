async function downloadVideo() {
  const url = document.getElementById('url').value;
  const format = document.getElementById('format').value;
  const status = document.getElementById('status');

  if (!url) {
    status.textContent = 'أدخل رابط الفيديو';
    return;
  }

  status.textContent = 'جاري التحميل...';

  try {
    const res = await fetch('/api/download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, format }),
    });

    if (!res.ok) {
      status.textContent = 'حدث خطأ في التحميل';
      return;
    }

    const blob = await res.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `video.${format}`;
    a.click();
    status.textContent = 'تم التحميل';
  } catch (err) {
    status.textContent = 'خطأ في الاتصال بالخادم';
  }
}