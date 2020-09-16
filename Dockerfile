FROM node:lts
LABEL key="GransistemasLTDA"
EXPOSE 8085
WORKDIR /web/financasQR
COPY . .
RUN npm install
RUN npm run build
ENTRYPOINT npm run start:prod