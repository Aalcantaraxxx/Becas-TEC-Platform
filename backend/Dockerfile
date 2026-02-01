# 1. Usar Node.js
FROM node:18-alpine

# 2. Crear directorio de trabajo
WORKDIR /app

# 3. Copiar dependencias
COPY package*.json ./

# 4. Instalar dependencias
RUN npm install

# 5. Copiar el resto del código
COPY . .

# 6. Exponer el puerto
EXPOSE 3000

# 7. Comando de inicio
CMD ["npm", "start"]