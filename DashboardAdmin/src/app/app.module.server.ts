import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { provideServerRouting } from '@angular/ssr';
import { AppComponent } from './app.component';
import { serverRoutes } from './app.routes.server';

@NgModule({
  imports: [ServerModule, AppComponent],
  providers: [provideServerRouting(serverRoutes)],
})
export class AppServerModule {}