FROM node:8.3
RUN mkdir -p /app
WORKDIR /app
COPY package.json /app/
RUN yarn global add pm2@latest --no-progress --non-interactive && yarn --non-interactive --no-progress --pure-lockfile --prod
COPY . /app
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["npm", "start"]
