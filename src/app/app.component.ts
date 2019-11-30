import { Component } from "@angular/core";

import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { AuthService } from "./services/auth.service";
import { Router } from "@angular/router";
import { Storage } from "@ionic/storage";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"]
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
    private router: Router,
    private storage: Storage
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString("#161036"); // this.statusBar.styleDefault();
      setTimeout(() => {
        this.splashScreen.hide();
      }, 1000);
    });

    // Or to get a key/value pair
    this.storage.get("visit").then(val => {
      console.log("first visit", val);
      if (val == true) {
        this.authService.authenticationState.subscribe(state => {
          if (state) {
            this.router.navigate(["tabs/home"]);
          }

          if (state == false) {
            this.router.navigate(["login"]);
          }
        });
      } else {
        this.router.navigate(["slider"]);
      }
    });
  }
}
