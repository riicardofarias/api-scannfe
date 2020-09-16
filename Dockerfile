FROM node:lts

LABEL key="Gran Sistemas LTDA"

EXPOSE 8000

WORKDIR /web/api-scannfe

COPY . .

RUN npm install

RUN npm run build

ENTRYPOINT npm run start:prod