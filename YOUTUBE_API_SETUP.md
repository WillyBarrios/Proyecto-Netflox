# Configuración de la API de YouTube

## Pasos para configurar la API Key de YouTube:

### 1. Crear un proyecto en Google Cloud Console
1. Ve a [Google Cloud Console](https://console.developers.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la **YouTube Data API v3**

### 2. Crear credenciales
1. Ve a "Credenciales" en el menú lateral
2. Haz clic en "Crear credenciales" > "Clave de API"
3. Copia la API Key generada

### 3. Configurar la aplicación
1. Abre el archivo `src/App.jsx`
2. Busca la línea: `const API_KEY = 'TU_API_KEY_AQUI'`
3. Reemplaza `'TU_API_KEY_AQUI'` con tu API Key real

### 4. Restricciones de seguridad (Recomendado)
1. En Google Cloud Console, ve a "Credenciales"
2. Haz clic en tu API Key
3. Agrega restricciones:
   - **Restricciones de aplicación**: Referentes HTTP
   - **Restricciones de API**: YouTube Data API v3
   - **Referentes del sitio web**: Agrega tu dominio (ej: `localhost:5173/*` para desarrollo)

## Ejemplo de uso

Una vez configurada la API Key, la aplicación:
- Cargará videos automáticamente al iniciar
- Permitirá buscar videos por palabras clave
- Mostrará un video principal y una grilla de videos relacionados
- Permitirá reproducir videos con react-youtube

## Funcionalidades

- ✅ Búsqueda de videos de YouTube
- ✅ Reproductor de video integrado
- ✅ Interfaz similar a Netflix
- ✅ Diseño responsive
- ✅ Video destacado
- ✅ Grilla de videos

## Comandos útiles

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build
```
