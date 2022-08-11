import db from "../../config/db";

export class CronJobsModel {
  ;

  public async makeScheduleToEachActiveProfessioanl( args:{ ProfessionalRefId, TotalScheduling, State } ) {
    try {
      const response = await db( 'ProfessionalWorkSchedule' )
      .insert( { ...args } )

      if ( !response ) return [];

      return response;
    } catch(err) {
      console.error(err);
      return [];
    }
  }

  public async getScheduleToEachActiveProfessioanl( args:{ State } ) {
    try {
      const response = await db( 'ProfessionalWorkSchedule' )
      .where( { ...args } )

      if ( !response ) return null;

      return response;

    } catch(err) {
      console.error(err);
      return null;
    }
  }

  public async getProfessionalWorkSchedulingDays( args:{ startDate, endDate, Id } ) {
    try {
      const response = await db( 'ProfessionalWorkSchedulingDays' )
      .where('ProfessionalWorkScheduleRefId', args.Id)
      .whereBetween( 'SchedulingDate', [ args.startDate, args.endDate ] )
      .orderBy( 'SchedulingDate', 'ASC' )


      if ( !response || !Object.keys(response).length ) return null;

      return response;

    } catch(err) {
      console.error(err);
      return null;
    }
  }

  public async makeDateToEachActiveProfessioanl( args:{ dates } ) {
    try {
      const response = await db( 'ProfessionalWorkSchedulingDays' )
      .insert( args.dates )

      if ( !response || !Object.keys(response).length ) return null;

      return response;

    } catch(err) {
      console.error(err);
      return null;
    }
  }

  public async getAllProfessionalWorkSchedulingDays( args:{ State } ) {
    try {
      const response = await db( 'ProfessionalWorkSchedulingDays' )
      .where( {...args} )
      .orderBy( 'SchedulingDate', 'ASC' )


      if ( !response || !Object.keys(response).length ) return null;

      return response;

    } catch(err) {
      console.error(err);
      return null;
    }
  }

  public async getProfessionalWorkSchedulingTimeById( args:{ ProfessionalWorkSchedulingDaysRefId } ) {
    try {
      const response = await db( 'ProfessionalWorkSchedulingTime' )
      .where( { ...args } )

      if ( !response || !Object.keys(response).length ) return null;

      return response;

    } catch(err) {
      console.error(err);
      return null;
    }
  }

  public async makeTimeToEachActiveScheduleDay( args:{ times } ) {
    try {
      const response = await db( 'ProfessionalWorkSchedulingTime' )
      .insert( ...args.times )

      if ( !response || !Object.keys(response).length ) return null;

      return response;

    } catch(err) {
      console.error(err);
      return null;
    }
  }
}
