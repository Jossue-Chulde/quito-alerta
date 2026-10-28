# QuitoAlerta - Aplicación Móvil de Gestión de Incidencias

QuitoAlerta es una aplicación móvil desarrollada para el Municipio del Distrito Metropolitano de Quito. Su objetivo es optimizar el registro, seguimiento y actualización de problemas de infraestructura urbana (baches, luminarias dañadas, señalización, etc.) directamente desde el campo, reemplazando los métodos tradicionales dispersos por una solución digital centralizada.

## Características Principales

*   **Registro de incidencias en campo:** Captura de tipo, descripción, dirección, sector y prioridad.
*   **Evidencia fotográfica:** Integración con la cámara del dispositivo y subida a la nube.
*   **Geolocalización:** Obtención de coordenadas GPS (con entrada manual de respaldo para baches).
*   **Consulta meteorológica:** Integración con Open-Meteo para alertar sobre condiciones climáticas adversas antes de guardar.
*   **Carga progresiva:** Listado de incidencias con paginación real (scroll infinito).
*   **Seguimiento local:** Marcado de incidencias favoritas guardadas en el dispositivo (sin enviar datos al servidor).
*   **Máquina de estados:** Actualización del estado de la incidencia (pendiente, en proceso, resuelta) con validaciones estrictas.
*   **Recuperación de borradores:** Autoguardado del formulario para evitar pérdida de datos.

## Requisitos Previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:
*   **Node.js** (v18 o superior recomendado)
*   **Ionic CLI** (`npm install -g @ionic/cli`)
*   **Android Studio** (con JDK 17 o 21 y SDK de Android configurado)
*   **Cable USB** y dispositivo Android (o emulador) para pruebas.

## Instalación y Ejecución

Sigue estos pasos para clonar y ejecutar el proyecto localmente:

**1. Clonar el repositorio e instalar dependencias:**
```bash
git clone https://github.com/Jossue-Chulde/quito-alerta.git
cd quito-alerta
npm install
```

**2. Configurar variables de entorno:**
Crea o edita el archivo src/environments/environment.ts y asegúrate de que las URLs apunten a tus servicios (MockAPI y Cloudinary). Nota: Reemplaza los valores entre corchetes con tus credenciales reales.
```
export const environment = {
  production: false,
  mockApiUrl: 'https://[TU_ID].mockapi.io',
  endpoints: {
    incidencias: '/incidencias',
    resumen: '/resumen'
  },
  cloudinary: {
    cloudName: '[TU_CLOUD_NAME]',
    uploadPreset: '[TU_UPLOAD_PRESET_UNSIGNED]'
  },
  openMeteoUrl: 'https://api.open-meteo.com/v1/forecast',
  app: {
    pageSize: 10,
    timeoutMs: 10000,
    timezone: 'America/Guayaquil'
  }
};
```
**3. Ejecutar en el navegador (Web):**
```
ionic serve
```

**4. Compilar y ejecutar en Android:**
```
ionic build
npx cap sync android
npx cap open android
```


## Dependencias principales

El proyecto utiliza el siguiente stack tecnológico:

### Tecnologías Core

- **Ionic Framework:** Desarrollo de la interfaz de usuario multiplataforma.
- **Angular (Standalone Components):** Framework para la construcción de la aplicación mediante componentes independientes.
- **TypeScript:** Lenguaje de programación que proporciona tipado estático.

### Integración nativa

Se utiliza **Capacitor** para acceder a las funcionalidades y al hardware del dispositivo.

| Dependencia | Descripción |
|---|---|
| `@capacitor/camera` | Captura de fotografías desde el dispositivo. |
| `@capacitor/geolocation` | Obtención de coordenadas geográficas mediante GPS. |
| `@capacitor/preferences` | Almacenamiento local de datos, como borradores y seguimiento. |

### Servicios de terceros

| Dependencia | Descripción |
|---|---|
| `@capawesome/capacitor-cloudinary` | Integración para la subida de imágenes a Cloudinary desde la aplicación nativa en Android. |
| `@ionic/pwa-elements` | Compatibilidad con funcionalidades de cámara y otros elementos de Ionic en navegadores web. |

### Utilidades

| Dependencia | Descripción |
|---|---|
| `ionicons` | Biblioteca de iconos para la interfaz de usuario. |
| `rxjs` | Manejo de operaciones asíncronas y flujos de datos reactivos. |


## Justificación de decisiones técnicas

### API de MockAPI (REST)

Se utilizó **MockAPI** para simular el sistema de oficina. Se implementó un endpoint auxiliar `/resumen` para calcular los indicadores de la pantalla de Inicio sin necesidad de descargar todos los registros, respetando la restricción de paginación real (R3).

### Cloudinary para imágenes

Se eligió **Cloudinary** en lugar de almacenar rutas locales, ya que el requisito exige que la fotografía sea accesible desde el detalle incluso después de cerrar la aplicación.

Se utiliza un **Upload Preset en modo Unsigned** para permitir subidas desde el cliente sin exponer claves privadas.

### Almacenamiento local con `@capacitor/preferences`

Se utiliza para el seguimiento de incidencias (R1) y el autoguardado de borradores (R8).

Se eligió sobre `localStorage` web porque permite el almacenamiento persistente de manera nativa en Android, conservando los datos incluso después de cerrar la aplicación.

### Open-Meteo para el clima

Se seleccionó **Open-Meteo** porque es una API meteorológica gratuita, no requiere una API Key y permite realizar consultas mediante coordenadas exactas (latitud y longitud), cumpliendo estrictamente con el requisito R4.

### Manejo de plataformas (Web vs. Android)

Para la subida de fotografías, se implementó una lógica condicional en el `FotoService`:

- **Android:** Se utiliza el plugin nativo de Capacitor, que requiere la ruta del archivo (`path`).
- **Web:** Se utiliza `fetch` con `FormData` y un `Blob` para gestionar la subida de imágenes y evitar problemas de compatibilidad relacionados con CORS y autenticación (error 401).

### Angular Standalone

Se utilizó la arquitectura moderna de **Angular Standalone Components**, sin necesidad de `NgModules`, para simplificar la estructura del proyecto, reducir la complejidad y facilitar la implementación de carga diferida (*lazy loading*) en las páginas.

---
## Estructura del proyecto
```
├── android
│   ├── .gradle
│   │   ├── 8.14.3
│   │   │   ├── checksums
│   │   │   │   └── checksums.lock
│   │   │   ├── executionHistory
│   │   │   │   ├── executionHistory.bin
│   │   │   │   └── executionHistory.lock
│   │   │   ├── expanded
│   │   │   ├── fileChanges
│   │   │   │   └── last-build.bin
│   │   │   ├── fileHashes
│   │   │   │   ├── fileHashes.bin
│   │   │   │   ├── fileHashes.lock
│   │   │   │   └── resourceHashesCache.bin
│   │   │   ├── vcsMetadata
│   │   │   └── gc.properties
│   │   ├── buildOutputCleanup
│   │   │   ├── buildOutputCleanup.lock
│   │   │   ├── cache.properties
│   │   │   └── outputFiles.bin
│   │   ├── vcs-1
│   │   │   └── gc.properties
│   │   ├── config.properties
│   │   └── file-system.probe
│   ├── .kotlin
│   │   └── sessions
│   ├── app
│   │   ├── src
│   │   │   ├── androidTest
│   │   │   │   └── java
│   │   │   │       └── com
│   │   │   │           └── getcapacitor
│   │   │   │               └── myapp
│   │   │   │                   └── ExampleInstrumentedTest.java
│   │   │   ├── main
│   │   │   │   ├── assets
│   │   │   │   │   ├── public
│   │   │   │   │   │   ├── assets
│   │   │   │   │   │   │   ├── icon
│   │   │   │   │   │   │   │   └── favicon.png
│   │   │   │   │   │   │   ├── icons
│   │   │   │   │   │   │   │   ├── icon-128.webp
│   │   │   │   │   │   │   │   ├── icon-192.webp
│   │   │   │   │   │   │   │   ├── icon-256.webp
│   │   │   │   │   │   │   │   ├── icon-48.webp
│   │   │   │   │   │   │   │   ├── icon-512.webp
│   │   │   │   │   │   │   │   ├── icon-72.webp
│   │   │   │   │   │   │   │   └── icon-96.webp
│   │   │   │   │   │   │   └── shapes.svg
│   │   │   │   │   │   ├── 3rdpartylicenses.txt
│   │   │   │   │   │   ├── chunk-1WgjXSTw.js
│   │   │   │   │   │   ├── chunk-2mFqJFUs.js
│   │   │   │   │   │   ├── chunk-4VHVFzP3.js
│   │   │   │   │   │   ├── chunk-7WcvkKlU.js
│   │   │   │   │   │   ├── chunk-BGRf5C-n.js
│   │   │   │   │   │   ├── chunk-BmA5FMpu.js
│   │   │   │   │   │   ├── chunk-BxLMKiQY.js
│   │   │   │   │   │   ├── chunk-BzXtkYQk.js
│   │   │   │   │   │   ├── chunk-C-mjttUa.js
│   │   │   │   │   │   ├── chunk-C5h6fQkB.js
│   │   │   │   │   │   ├── chunk-CABSGZFi.js
│   │   │   │   │   │   ├── chunk-CAkHLrht.js
│   │   │   │   │   │   ├── chunk-CdOvbnEE.js
│   │   │   │   │   │   ├── chunk-Ce4eADs8.js
│   │   │   │   │   │   ├── chunk-CnqbnkaO.js
│   │   │   │   │   │   ├── chunk-Cs2R2eUY.js
│   │   │   │   │   │   ├── chunk-Cy0XFUdL.js
│   │   │   │   │   │   ├── chunk-D7Mjy_pu.js
│   │   │   │   │   │   ├── chunk-D7NonhMV.js
│   │   │   │   │   │   ├── chunk-D9AI81tR.js
│   │   │   │   │   │   ├── chunk-DEQTwfN6.js
│   │   │   │   │   │   ├── chunk-DJeARTq1.js
│   │   │   │   │   │   ├── chunk-DToUWQ27.js
│   │   │   │   │   │   ├── chunk-DbAjk0oh.js
│   │   │   │   │   │   ├── chunk-DiXHfx-P.js
│   │   │   │   │   │   ├── chunk-Dr8wP6Zx.js
│   │   │   │   │   │   ├── chunk-DvoHXr0M.js
│   │   │   │   │   │   ├── chunk-DykMZBm8.js
│   │   │   │   │   │   ├── chunk-KS4AUMYG.js
│   │   │   │   │   │   ├── chunk-PARCQRHM.js
│   │   │   │   │   │   ├── chunk-RjUwRKGB.js
│   │   │   │   │   │   ├── chunk-SWCFGJJZ.js
│   │   │   │   │   │   ├── chunk-Y-BcIFpe.js
│   │   │   │   │   │   ├── chunk-ZzdELAcu.js
│   │   │   │   │   │   ├── chunk-dQh4kIh0.js
│   │   │   │   │   │   ├── chunk-gykdVGAe.js
│   │   │   │   │   │   ├── chunk-iWo7tB_t.js
│   │   │   │   │   │   ├── chunk-uCkKF3Bt.js
│   │   │   │   │   │   ├── chunk-wcJjWAo9.js
│   │   │   │   │   │   ├── cordova.js
│   │   │   │   │   │   ├── cordova_plugins.js
│   │   │   │   │   │   ├── index.html
│   │   │   │   │   │   ├── main-XPJEGOR3.js
│   │   │   │   │   │   └── styles-DO2PTT5A.css
│   │   │   │   │   ├── capacitor.config.json
│   │   │   │   │   └── capacitor.plugins.json
│   │   │   │   ├── java
│   │   │   │   │   └── io
│   │   │   │   │       └── ionic
│   │   │   │   │           └── starter
│   │   │   │   │               └── MainActivity.java
│   │   │   │   ├── res
│   │   │   │   │   ├── drawable
│   │   │   │   │   │   ├── ic_launcher_background.xml
│   │   │   │   │   │   └── splash.png
│   │   │   │   │   ├── drawable-land-hdpi
│   │   │   │   │   │   └── splash.png
│   │   │   │   │   ├── drawable-land-ldpi
│   │   │   │   │   │   └── splash.png
│   │   │   │   │   ├── drawable-land-mdpi
│   │   │   │   │   │   └── splash.png
│   │   │   │   │   ├── drawable-land-night-hdpi
│   │   │   │   │   │   └── splash.png
│   │   │   │   │   ├── drawable-land-night-ldpi
│   │   │   │   │   │   └── splash.png
│   │   │   │   │   ├── drawable-land-night-mdpi
│   │   │   │   │   │   └── splash.png
│   │   │   │   │   ├── drawable-land-night-xhdpi
│   │   │   │   │   │   └── splash.png
│   │   │   │   │   ├── drawable-land-night-xxhdpi
│   │   │   │   │   │   └── splash.png
│   │   │   │   │   ├── drawable-land-night-xxxhdpi
│   │   │   │   │   │   └── splash.png
│   │   │   │   │   ├── drawable-land-xhdpi
│   │   │   │   │   │   └── splash.png
│   │   │   │   │   ├── drawable-land-xxhdpi
│   │   │   │   │   │   └── splash.png
│   │   │   │   │   ├── drawable-land-xxxhdpi
│   │   │   │   │   │   └── splash.png
│   │   │   │   │   ├── drawable-night
│   │   │   │   │   │   └── splash.png
│   │   │   │   │   ├── drawable-port-hdpi
│   │   │   │   │   │   └── splash.png
│   │   │   │   │   ├── drawable-port-ldpi
│   │   │   │   │   │   └── splash.png
│   │   │   │   │   ├── drawable-port-mdpi
│   │   │   │   │   │   └── splash.png
│   │   │   │   │   ├── drawable-port-night-hdpi
│   │   │   │   │   │   └── splash.png
│   │   │   │   │   ├── drawable-port-night-ldpi
│   │   │   │   │   │   └── splash.png
│   │   │   │   │   ├── drawable-port-night-mdpi
│   │   │   │   │   │   └── splash.png
│   │   │   │   │   ├── drawable-port-night-xhdpi
│   │   │   │   │   │   └── splash.png
│   │   │   │   │   ├── drawable-port-night-xxhdpi
│   │   │   │   │   │   └── splash.png
│   │   │   │   │   ├── drawable-port-night-xxxhdpi
│   │   │   │   │   │   └── splash.png
│   │   │   │   │   ├── drawable-port-xhdpi
│   │   │   │   │   │   └── splash.png
│   │   │   │   │   ├── drawable-port-xxhdpi
│   │   │   │   │   │   └── splash.png
│   │   │   │   │   ├── drawable-port-xxxhdpi
│   │   │   │   │   │   └── splash.png
│   │   │   │   │   ├── drawable-v24
│   │   │   │   │   │   └── ic_launcher_foreground.xml
│   │   │   │   │   ├── layout
│   │   │   │   │   │   └── activity_main.xml
│   │   │   │   │   ├── mipmap-anydpi-v26
│   │   │   │   │   │   ├── ic_launcher.xml
│   │   │   │   │   │   └── ic_launcher_round.xml
│   │   │   │   │   ├── mipmap-hdpi
│   │   │   │   │   │   ├── ic_launcher.png
│   │   │   │   │   │   ├── ic_launcher_background.png
│   │   │   │   │   │   ├── ic_launcher_foreground.png
│   │   │   │   │   │   └── ic_launcher_round.png
│   │   │   │   │   ├── mipmap-ldpi
│   │   │   │   │   │   ├── ic_launcher.png
│   │   │   │   │   │   ├── ic_launcher_background.png
│   │   │   │   │   │   ├── ic_launcher_foreground.png
│   │   │   │   │   │   └── ic_launcher_round.png
│   │   │   │   │   ├── mipmap-mdpi
│   │   │   │   │   │   ├── ic_launcher.png
│   │   │   │   │   │   ├── ic_launcher_background.png
│   │   │   │   │   │   ├── ic_launcher_foreground.png
│   │   │   │   │   │   └── ic_launcher_round.png
│   │   │   │   │   ├── mipmap-xhdpi
│   │   │   │   │   │   ├── ic_launcher.png
│   │   │   │   │   │   ├── ic_launcher_background.png
│   │   │   │   │   │   ├── ic_launcher_foreground.png
│   │   │   │   │   │   └── ic_launcher_round.png
│   │   │   │   │   ├── mipmap-xxhdpi
│   │   │   │   │   │   ├── ic_launcher.png
│   │   │   │   │   │   ├── ic_launcher_background.png
│   │   │   │   │   │   ├── ic_launcher_foreground.png
│   │   │   │   │   │   └── ic_launcher_round.png
│   │   │   │   │   ├── mipmap-xxxhdpi
│   │   │   │   │   │   ├── ic_launcher.png
│   │   │   │   │   │   ├── ic_launcher_background.png
│   │   │   │   │   │   ├── ic_launcher_foreground.png
│   │   │   │   │   │   └── ic_launcher_round.png
│   │   │   │   │   ├── values
│   │   │   │   │   │   ├── ic_launcher_background.xml
│   │   │   │   │   │   ├── strings.xml
│   │   │   │   │   │   └── styles.xml
│   │   │   │   │   └── xml
│   │   │   │   │       ├── config.xml
│   │   │   │   │       └── file_paths.xml
│   │   │   │   └── AndroidManifest.xml
│   │   │   └── test
│   │   │       └── java
│   │   │           └── com
│   │   │               └── getcapacitor
│   │   │                   └── myapp
│   │   │                       └── ExampleUnitTest.java
│   │   ├── .gitignore
│   │   ├── build.gradle
│   │   ├── capacitor.build.gradle
│   │   └── proguard-rules.pro
│   ├── capacitor-cordova-android-plugins
│   │   ├── src
│   │   │   └── main
│   │   │       ├── java
│   │   │       │   └── .gitkeep
│   │   │       ├── res
│   │   │       │   └── .gitkeep
│   │   │       └── AndroidManifest.xml
│   │   ├── build.gradle
│   │   └── cordova.variables.gradle
│   ├── gradle
│   │   └── wrapper
│   │       ├── gradle-wrapper.jar
│   │       └── gradle-wrapper.properties
│   ├── .gitignore
│   ├── build.gradle
│   ├── capacitor.settings.gradle
│   ├── gradle.properties
│   ├── gradlew
│   ├── gradlew.bat
│   ├── local.properties
│   ├── settings.gradle
│   └── variables.gradle
├── assets
│   ├── icon-background.png
│   ├── icon-foreground.png
│   ├── icon-only.png
│   ├── splash-dark.png
│   └── splash.png
├── src
│   ├── app
│   │   ├── home
│   │   │   ├── home.page.html
│   │   │   ├── home.page.scss
│   │   │   ├── home.page.spec.ts
│   │   │   └── home.page.ts
│   │   ├── models
│   │   │   ├── borrador.model.ts
│   │   │   ├── clima.model.ts
│   │   │   └── incidencia.model.ts
│   │   ├── pages
│   │   │   ├── detalle
│   │   │   │   ├── detalle.page.html
│   │   │   │   ├── detalle.page.scss
│   │   │   │   ├── detalle.page.spec.ts
│   │   │   │   └── detalle.page.ts
│   │   │   ├── lista
│   │   │   │   ├── lista.page.html
│   │   │   │   ├── lista.page.scss
│   │   │   │   ├── lista.page.spec.ts
│   │   │   │   └── lista.page.ts
│   │   │   ├── registro
│   │   │   │   ├── registro.page.html
│   │   │   │   ├── registro.page.scss
│   │   │   │   ├── registro.page.spec.ts
│   │   │   │   └── registro.page.ts
│   │   │   └── seguimiento
│   │   │       ├── seguimiento.page.html
│   │   │       ├── seguimiento.page.scss
│   │   │       ├── seguimiento.page.spec.ts
│   │   │       └── seguimiento.page.ts
│   │   ├── services
│   │   │   ├── borrador.service.spec.ts
│   │   │   ├── borrador.service.ts
│   │   │   ├── clima.service.spec.ts
│   │   │   ├── clima.service.ts
│   │   │   ├── foto.service.spec.ts
│   │   │   ├── foto.service.ts
│   │   │   ├── incidencia.service.spec.ts
│   │   │   ├── incidencia.service.ts
│   │   │   ├── resumen.service.spec.ts
│   │   │   ├── resumen.service.ts
│   │   │   ├── seguimiento.service.spec.ts
│   │   │   └── seguimiento.service.ts
│   │   ├── tabs
│   │   │   ├── tabs.page.html
│   │   │   ├── tabs.page.scss
│   │   │   ├── tabs.page.spec.ts
│   │   │   └── tabs.page.ts
│   │   ├── app.component.html
│   │   ├── app.component.scss
│   │   ├── app.component.spec.ts
│   │   ├── app.component.ts
│   │   └── app.routes.ts
│   ├── assets
│   │   ├── icon
│   │   │   └── favicon.png
│   │   ├── icons
│   │   │   ├── icon-128.webp
│   │   │   ├── icon-192.webp
│   │   │   ├── icon-256.webp
│   │   │   ├── icon-48.webp
│   │   │   ├── icon-512.webp
│   │   │   ├── icon-72.webp
│   │   │   └── icon-96.webp
│   │   └── shapes.svg
│   ├── environments
│   │   ├── environment.prod.ts
│   │   └── environment.ts
│   ├── theme
│   │   └── variables.scss
│   ├── global.scss
│   ├── index.html
│   ├── main.ts
│   ├── manifest.webmanifest
│   └── test-setup.ts
├── .browserslistrc
├── .editorconfig
├── .gitignore
├── angular.json
├── capacitor.config.ts
├── eslint.config.js
├── ionic.config.json
├── package-lock.json
├── package.json
├── tsconfig.app.json
├── tsconfig.json
└── tsconfig.spec.json
```
