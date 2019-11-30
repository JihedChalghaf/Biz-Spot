import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailedInfoPageRoutingModule } from './detailed-info-routing.module';

import { DetailedInfoPage } from './detailed-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailedInfoPageRoutingModule
  ],
  declarations: [DetailedInfoPage]
})
export class DetailedInfoPageModule {}
