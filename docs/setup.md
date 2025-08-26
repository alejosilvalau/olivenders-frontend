# Instrucciones para Ejecutar el Frontend Localmente
## Requisitos Previos

- Backend del proyecto en ejecución
- Node.js y npm instalados
- Cuenta de Cloudinary creada
- Puerto 4200 liberado

## Instalación

1. Clonar el repositorio del proyecto:

```bash
git clone https://github.com/alejosilvalau/olivenders-frontend.git
```

2. Instalar las dependencias:

```bash
npm install
```

## Configuración de variables de entorno

1. Ir a "./src/environments/" y crear un archivo llamado "environment.ts"

2. Copiar el siguiente objeto:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  cloudinary: {
    cloudName: 'dfdasfdasf',
    apiKey: 'fdsafdfsadf',
    uploadPreset: 'ml_default'
  }
};
```
Los valores dentro de la clave **cloudinary** no son válidos. Su propósito es solamente demostrativo

3. Cambiar el valor de **apiUrl** a la url del backend

## Configuración de Cloudinary
1. Crear cuenta de [Cloudinary](https://cloudinary.com/)

2. Obtener las credenciales de la API de Cloudinary a través del [dashboard de claves API](https://cloudinary.com/documentation/developer_onboarding_faq_find_credentials)

3. Actualizar los valores correspondientes dentro de la clave **cloudinary** en el objeto del archivo **environment.ts**

## Ejecutar el Proyecto
1. Iniciar el servidor del Frontend:

```bash
npm run start
```

2. Acceder a la aplicación desde la url `http://localhost:4200`
