import { Review } from "./../models/review";
import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { BusinessService } from "../services/business.service";
import { Business } from "../models/business";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { User } from "../models/user";
import { ModalController, NavController } from '@ionic/angular';
import { AuthService } from "../services/auth.service";
import { ToastController } from '@ionic/angular';
import { ReviewService } from '../services/review.service';
import { ReviewModalComponent } from '../review-modal/review-modal.component';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  DocumentReference
} from "@angular/fire/firestore";

@Component({
  selector: "app-detailed-info",
  templateUrl: "./detailed-info.page.html",
  styleUrls: ["./detailed-info.page.scss"]
})
export class DetailedInfoPage {
  Arr = Array; //Array type captured in a variable
  id: string;
  biz: Business;
  owner: User;
  reviews: Review[];
  reviewsSelected: Boolean;
  segment: string;
  connected: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bizService: BusinessService,
    private firestore: AngularFirestore,
    private modalController: ModalController,
    private authService: AuthService,
    private toastController: ToastController,
    private reviewService: ReviewService,
  ) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.id = this.router.getCurrentNavigation().extras.state.id;
      }
    });
    this.reviewsSelected = false;

    this.reviewService.componentMethodCalled$.subscribe(() => { this.refreshReviews(); });
  }


  ionViewWillEnter() {
    this.segment = "description";
    this.authService.authenticationState.subscribe(state => {
      this.connected = state;
    });

    this.reviews = [];
    this.bizService.getBusiness(this.id).subscribe(response => {
      this.biz = response;

      this.firestore
        .collection<User>("users")
        .doc<User>(response.owner)
        .valueChanges()
        .subscribe(data => {
          this.owner = data;
        });

      response.reviews.forEach(review => {
        this.firestore
          .collection<Review>("reviews")
          .doc<Review>(review)
          .valueChanges()
          .subscribe(data => {
            this.reviews.push(data);
          });
      });

    });

  }

  round(n: number) {
    return Math.round(n);
  }

  refreshRating() {
    let nbRatings = 0, sumRatings = 0;
    this.reviews.forEach(r => {
      nbRatings += 1;
      if (r.rating) sumRatings += r.rating;
    });

    if (nbRatings) this.biz.rating = sumRatings / nbRatings;
    else this.biz.rating = 0;
  }

  refreshReviews() {
    this.refreshRating();
    this.bizService.updateBusiness(this.biz);

    // automatic review refresh not working
  }

  segmentChanged() { this.reviewsSelected = !this.reviewsSelected; }

  verifyNumber(rating: number) {
    if (!rating) return 1;
    return rating;
  }

  async presentModal() {
    if (this.connected) {
      const modal = await this.modalController.create({
        component: ReviewModalComponent,
        componentProps: {
          'modalCtrl': this.modalController,
          'biz': this.biz,
        },
        cssClass: 'my-custom-modal-css'
      });
      return await modal.present();
    }
    else
      return await this.presentToast("Please sign in to add a review");
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      showCloseButton: true,
    });
    toast.present();
  }

}
