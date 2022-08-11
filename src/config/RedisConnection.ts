import { createClient } from 'redis';
import { Logger, Colors, Types } from '../api/utils/logger';
import { RedisConnectionInfos } from './SystemConnectionParse';

const logger = new Logger();

export const createRedisConnection = async () => {
  const client = await createClient( RedisConnectionInfos );
  
  client.on('error', (err) => {
    logger.log({ type: Types.RedisError, colorMSG: Colors.Red, msg: `Connection failed: ${err}` });
  });
  
  client.on('connect', () => {
    logger.log({ type: Types.Redis, colorMSG: Colors.Green, msg: `Connection established` });
  });
  
  await client.connect();

  return await client;
}