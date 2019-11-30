import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailedInfoPage } from './detailed-info.page';

const routes: Routes = [
  {
    path: '',
    component: DetailedInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailedInfoPageRoutingModule {}
