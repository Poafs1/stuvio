FROM node:12.16.1-alpine3.9
WORKDIR /usr/src/app
COPY package.json ./
RUN yarn install
COPY . .
RUN yarn build
CMD ["yarn", "start"]