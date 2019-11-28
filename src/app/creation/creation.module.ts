import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreationPageRoutingModule } from './creation-routing.module';

import { CreationPage } from './creation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreationPageRoutingModule
  ],
  declarations: [CreationPage]
})
export class CreationPageModule {}
