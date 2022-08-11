import { StateModel } from "../models/state.model";
import { Colors, Logger } from "../utils/logger"
import dayjs from "dayjs"

export class StateController {
  private logger = new Logger();
  private stateModel = new StateModel()

  public async getStateByCountryId() {
    try {
      const executionTime = dayjs()

      const data = await this.stateModel.getState();

      return {
        state: true,
        msg: null,
        response: data,
      }

    } catch (error) {
      console.error(error);
      return {
        state: false,
        msg: 'Não foi possível pegar estado',
        response: error,
      }
    }
  }
}
