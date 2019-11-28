import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreationPage } from './creation.page';

const routes: Routes = [
  {
    path: '',
    component: CreationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreationPageRoutingModule {}
