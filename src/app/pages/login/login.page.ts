import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { LoadingController } from "@ionic/angular";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"]
})
export class LoginPage implements OnInit {
  constructor(
    private authService: AuthService,
    public loadingController: LoadingController
  ) {}

  email: string = "";
  password: string = "";

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

  ngOnInit() {}
}
