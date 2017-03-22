FROM node:7

RUN mkdir -p /app
WORKDIR /app
COPY package.json /app/
RUN npm install pm2@latest -g --quiet && npm install --quiet --only=production
COPY . /app
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["npm", "start"]
