import {Injectable} from "@angular/core";
import {IAppState} from "../configure";
import {NgRedux} from "@angular-redux/store";
import {IConfig} from "../reducers/configuration";

@Injectable()
export class ChargerActions {
    static UPDATE_STATE_FROM_CHARGER: string = "UPDATE_STATE_FROM_CHARGER";

    constructor(private ngRedux: NgRedux<IAppState>) {
    }

    get config(): IConfig {
        return this.ngRedux.getState()['config'];
    }

    getHostName(): string {
        return this.config.ipAddress + ":" + this.config.port;
    }

    refreshStateFromCharger(unifiedState) {
        let cellLimit = this.ngRedux.getState().config.cellLimit;
        this.ngRedux.dispatch({
            type: ChargerActions.UPDATE_STATE_FROM_CHARGER,
            payload: unifiedState,
            cellLimit: cellLimit
        });
    }

}