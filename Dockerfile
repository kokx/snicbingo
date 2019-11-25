FROM node:13.1

WORKDIR /usr/src/app
COPY css ./css
COPY js ./js
COPY src ./src
COPY views ./views
COPY bingo_list_2019.txt .
COPY package.json .
COPY yarn.lock .

RUN "yarn"

CMD ["yarn", "start"]
