export const environment = {
  production: true,
  mockApiUrl: 'https://6ae029e08e42963c8d5eff79.mockapi.io/api',
  endpoints: {
    incidencias: '/incidencias',
    resumen: '/resumen'
  },
  cloudinary: {
    cloudName: 'difyyken',
    uploadPreset: 'quitoalerta_incidencias',
    folder: 'quitoalerta/'
  },
  openMeteoUrl: 'https://api.open-meteo.com/v1/forecast',
  app: {
    pageSize: 10,
    timeoutMs: 10000,
    timezone: 'America/Guayaquil'
  }
};