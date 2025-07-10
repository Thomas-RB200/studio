# Padel Scoreboard - Aplicación Web

Esta es una aplicación web Next.js para gestionar y mostrar marcadores de partidos de pádel.

## Cómo Descargar y Ejecutar Este Proyecto Localmente

Sigue estas instrucciones para descargar el código del proyecto y ejecutarlo en tu propio ordenador o desplegarlo en otro servicio de hosting.

### Paso 1: Descargar el Código

1.  En la interfaz de Firebase Studio, busca el menú principal (normalmente un icono de "hamburguesa" ☰ en la esquina superior izquierda).
2.  Encuentra y selecciona la opción **"Descargar"** o **"Exportar"**. Esto descargará un archivo `.zip` con todos los archivos del proyecto a tu ordenador.
3.  Descomprime el archivo descargado en una carpeta donde quieras trabajar.

### Paso 2: Instalar Prerrequisitos

Para trabajar con este proyecto, necesitas tener [Node.js](https://nodejs.org/) instalado en tu ordenador. Viene con `npm` (Node Package Manager), que es necesario para instalar las dependencias del proyecto.

-   Puedes descargar Node.js desde su sitio web oficial. Se recomienda la versión 18 o más reciente.

### Paso 3: Instalar Dependencias del Proyecto

1.  Abre la terminal o línea de comandos de tu ordenador.
2.  Navega a la carpeta donde descomprimiste los archivos del proyecto. Por ejemplo: `cd ruta/a/tu/carpeta-del-proyecto`
3.  Una vez dentro de la carpeta del proyecto, ejecuta el siguiente comando para instalar todas las librerías y paquetes necesarios listados en `package.json`:

    ```bash
    npm install
    ```

    Esto podría tardar unos minutos en completarse.

### Paso 4: Ejecutar en Modo de Desarrollo (Máquina Local)

Para ejecutar la aplicación en modo de desarrollo en tu máquina local, usa el siguiente comando en tu terminal:

```bash
npm run dev
```

Esto iniciará un servidor local, normalmente en **`http://localhost:3000`**. Puedes abrir esta URL en tu navegador para ver e interactuar con la aplicación. Esta URL solo es accesible en tu ordenador.

### Paso 5: Compilar para Producción

Cuando estés listo para desplegar la aplicación en un servidor web en vivo, primero necesitas crear una "build de producción". Este proceso optimiza el código para rendimiento y velocidad.

Ejecuta este comando en tu terminal:

```bash
npm run build
```

Esto creará una nueva carpeta llamada `.next` en tu directorio de proyecto. Esta carpeta contiene la versión optimizada y lista para producción de tu app.

### Paso 6: Desplegar en un Proveedor de Hosting

Puedes desplegar esta aplicación Next.js en cualquier proveedor de hosting que soporte Node.js. Las opciones más fáciles y recomendadas son plataformas específicamente diseñadas para este tipo de apps, como **Vercel** (creado por los creadores de Next.js) o **Netlify**.

**Pasos Generales para el Despliegue (ej: en Vercel):**

1.  **Sube tu código a un repositorio Git** (como GitHub, GitLab o Bitbucket).
2.  **Regístrate en una cuenta de Vercel** (puedes usar tu cuenta de GitHub).
3.  **Importa tu repositorio Git** a Vercel.
4.  Vercel detectará automáticamente que es un proyecto Next.js. Usará el comando de compilación correcto (`npm run build`) y el directorio de salida (`.next`).
5.  Haz clic en **"Deploy"**. Vercel compilará tu proyecto y te proporcionará una URL pública.

Este proceso te dará una aplicación web completamente funcional y en vivo que puedes compartir con cualquiera.

---

## Credenciales de Demostración

Una lista de cuentas de usuario de demostración con diferentes roles se puede encontrar en el archivo `CREDENTIALS.md`.
