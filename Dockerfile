# Use uma imagem mínima do Node.js
FROM node:18-alpine

# Defina o diretório de trabalho
WORKDIR /app

# Copie apenas os arquivos necessários para a instalação
COPY package*.json ./

# Instale as dependências de produção e remova cache de pacotes
RUN npm ci --only=production && npm cache clean --force

# Copie o restante do código
COPY . .

# Exponha a porta da aplicação
EXPOSE 3000

# Defina a variável de ambiente
ENV NODE_ENV=production

# Comando para iniciar a aplicação
CMD ["node", "app.js"]
