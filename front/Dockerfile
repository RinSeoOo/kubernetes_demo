FROM ubuntu

RUN apt-get update
RUN apt-get install -y npm
RUN mkdir app

WORKDIR /app
COPY . /app
#RUN ls -al
RUN npm install

EXPOSE 3000
CMD npm start