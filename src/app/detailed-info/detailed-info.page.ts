import { Review } from "./../models/review";
import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  ElementRef
} from "@angular/core";
import { IonContent } from "@ionic/angular";
import { BusinessService } from "../services/business.service";
import { Business } from "../models/business";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { User } from "../models/user";
import { Platform } from "@ionic/angular";
import { ModalController, NavController } from "@ionic/angular";
import { AuthService } from "../services/auth.service";
import { ToastController } from "@ionic/angular";
import { ReviewService } from "../services/review.service";
import { ReviewModalComponent } from "../review-modal/review-modal.component";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  DocumentReference
} from "@angular/fire/firestore";

declare var H: any;

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

  @ViewChild("mapContainer", { static: false }) mapElement: ElementRef;
  @ViewChild(IonContent, { static: false }) content: IonContent;

  platform: any;
  maps: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bizService: BusinessService,
    private firestore: AngularFirestore,
    private modalController: ModalController,
    private authService: AuthService,
    private toastController: ToastController,
    private reviewService: ReviewService,
    private phonePlatform: Platform
  ) {
    this.platform = new H.service.Platform({
      apikey: "OQJoM3HGC-puLm0CKJ_XHx9ftA-yF63O2n6WP0leThY"
    });

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.id = this.router.getCurrentNavigation().extras.state.id;
      }
    });
    this.reviewsSelected = false;

    this.reviewService.componentMethodCalled$.subscribe(() => {
      this.refreshReviews();
    });
  }

  viewMaps() {
    this.maps = true;
    let defaultLayers = this.platform.createDefaultLayers();
    let map = new H.Map(
      this.mapElement.nativeElement,
      defaultLayers.vector.normal.map,
      {
        zoom: 14,
        // center: { lat: 36.8689216, lng: 10.1353403 }
        center: { lat: 36.8454047, lng: 10.1850933 }
      }
    );
  }

  ionViewWillEnter() {
    this.ScrollToTop();

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

    this.phonePlatform.backButton.subscribeWithPriority(999990, () => {
      //alert("back pressed");
      this.router.navigate(["tabs/home"]);
    });
  }

  round(n: number) {
    return Math.round(n);
  }

  refreshRating() {
    let nbRatings = 0,
      sumRatings = 0;
    this.reviews.forEach(r => {
      nbRatings += 1;
      if (r.rating) sumRatings += r.rating;
    });

    if (nbRatings) this.biz.rating = Math.round(sumRatings / nbRatings);
    else this.biz.rating = 0;
  }

  refreshReviews() {
    this.refreshRating();
    this.bizService.updateBusiness(this.biz);

    // automatic review refresh not working
  }

  segmentChanged() {
    this.reviewsSelected = !this.reviewsSelected;
  }

  verifyNumber(rating: number) {
    if (!rating) return 1;
    return rating;
  }

  async presentModal() {
    if (this.connected) {
      const modal = await this.modalController.create({
        component: ReviewModalComponent,
        componentProps: {
          modalCtrl: this.modalController,
          biz: this.biz
        },
        cssClass: "my-custom-modal-css"
      });

      await modal.present();

      const { data } = await modal.onWillDismiss();
      console.log(data);
      this.reviews.push(data);
    } else await this.presentToast("Please sign in to add a review");
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      showCloseButton: true
    });
    toast.present();
  }

  ScrollToTop() {
    this.content.scrollToTop(1);
  }
}
