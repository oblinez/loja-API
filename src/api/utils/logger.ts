import dayjs, { Dayjs } from "dayjs"

export enum Colors {
  Red = '\u001b[31m',
  Yellow = '\u001b[33m',
  Green = '\u001b[32m',
  White = '\u001b[37m',
  Reset = '\u001b[0m'
}

export enum Types {
  Query = 'Query',
  Mutation = 'Mutation',
  Info = 'Info',
  Error = 'Error',
  RabbitMQ = 'RabbitMQ',
  MySql = 'MySql',
  MySqlError = 'MySqlError',
  RedisError = 'RedisError',
  Redis = 'Redis',
}

export class Logger {
  public log({ type, colorMSG, msg, executionTime }: { type: Types, colorMSG: Colors, msg: string, executionTime?: Dayjs }) {
    const actualtime = dayjs()
    const formatedMsg = this._queryTypes({ type, msg })

    let _console = ( { colorMS, time } ) => {
      console.log(`|| ${ Colors.Green }${ dayjs().format('DD/MM/YYYY HH:mm:ss A') }${ Colors.Reset } || ${ colorMSG }${ formatedMsg }${ Colors.Reset }${ time ? `${ colorMS }${ time }Ms${Colors.Reset}`:``} `)
    }

    let _time = () => {
      if (!executionTime) return false;
      return dayjs( actualtime ).diff(executionTime)
    }

    if ( _time() <= 200 ) {
      _console({ colorMS: Colors.Green, time: _time() })
      return
    }

    if ( _time() >= 200 && _time() <= 500 ) {
      _console( { colorMS: Colors.Yellow, time: _time() } )
      return
    }

    _console( { colorMS: Colors.Red, time: _time() } )
    return
  }

  private _queryTypes = ( { type, msg } : { type: Types, msg: string } ): string => {
    switch (type) {
      case Types.Query:
        return `${Types.Query}: ${msg} | In `
      case Types.Mutation:
        return `${Types.Mutation}: ${msg} | In `
      case Types.Info:
        return `${Types.Info}: ${msg}`
      case Types.Error:
        return `${Types.Error}: ${msg}`
      case Types.RabbitMQ:
        return `${Types.RabbitMQ}: ${msg}`
      case Types.MySql:
        return `${Types.MySql}: ${msg}`
      case Types.MySqlError:
        return `${Types.MySqlError}: ${msg}`
      case Types.RedisError:
        return `${Types.RedisError}: ${msg}`
      case Types.Redis:
        return `${Types.Redis}: ${msg}`
      default:
        return ``
    }
  }
}
