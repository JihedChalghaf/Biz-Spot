import { PopoverComponent } from "./popover/popover.component";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { FormsModule } from "@angular/forms";
import { IonicModule, IonicRouteStrategy, IonTextarea } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireModule } from "@angular/fire";
import { AngularFireStorageModule } from "@angular/fire/storage";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { environment } from "../environments/environment";
import { ReviewModalComponent } from "../app/review-modal/review-modal.component";
import { IonicStorageModule } from "@ionic/storage";
import { IonicRatingModule } from "ionic4-rating";
import { Camera } from "@ionic-native/Camera/ngx";
import { File } from "@ionic-native/file/ngx";

@NgModule({
  declarations: [AppComponent, PopoverComponent, ReviewModalComponent],
  entryComponents: [PopoverComponent, ReviewModalComponent],
  imports: [
    IonicRatingModule,
    BrowserModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule, // imports firebase/storage only needed for storage features
    FormsModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    File,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
