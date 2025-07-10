# Padel Scoreboard - Aplicación Web

---

### ✅ **Cómo Obtener tu URL Pública (Paso a Paso)**

Para obtener el enlace **público y compartible** de tu aplicación, sigue estos pasos exactos:

1.  **GUARDA TUS CAMBIOS (COMMIT):**
    *   Ve al panel de **"Control de código fuente"** (el icono de las ramas 🌲 en la barra lateral izquierda).
    *   Escribe un mensaje en el cuadro de texto (ej: "Actualizando la app").
    *   Haz clic en el botón azul grande que dice **"✓ Commit"**.

2.  **ESPERA Y OBSERVA LA NOTIFICACIÓN:**
    *   Después de hacer "Commit", el despliegue comenzará **automáticamente**. Suele tardar 1 o 2 minutos.
    *   **Mira en la esquina inferior derecha de la ventana.** Aparecerá una notificación emergente que dirá algo como "Deployment to App Hosting finished".

3.  **ENCUENTRA TU ENLACE:**
    *   La notificación contendrá tu URL pública. Se verá así: `https://tu-proyecto-xxxx.web.app`. ¡Ese es el enlace que puedes compartir!

---

### **Importante: Alojamiento en la Nube vs. Datos Locales**

En esta versión de la aplicación, es crucial entender la diferencia entre dónde vive la aplicación y dónde viven los datos:

*   **Alojamiento en la Nube:** La aplicación (el código) está alojada en **Firebase App Hosting**. Por eso tienes una URL pública.
*   **Datos Locales:** Toda la información (marcadores, usuarios, tema, etc.) se guarda **localmente en tu navegador**, usando `localStorage`.

**¿Qué significa esto?** Para que los overlays y la página pública funcionen y reciban las actualizaciones del árbitro, **deben estar abiertos en el mismo navegador y en el mismo ordenador** donde se está gestionando el partido. La "señal" no viaja por internet de un dispositivo a otro, sino de una pestaña a otra en el mismo navegador.

---

## Credenciales de Demostración

Una lista de cuentas de usuario de demostración con diferentes roles se puede encontrar en el archivo `CREDENTIALS.md`.
