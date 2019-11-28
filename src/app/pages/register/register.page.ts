import { LoadingController } from "@ionic/angular";
import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { ToastController } from "@ionic/angular";

@Component({
  selector: "app-register",
  templateUrl: "./register.page.html",
  styleUrls: ["./register.page.scss"]
})
export class RegisterPage implements OnInit {
  constructor(
    private authService: AuthService,
    public loadingController: LoadingController,

    private toastController: ToastController
  ) {}

  name: string = "";
  location: string = "";
  email: string = "";
  password: string = "";
  cpassword: string = "";

  async register() {
    const { name, location, email, password, cpassword } = this;
    if (password !== cpassword) {
      console.error("passwords don't match");
      await this.presentToast("passwords don't match");
    } else {
      this.presentLoading();
      await this.authService.register(email, password, name, location);
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      showCloseButton: true
    });
    toast.present();
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
