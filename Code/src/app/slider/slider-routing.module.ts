import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SliderPage } from './slider.page';

const routes: Routes = [
  {
    path: '',
    component: SliderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SliderPageRoutingModule {}
