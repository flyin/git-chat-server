FROM node:8

RUN mkdir -p /app
WORKDIR /app
COPY package.json /app/
RUN yarn global add pm2@latest --no-progress --non-interactive && yarn --no-progress --non-interactive --prod
COPY . /app
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["npm", "start"]
