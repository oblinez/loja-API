import { MysqlExecuteQuery } from "./MysqlConnector";

export enum MysqlQueryHandlerType {
  getFirst,
  getAll,
}

export class MysqlQueryHandler {

  constructor( public payload?: string, public params?: string[] | Object, public queryType?: MysqlQueryHandlerType, public routeName?: string ) { }

  public execute = async (): Promise<any> => {
    if ( this.queryType === MysqlQueryHandlerType.getFirst ) {
      const response = await this.executeQuery();
      return await {...response[0]};
    } else {
      const list: any[] = [];
      const response = await this.executeQuery();
      Object.keys(await response).forEach(key => {
        list.push({...response[key]});
      });
      return list;
    }
  }

  private executeQuery = async (): Promise<any> => {
    return await MysqlExecuteQuery(this.payload, this.params);
  }
}