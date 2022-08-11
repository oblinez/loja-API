import * as amqp from 'amqplib/callback_api';
import { ChannelsList } from '../environment/environment';
import { Logger, Colors, Types } from '../api/utils/logger';
import { RabbitMQConnectionInfos } from './SystemConnectionParse';

const logger = new Logger();

export let createdChannel: any;
export let createdConnection: any;

export const amqpConnect = async () => {
  await amqp.connect(RabbitMQConnectionInfos.url, function(error, connection) {  
    if (error) {
      throw error;
    } else {
      logger.log({ type: Types.RabbitMQ, colorMSG: Colors.Green, msg: "Connection established" })
      createdConnection = connection;
      channelCreate({ connection: connection });
    }
  });
}

export const channelCreate = async ( { connection }: { connection: any } ) => {
   
  logger.log({ type: Types.RabbitMQ, colorMSG: Colors.Yellow, msg: `Creating channel${ ChannelsList.length > 1 ? 's': '' }...` })
  await connection.createChannel(function(error, channel) {
    if (error) {
      throw error;
    } else {
      createdChannel = channel;
      ChannelsList.forEach(channelName => {
        channel.assertQueue(channelName, { durable: true });
      });
      if (ChannelsList.length > 1) {
        logger.log({ type: Types.RabbitMQ, colorMSG: Colors.Green, msg: "Channels created successfully" })
      } else {
        logger.log({ type: Types.RabbitMQ, colorMSG: Colors.Green, msg: "Channel created successfully" })
      }
    }
  });
}

export const sendMessage = ( { channel = createdChannel, msg }: { channel: any, msg?: any } ) => {
  channel.sendToQueue(msg.queueName, Buffer.from(msg));
}