export const environment = {
  production: true,
  mockApiUrl: 'https://6ae1d8f3bbb5412922993ed3.mockapi.io',
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