export const environment = {
  production: false,
  // MockAPI
  mockApiUrl: 'https://6ae1d8f3bbb5412922993ed3.mockapi.io',
  endpoints: {
    incidencias: '/incidencias',
    resumen: '/resumen'
  },

  // Cloudinary
  cloudinary: {
    cloudName: 'dilfypkan', 
    uploadPreset: 'quitoalerta_incidencias', 
    folder: 'quitoalerta/'
  },
  
  // Open-Meteo
  openMeteoUrl: 'https://api.open-meteo.com/v1/forecast',
  
  // Configuración de la app
  app: {
    pageSize: 10,
    timeoutMs: 10000,
    timezone: 'America/Guayaquil'
  }
};