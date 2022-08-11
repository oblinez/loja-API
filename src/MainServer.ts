const express = require('express');
import { Routes } from './api/routes';
import { graphqlHTTP } from 'express-graphql';
import { MysqlInitConnection } from './config/MysqlConnector';
import { amqpConnect } from './config/RabbitMQConnection';
import { Logger, Colors, Types } from './api/utils/logger';
import { Server } from 'socket.io';
import { createRedisConnection } from './config/RedisConnection';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { createServer } from 'http';
dayjs.locale('pt-br');

const cors = require('cors');
const app = express();
const routes = new Routes()
const httpServer = createServer(app);
const io = new Server(httpServer);
const logger = new Logger();
app.use(cors());

MysqlInitConnection();
amqpConnect();
createRedisConnection();

const queueName = 'authReceiver';
const port: number = 7410;

app.use('/maxhealthapi', graphqlHTTP({
  schema: routes.getRoutes(),
  graphiql: true
}));

io.on( 'connection', ( socket ) => {
  console.log( 'a user connected' );
  socket.on( 'disconnect', () => {
    console.log( 'user disconnected' );
  });
});

httpServer.listen(port, () => {
  logger.log({ type: Types.Info, colorMSG: Colors.Green, msg: `Server Aberto na URL: http://localhost:${port}/maxhealthapi` })
})