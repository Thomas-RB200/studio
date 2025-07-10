# Padel Scoreboard - Aplicación Web

Esta es una aplicación web Next.js para gestionar y mostrar marcadores de partidos de pádel.

## Cómo Descargar y Ejecutar Este Proyecto Localmente

Sigue estas instrucciones para descargar el código del proyecto y ejecutarlo en tu propio ordenador o desplegarlo en otro servicio de hosting.

### Paso 1: Guardar Cambios y Descargar el Código

Para descargar la versión más reciente y completa de tu código, primero debes guardar todos tus cambios.

1.  **Ve al Panel de Control de Código Fuente:**
    *   En la barra de herramientas de la izquierda, haz clic en el icono que parece tres ramas conectadas (🌲). Este es el panel de "Control de código fuente".

2.  **Guarda tus Cambios (Commit):**
    *   En el cuadro de texto que dice "Mensaje", escribe una breve descripción, por ejemplo: `Versión final para descargar`.
    *   Haz clic en el botón azul grande que dice **"✓ Commit"**. Esto es como "guardar" tu progreso en el historial del proyecto.

3.  **Encuentra la Opción de Descarga:**
    *   Después de hacer "Commit", el sistema comenzará a desplegar tu aplicación.
    *   **Mira en la esquina inferior derecha de la ventana.** Aparecerá una notificación con el progreso.
    *   Cuando termine, la notificación te mostrará tu **URL pública**. A menudo, cerca de esa área o en el panel de Control de Código Fuente, aparecerá una opción o un menú (a veces con un icono de tres puntos `...` o un engranaje `⚙️`) con la opción **"Descargar código fuente"** o **"Exportar como .zip"**.

4.  **Descomprime el Archivo:** Una vez descargado, descomprime el archivo `.zip` en una carpeta de tu ordenador.

### Paso 2: Instalar Prerrequisitos

Para trabajar con este proyecto, necesitas tener [Node.js](https://nodejs.org/) instalado. Viene con `npm` (Node Package Manager), que es necesario para instalar las dependencias.

-   Descarga Node.js desde su sitio web oficial (versión 18 o más reciente recomendada).

### Paso 3: Instalar Dependencias del Proyecto

1.  Abre una terminal (o línea de comandos).
2.  Navega a la carpeta donde descomprimiste el proyecto. (Ej: `cd ruta/a/tu/proyecto`)
3.  Ejecuta el siguiente comando para instalar todas las librerías necesarias:
    ```bash
    npm install
    ```

### Paso 4: Ejecutar en Modo de Desarrollo

Para ver la aplicación en tu máquina local, ejecuta:

```bash
npm run dev
```

Esto la iniciará en `http://localhost:3000`.

### Paso 5: Compilar para Producción

Cuando estés listo para desplegarla en un servidor, primero crea una versión optimizada:

```bash
npm run build
```

Esto crea una carpeta `.next` con la versión lista para producción.

### Paso 6: Desplegar en un Proveedor de Hosting

Puedes desplegar esta aplicación en cualquier servicio que soporte Node.js, como **Vercel** o **Netlify**.

**Pasos Generales (ej: Vercel):**
1.  Sube tu código a un repositorio Git (GitHub).
2.  Regístrate en Vercel e importa tu repositorio.
3.  Vercel detectará que es un proyecto Next.js y lo desplegará automáticamente, dándote una URL pública.

---

## Credenciales de Demostración

Una lista de cuentas de usuario de demostración con diferentes roles se puede encontrar en el archivo `CREDENTIALS.md`.
