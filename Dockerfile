FROM node:14
WORKDIR /usr/src/OwlBot
COPY package*.json ./
RUN npm ci --only=production
COPY . .
CMD [ "node", "index.js" ]