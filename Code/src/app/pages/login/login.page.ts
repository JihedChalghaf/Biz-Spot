import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { LoadingController } from "@ionic/angular";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"]
})
export class LoginPage {
  constructor(
    private authService: AuthService,
    private router: Router,
    public loadingController: LoadingController
  ) {}

  email: string = "";
  password: string = "";

  //login function
  async login() {
    const { email, password } = this;
    this.presentLoading();
    await this.authService.login(email, password);
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: "Please wait...",
      duration: 1000,
      spinner: "lines-small"
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();

    console.log("Loading dismissed!");
  }

  redirectRegister() {
    this.router.navigate(["register"]);
  }

  ignore() {
    this.router.navigate(["tabs/home"]);
  }
}
