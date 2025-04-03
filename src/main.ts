import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

import { provideIndexedDb, DBConfig } from 'ngx-indexed-db';

const dbConfig: DBConfig  = {
  name: 'Realtime Innovation',
  version: 1,
  objectStoresMeta: [{
    store: 'employee',
    storeConfig: { keyPath: 'id', autoIncrement: true },
    storeSchema: [
      { name: 'name', keypath: 'name', options: { unique: false } },
      { name: 'role', keypath: 'role', options: { unique: false } },
      { name: 'startDate', keypath: 'startDate', options: { unique: false } },
      { name: 'endDate', keypath: 'endDate', options: { unique: false } }
    ]
  }]
};

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideIndexedDb(dbConfig),
  ],
});
