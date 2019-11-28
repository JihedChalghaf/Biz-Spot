import { Router } from "@angular/router";
import { Component } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { AngularFirestore } from "@angular/fire/firestore";

@Component({
  selector: "app-profile",
  templateUrl: "profile.page.html",
  styleUrls: ["profile.page.scss"]
})
export class ProfilePage {
  user: any;
  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService,
    private router: Router
  ) {
    this.user = {
      name: "",
      email: "",
      location: ""
    };
  }
  logout() {
    return this.authService.logout();
  }

  ionViewWillEnter() {
    this.authService.getToken().then(res => {
      console.log(res);
      this.firestore
        .collection("users")
        .doc(res)
        .valueChanges()
        .subscribe(data => {
          this.user = data;
        });
    });
  }

  ngOnInit() {}

  openCreation() {
    this.router.navigateByUrl("creation");
  }
}
