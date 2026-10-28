export const environment = {
  production: false,
  // MockAPI
  mockApiUrl: 'https://6ae029e08e42963c8d5eff79.mockapi.io/api',
  endpoints: {
    incidencias: '/incidencias',
    resumen: '/resumen'
  },
  // Cloudinary
  cloudinary: {
    cloudName: 'difyyken',
    uploadPreset: 'quitoalerta_incidencias',
    folder: 'quitoalerta/'
  },
  // Open-Meteo
  openMeteoUrl: 'https://api.open-meteo.com/v1/forecast',
  // Configuración de la app
  app: {
    pageSize: 10, // Registros por página (R3)
    timeoutMs: 10000, // Timeout para peticiones HTTP
    timezone: 'America/Guayaquil'
  }
};