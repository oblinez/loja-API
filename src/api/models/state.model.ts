import dayjs from "dayjs";
import { MysqlQueryHandler, MysqlQueryHandlerType } from "../../config/MysqlQueryHandler";
import { Colors, Logger, Types } from "../utils/logger";


export class StateModel {

  private logger = new Logger();

  public async getState() {
    try {

      const payload = `SELECT nome,sobrenome FROM tabela`;
      const queryStartTime: dayjs.Dayjs = dayjs();
      const data = new MysqlQueryHandler(payload, [], MysqlQueryHandlerType.getAll).execute();
      
      if (!data) {
        throw new Error('Não foi possível pegar estado');
      }

      this.logger.log({ type: Types.Query, colorMSG: Colors.Yellow, msg: `getState has been executed`, executionTime: queryStartTime });
      
      return data;

    } catch(err) {
      console.error(err)
      return [];
    }
  }
}