import dayjs from "dayjs"
import { Colors, Logger, Types } from "./logger"

export class Generator {
  constructor(private logger: Logger) {}

  public makePersonalIdCode( { defaultSize = 10 } ) {
    const executionTime = dayjs();

    this.logger.log( { type: Types.Info, colorMSG: Colors.Yellow, msg: `Gerando Codigo Pessoal`, executionTime } )
    let preResult = ''
    let result = ''
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    const numbers = '0123456789'
    const charactersLength = characters.length
    const numbersLength = numbers.length
    const difference = defaultSize - (Math.floor(defaultSize/2))

    for ( let i = 0; i < difference; i++ ) { preResult += numbers.charAt( Math.floor( Math.random() * numbersLength ) ) }
    for ( let i = 0; i < Math.floor(defaultSize/2); i++ ) { preResult += characters.charAt( Math.floor( Math.random() * charactersLength ) ) }
    while ( result.length !== defaultSize ) {
      const index = Math.floor( Math.random() * preResult.length )
      result += preResult.charAt(index)
      preResult = preResult.slice(0,index) + preResult.slice(index+1);
    }
    this.logger.log( {
      type: Types.Info,
      colorMSG: Colors.Yellow,
      msg: `Codigo Pessoal Gerado! ${result}`,
      executionTime: executionTime
    } );
    return result
  }
}
