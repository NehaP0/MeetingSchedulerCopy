import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { registerLicense } from '@syncfusion/ej2-base';


// Registering Syncfusion license key
registerLicense('Ngo9BigBOggjHTQxAR8/V1NAaF5cWWJCf0x0R3xbf1x0ZFRMYVRbQHVPIiBoS35RdURhW3xfc3VdQmReWEZ+');


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
