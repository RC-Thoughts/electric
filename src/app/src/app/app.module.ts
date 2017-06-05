import {BrowserModule} from "@angular/platform-browser";
import {HttpModule} from "@angular/http";
import {APP_INITIALIZER, ErrorHandler, NgModule} from "@angular/core";
import {IonicStorageModule} from "@ionic/storage";
import {IonicErrorHandler, IonicModule, IonicApp} from "ionic-angular";
import {MyApp} from "./app.component";
import {HomePage} from "../pages/home/home";
import {DurationPipe, KeysPipe, ReversePipe} from "../utils/pipes";
import {iChargerService} from "../services/icharger.service";
import {Configuration} from "../services/configuration.service";
import {ConfigPage} from "../pages/config/config";
import {ChannelComponent} from "../components/channel/channel";
import {ChargerStatusComponent} from "../components/charger-status/charger-status";
import {PresetListPage} from "../pages/preset-list/preset-list";
import {PresetPage} from "../pages/preset/preset";
import {PresetChargePage} from "../pages/preset-charge/preset-charge";
import {PresetStoragePage} from "../pages/preset-storage/preset-storage";
import {PresetDischargePage} from "../pages/preset-discharge/preset-discharge";
import {PresetCyclePage} from "../pages/preset-cycle/preset-cycle";
import {DynamicDisable} from "../utils/directives";
import {ChargeOptionsPage} from "../pages/charge-options/charge-options";
import {ConnectionStateComponent} from "../components/connection-state/connection-state";
import {ChannelVoltsComponent} from "../components/channel-volts/channel-volts";
import {ChannelIRComponent} from "../components/channel-volts/channel-ir";
import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";

function configServiceFactory(config: Configuration) {
  return () => config.loadConfiguration();
}

import { CloudSettings, CloudModule } from '@ionic/cloud-angular';

const cloudSettings: CloudSettings = {
  'core': {
    'app_id': 'f944cad8'
  }
};

@NgModule({
  declarations: [
    MyApp,
    ConfigPage,
    HomePage,
    KeysPipe, ReversePipe, DurationPipe,
    DynamicDisable,
    ChannelComponent,
    ChannelVoltsComponent,
    ChannelIRComponent,
    ConnectionStateComponent,
    PresetListPage,
    PresetPage,
    PresetChargePage,
    PresetStoragePage,
    PresetDischargePage,
    PresetCyclePage,
    ChargeOptionsPage,
    ChargerStatusComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    CloudModule.forRoot(cloudSettings),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ConfigPage,
    PresetListPage,
    PresetPage,
    PresetChargePage,
    PresetStoragePage,
    PresetDischargePage,
    PresetCyclePage,
    ChargeOptionsPage,
    ChannelComponent,
    ChannelVoltsComponent,
    ChannelIRComponent,
    ConnectionStateComponent
  ],
  providers: [
    Configuration,
    {
      provide: APP_INITIALIZER,
      useFactory: configServiceFactory,
      deps: [Configuration],
      multi: true
    },
    StatusBar,
    SplashScreen,
    {provide: iChargerService, useClass: iChargerService},
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
}
