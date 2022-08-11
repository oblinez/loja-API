const { MySQL, Redis, RabbitMQ } = require('../environment/.env')

const MysqlConnectionInfos = {
  client: MySQL.client,
  connection: { ...MySQL.connection },
};

const RedisConnectionInfos = { 
  ...Redis 
};

const RabbitMQConnectionInfos = {
  ...RabbitMQ
}


export { MysqlConnectionInfos, RedisConnectionInfos, RabbitMQConnectionInfos };
