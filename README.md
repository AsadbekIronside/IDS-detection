# Real vaqtda Suqilib Kirishni Aniqlash Veb-Ilovasi

**Loyiha III**  
**Nguyễn Việt Hoàng - 20194434**

## Loyihaga doir

- Ushbu loyiha real vaqtda ishlovchi, mashina o‘rganish asosidagi suqilib kirishni aniqlash tizimini (IDS) yaratishdan iborat.

- Quyidagi yondashuvlardan foydalanilgan:
    - **Nazoratli o‘rganish (Supervised learning – Random Forest)** – CICIDS 2018 va SCVIC-APT datasetlaridan foydalanib ma’lum hujumlarni aniqlash.
    - **Nazoratsiz o‘rganish (Unsupervised learning – AutoEncoder)** – noma’lum g‘ayritabiiy xatti-harakatlarni aniqlash.

- Tizim tuzilmasi:

  ![diagram](https://github.com/AsadbekIronside/IDS-detection/blob/master/static/images/dashboard.png)

## Talablar

1. **Windows operatsion tizimi**

2. **Python 3.9**  
   Yuklab olish havolalari:
    - [64-bit versiyasi](https://www.python.org/ftp/python/3.9.13/python-3.9.13-amd64.exe)
    - [32-bit versiyasi](https://www.python.org/ftp/python/3.9.13/python-3.9.13.exe)

   > **Eslatma:** o‘rnatish vaqtida "Add Python 3.9 to PATH" belgilang.

3. **Npcap 1.71**  
   Yuklab olish: [npcap-1.71.exe](https://npcap.com/dist/npcap-1.71.exe)

## O‘rnatish va sozlash

```bash
git clone https://github.com/HoangNV2001/APT_Detection
cd APT_Detection

# Virtual muhit yaratish
python3.9 -m venv venv

# Virtual muhitni faollashtirish
source venv/bin/activate  # Linux/macOS
# yoki
venv\Scripts\activate     # Windows

# Talab qilinadigan kutubxonalarni o‘rnatish
pip install -r requirements.txt
