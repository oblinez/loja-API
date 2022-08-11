import { Colors, Logger } from "../../api/utils/logger"
import dayjs, { Dayjs } from "dayjs";
import { ProfessionalModel } from "../../api/models/professional.model"
import { CronJobsModel } from "../models/cronJobs.model"
import minMax from 'dayjs/plugin/minMax'
import { E_DATE_TYPE_, TOTAL_PROFESSIONAL_SCHEDULE_RANGE_IN_MONTH } from "../../environment/environment";

dayjs.extend(minMax)

export class ActuationController {
  private logger = new Logger();
  private professionalModel = new ProfessionalModel()
  private cronJobsModel = new CronJobsModel()

  public queries: {

    preCheckSchedulingJob: () => void
    makeScheduleToProfessionalWithpoutSchedule: ( args:{ professionals } ) => void
    makeDaysToNewProfessionals: ( args:{ scheduleID } ) => void
    makeTimesToNewProfessionals: ( args:{ days } ) => void
    //populateProfessionalScheduling: () => void
    //populateProfessionalDaysScheduling: () => void
    generateData: ( args:{ Id, startDate, endDate } ) => Promise<Dayjs[]>
    //generateScheduleTimes: () => void
    generateTime: ( args:{ Id } ) => Promise<Dayjs[]>


  } = {

    preCheckSchedulingJob: async () => {
      const professionals = await this.professionalModel.queries.getAllProfessionals( { State: 1 } )
      const professionalSchedule = await this.cronJobsModel.getScheduleToEachActiveProfessioanl( { State: 1 } )

      const filteredWithShedule = []
      const filteredNoSchedule = professionals.filter( value => {
        if ( !professionalSchedule.find( element => element.ProfessionalRefId === value.Id ) ) {
          return value;
        }
        filteredWithShedule.push(value)
      })

      if ( !!filteredNoSchedule.length ) {
        await this.queries.makeScheduleToProfessionalWithpoutSchedule( { professionals: await filteredNoSchedule } )
      }
      
    },

    makeScheduleToProfessionalWithpoutSchedule: async ( args:{ professionals } ) => {
      const executionTime = dayjs()
      this.logger.log({ colorMSG: Colors.Yellow, msg: `[${executionTime.format('HH:mm:ss')}] - Start makeScheduleToProfessionalWithpoutSchedule`, executionTime })
      const professionalScheduleId = Promise.all( args.professionals.map( async ( professional ) => {
        const response = await this.cronJobsModel.makeScheduleToEachActiveProfessioanl( { ProfessionalRefId: professional.Id, TotalScheduling: 0, State: 1 } )
        this.logger.log({ colorMSG: Colors.Green, msg: `Agenda criada para o profissional ${professional.FirstName} ${professional.LastName}`, executionTime })
        return {Id: response[0], Professional: professional}
      }))
      if ( await professionalScheduleId ) {
        this.logger.log({ colorMSG: Colors.Yellow, msg: `[${executionTime.format('HH:mm:ss')}] - End makeScheduleToProfessionalWithpoutSchedule`, executionTime })
      }
      this.queries.makeDaysToNewProfessionals( { scheduleID: await professionalScheduleId  } )
    },

    makeDaysToNewProfessionals: async ( args:{ scheduleID } ) => {
      const executionTime = dayjs()
      this.logger.log({ colorMSG: Colors.Yellow, msg: `[${executionTime.format('HH:mm:ss')}] - Start makeDaysToNewProfessionals`, executionTime })
      const days = Promise.all( args.scheduleID.map( async ( schedule ) => {
        const days = await this.queries.generateData( 
          { 
            Id: schedule.Id,
            startDate: dayjs(),
            endDate: dayjs().add(TOTAL_PROFESSIONAL_SCHEDULE_RANGE_IN_MONTH, E_DATE_TYPE_.MONTH).add(1, E_DATE_TYPE_.DAY) 
          }
        )
        //console.log(days)
        const response = await this.cronJobsModel.makeDateToEachActiveProfessioanl( { dates: days } )
        if ( response ) {
          this.logger.log({ colorMSG: Colors.Green, msg: `${days.length} Dias criados para o profissional ${schedule.Professional.FirstName} ${schedule.Professional.LastName}`, executionTime })
        }
        return {Id: response, Quantity: days.length - 1, Professional: schedule.Professional}
      }))

      if ( await days ) {
        this.logger.log({ colorMSG: Colors.Yellow, msg: `[${executionTime.format('HH:mm:ss')}] - End makeDaysToNewProfessionals`, executionTime })
      }

      //console.log("dias", await days)
      this.queries.makeTimesToNewProfessionals( { days: await days } )
    },

    makeTimesToNewProfessionals: async ( args:{ days } ) => {
      const executionTime = dayjs()
      this.logger.log({ colorMSG: Colors.Yellow, msg: `[${executionTime.format('HH:mm:ss')}] - Start makeTimesToNewProfessionals`, executionTime })

      const times = Promise.all( args.days.map( async ( day ) => {
        let start = day.Id[0]
        const quantity = day.Quantity + day.Id[0]
        console.log(quantity)
        const timesToPush = Promise.all( Array.from(Array(quantity).keys()).map( async ( index ) => {
          const response = await this.queries.generateTime( { Id: index } )
          return response
        } ))
        console.log(await timesToPush)
/*         for ( let i = start; i <= quantity; i++ ) {
          timesToPush.push( await this.queries.generateTime( { Id: i } ) )
        } */
        const response = await this.cronJobsModel.makeTimeToEachActiveScheduleDay( { times: timesToPush } )
        if ( response ) {
          this.logger.log({ colorMSG: Colors.Green, msg: `Horários criados para o profissional ${day.Professional.FirstName} ${day.Professional.LastName}`, executionTime })
        }
      }))


    },

    /*     populateProfessionalScheduling: async () => {

      const professionals = await this.professionalModel.queries.getAllProfessionals( { State: 1 } )
      const professionalSchedule = await this.cronJobsModel.getScheduleToEachActiveProfessioanl( { State: 1 } )

      const makeSchedule = Promise.all( professionals.map( async ( value ) => {

        if ( !professionalSchedule ) {
          const result = await this.cronJobsModel.makeScheduleToEachActiveProfessioanl( { ProfessionalRefId: value.Id, TotalScheduling: 0, State: 1 } )
          return `Agenda Gerada Para o Dr. ${ value.FirstName } ${ value.LastName }`
        }

        if ( professionalSchedule || !!Object.keys(professionalSchedule).length ) {
          const found = !!professionalSchedule.find( element => element.ProfessionalRefId === value.Id );
          if ( !found ) {
          const result = await this.cronJobsModel.makeScheduleToEachActiveProfessioanl( { ProfessionalRefId: value.Id, TotalScheduling: 0, State: 1 } )
          return `Agenda Gerada Para o Dr. ${ value.FirstName } ${ value.LastName }`
          }
        }

        return `Dr. ${ value.FirstName } ${ value.LastName } já possui uma agenda`
      }))

      console.log( await makeSchedule )

      this.queries.populateProfessionalDaysScheduling()

    },
    */
    /*     populateProfessionalDaysScheduling: async () => {


      const professionalSchedule = await this.cronJobsModel.getScheduleToEachActiveProfessioanl( { State: 1 } )

      const montage = Promise.all( professionalSchedule.map( async ( value ) => {
        const date = await this.cronJobsModel.getProfessionalWorkSchedulingDays(
          {
            Id: value.Id,
            startDate: dayjs().add(TOTAL_PROFESSIONAL_SCHEDULE_RANGE_IN_MONTH, E_DATE_TYPE_.MONTH).subtract(1, E_DATE_TYPE_.DAY).format('YYYY-MM-DD'),
            endDate: dayjs().add(TOTAL_PROFESSIONAL_SCHEDULE_RANGE_IN_MONTH, E_DATE_TYPE_.MONTH).format('YYYY-MM-DD')
          }
        )
        value.professionalDayRange = date

        return value

      }))

      const response: any = await montage

      const teste = Promise.all( response.map( async ( Mvalue ) => {

        if ( !Mvalue?.professionalDayRange ) {
          const response = await this.queries.generateData( 
            { 
              Id: Mvalue.Id,
              startDate: dayjs(),
              endDate: dayjs().add(TOTAL_PROFESSIONAL_SCHEDULE_RANGE_IN_MONTH, E_DATE_TYPE_.MONTH).add(1, E_DATE_TYPE_.DAY) 
            } )
          await this.cronJobsModel.makeDateToEachActiveProfessioanl( { dates: response } )
          return `Agenda de dias Gerada Para o Id: ${ Mvalue.Id }, ${ response.length } dias adicionado`
        }

        if ( !!Mvalue?.professionalDayRange && (dayjs().add(TOTAL_PROFESSIONAL_SCHEDULE_RANGE_IN_MONTH, E_DATE_TYPE_.MONTH).diff(dayjs( Mvalue.professionalDayRange.slice(-1)[0].SchedulingDate ), E_DATE_TYPE_.DAY)) > 0 ) {
          const lastDate = dayjs( Mvalue.professionalDayRange.slice(-1)[0].SchedulingDate )
          const difference = (dayjs().add(TOTAL_PROFESSIONAL_SCHEDULE_RANGE_IN_MONTH, E_DATE_TYPE_.MONTH).diff(dayjs(lastDate), E_DATE_TYPE_.DAY))

          const response = await this.queries.generateData( { Id: Mvalue.Id, startDate: dayjs(lastDate).add(1, E_DATE_TYPE_.DAY), endDate: dayjs(lastDate).add(difference, E_DATE_TYPE_.DAY).add(1, E_DATE_TYPE_.DAY)} )

          await this.cronJobsModel.makeDateToEachActiveProfessioanl( { dates: response } )

          return `Agenda Id: ${ Mvalue.Id } alterada, adicionado ${ response.length } dia${response.length > 1 ? 's' : ''}`

        }

        return `Agenda Id: ${ Mvalue.Id } não foi alterada`
      }))

      console.log( await teste )

      this.queries.generateScheduleTimes()

    }, */

    /*     generateScheduleTimes: async () => {

      const professionalScheduleDays = await this.cronJobsModel.getAllProfessionalWorkSchedulingDays( { State: 1 } )

      const montage = Promise.all( professionalScheduleDays.map( async ( value ) => {
        const date = await this.cronJobsModel.getProfessionalWorkSchedulingTimeById(
          {
            ProfessionalWorkSchedulingDaysRefId: value.Id,
          }
        )

        value.scheduleTime = date

        return value

      }))

      const response: any = await montage

      

      const teste = Promise.all( response.map( async ( Mvalue ) => {

        if ( !Mvalue?.scheduleTime ) {

          const timeRange = await this.queries.generateTime( {Id: Mvalue.Id, startTime: Mvalue.SchedulingDate, endTime: Mvalue.SchedulingDate} )

          const naketimes = await this.cronJobsModel.makeTimeToEachActiveScheduleDay( { times: timeRange } )

          return `Inserido Horarios Para a data ${dayjs(Mvalue.SchedulingDate).format('DD/MM/YYYY')}`

        }

        return `Nenhum horario inserido na data ${dayjs(Mvalue.SchedulingDate).format('DD/MM/YYYY')}`

      }))

      console.log( await teste)

    }, */

    generateData: async ( args:{ Id, startDate, endDate } ): Promise<Dayjs[]> => {


      let start: Dayjs = dayjs(args.startDate)
      const end: Dayjs = dayjs(args.endDate)
      const fulldate: any[] = []

      while ( dayjs(start).format('DD/MM/YYYY') !== dayjs(end).format('DD/MM/YYYY') ) {
        const montage = { ProfessionalWorkScheduleRefId: args.Id, SchedulingDate: start.format("YYYY-MM-DD"), State: 1 }
        if ( dayjs(start).day() === 0 ) {
          montage.State = 0
        }
        fulldate.push( {...montage} )
        start = start.add(1, E_DATE_TYPE_.DAY)
      }
      return fulldate
    },

    generateTime: async ( args:{ Id } ): Promise<Dayjs[]> => {

      let startTime: Dayjs = dayjs().hour(8).minute(0).second(0)
      const endTime: Dayjs = dayjs().hour(18).minute(0).second(0)
      const rangeTime: any[] = []

      while ( startTime.format('HH:mm:ss') !== endTime.add(30, 'minute').format('HH:mm:ss') ) {
        const montage = { ProfessionalWorkSchedulingDaysRefId: args.Id, SchedulingTime: startTime.format('HH:mm:ss'), SlotState: 1 }
        rangeTime.push( {...montage} )
        startTime = startTime.add(30, 'minute').second(0)
      }

      return rangeTime
    },
  }

  public mutations: {} = {}
}
