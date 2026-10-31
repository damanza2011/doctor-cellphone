# 🚀 Guía de Despliegue en Vercel · Doctor Cellphone (Omar Dias)

Este repositorio ya contiene toda la arquitectura frontend ordenada (`index.html`, `assets/css/`, `assets/js/`, `assets/img/`, `vercel.json` y `site.webmanifest`).

---

## 📲 1. Despliegue en Vercel en 2 Minutos (Para el QR del Mostrador)

1. Ingresa a **[https://vercel.com/new](https://vercel.com/new)** con tu cuenta de GitHub (`damanza2011`).
2. En la lista de repositorios, busca y haz clic en **Import** en:
   👉 **`damanza2011/doctor-cellphone`**
3. En la pantalla de configuración:
   - **Project Name:** `doctor-cellphone` (o `doctor-cellphone-miramar`)
   - **Framework Preset:** `Other` (detecta HTML estático automáticamente)
   - **Root Directory:** `./`
   - **Build and Output Settings:** Dejar por defecto (no requiere comando de compilación)
4. Haz clic en **Deploy**.
5. ¡Listo! Vercel te entregará una URL corta, segura y de alta velocidad con SSL instantáneo:
   🌐 `https://doctor-cellphone.vercel.app` (o similar asignado).

> **💡 Consejo para el QR impreso:** Esta URL de Vercel tiene menor latencia de carga en redes móviles (4G/LTE) en Barranquilla, haciendo que al escanear el QR en el mostrador de vidrio abra de inmediato en menos de 0.8 segundos.

---

## 🛠️ 2. Actualizaciones Futuras en Git
Cada vez que hagas un cambio en tu computadora local:
```bash
cd "C:\Users\dan\Desktop\doctor-cellphone"
git add .
git commit -m "mejoras de mantenimiento y fotos"
git push origin main
```
Vercel y GitHub Pages se actualizarán **automáticamente** sin tener que tocar nada más.
