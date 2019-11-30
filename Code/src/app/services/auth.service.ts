import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';
import { Platform, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';


const TOKEN_KEY = 'auth-token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authenticationState = new BehaviorSubject(null);

  constructor(private firestore: AngularFirestore, private storage: Storage, private plt: Platform, private afAuth: AngularFireAuth, private router: Router
    , private toastController: ToastController) {
    this.plt.ready().then(() => {
      this.checkToken();
    });
    console.log(this.authenticationState.value);
  }

  //check if token exists
  checkToken() {
    this.storage.get(TOKEN_KEY).then(res => {
      if (res)
        this.authenticationState.next(true);
      else
        this.authenticationState.next(false);
    })
  }

  getToken() {
    return this.storage.get(TOKEN_KEY);
  }

  //register
  async register(email: string, password: string, name: string, location: string) {
    try {
      var res = await this.afAuth.auth.createUserWithEmailAndPassword(email, password);
      if (res) {
        console.log("Successfully registered!");
        this.firestore.doc('users/' + res.user.uid).set({ 'name': name, 'location': location, 'email': email, 'id': res.user.uid, 'photoUrl': "https://firebasestorage.googleapis.com/v0/b/top-biz-c6f07.appspot.com/o/picprofile.png?alt=media&token=ed2b0dad-4b52-4126-9927-be5a6bd435bb" });
        await this.login(email, password);
      }
    } catch (err) {
      console.error(err);
      this.presentToast(err);
    }
  }


  //login
  async login(email: string, password: string) {
    try {
      var res = await this.afAuth.auth.signInWithEmailAndPassword(email, password)
      if (res) {
        console.log("Successfully Logged!");
        this.authenticationState.next(true);
        this.storage.set(TOKEN_KEY, res.user.uid).then(res => { console.log(res) });
        this.router.navigateByUrl('tabs/home');
        this.presentToast("Successfully Logged!");
      }
    } catch (err) {
      console.error(err);
      this.presentToast(err);
    }

  }

  //logout
  logout() {
    return this.storage.remove(TOKEN_KEY).then(() => {
      this.authenticationState.next(false);
    });
  }

  isAuthenticated() {
    return this.authenticationState.value;
  }

  //present toast
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      showCloseButton: true,
    });
    toast.present();
  }


}
