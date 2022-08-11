import { createPool, Pool } from "mysql";
import { MysqlConnectionInfos } from "./SystemConnectionParse";
import { Colors, Logger, Types } from "../api/utils/logger";

let pool: Pool;

const logger = new Logger();

export const MysqlInitConnection = async () => {

  try {
    pool = createPool({
      connectionLimit: Number(MysqlConnectionInfos.connection.connectionLimit),
      host: MysqlConnectionInfos.connection.host,
      user: MysqlConnectionInfos.connection.user,
      password: MysqlConnectionInfos.connection.password,
      database: MysqlConnectionInfos.connection.database,
      port: Number(MysqlConnectionInfos.connection.port),
      waitForConnections: true,
    })
    if (pool) {
      logger.log({ type: Types.MySql, colorMSG: Colors.Green, msg: "Pool generated successfully" })
    }
  } catch (error) {
    logger.log({ type: Types.MySqlError, colorMSG: Colors.Red, msg: "Pool generation failed" })
    throw new Error(error)
  }

}

export const MysqlExecuteQuery = <T>(query: string, params: string[] | Object): Promise<T> => {

  try {
    if (!pool) throw new Error("MySql Adapter Pool not initialized")

    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          logger.log({ type: Types.MySqlError, colorMSG: Colors.Red, msg: "failed to Get connection from Pool" })
          reject(err)
        } else {
          connection.query(query, params, (err, results) => {
            connection.release()
            if (err) {
              logger.log({ type: Types.MySqlError, colorMSG: Colors.Red, msg: "Failed to Execute Query" })
              reject(err)
            } else {
              resolve(results)
            }
          })
        }
      })
    })

  } catch (error) {
    logger.log({ type: Types.MySqlError, colorMSG: Colors.Red, msg: "Query execution failed" })
  }

}