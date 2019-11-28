import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { BusinessService } from "../services/business.service";
import { Business } from "../models/business";
import { Review } from "../models/review";
import { ReviewService } from '../services/review.service';
import { AuthService } from "../services/auth.service";
import { AngularFirestore } from '@angular/fire/firestore';


@Component({
  selector: 'app-review-modal',
  templateUrl: './review-modal.component.html',
  styleUrls: ['./review-modal.component.scss'],
})
export class ReviewModalComponent implements OnInit {
  @Input() modalCtrl: any;
  @Input() biz: Business;
  name: string;
  rate: number;
  comment: string;
  currentMsg: string;
  messages: Map<number, string>;
  newReview: Review;

  constructor(public toastController: ToastController, private bizService: BusinessService,
    private revService: ReviewService, private authService: AuthService, private firestore: AngularFirestore) {
    this.messages = new Map();
    this.messages.set(1, "Mediocre..");
    this.messages.set(2, "Not bad");
    this.messages.set(3, "Acceptable");
    this.messages.set(4, "Very good");
    this.messages.set(5, "Excellent !");
    this.name = "";
    this.currentMsg = "";
  }

  ngOnInit() {
   this.authService.getToken().then(res => {
        this.firestore.collection("users").doc(res).valueChanges()
          .subscribe(data => {
            this.name = data["name"];
          });
      });
    }

  onRateChange(event: any) {
    this.currentMsg = this.messages.get(this.rate);
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      showCloseButton: true,
    });
    toast.present();
  }

  dismissModal() {
    this.modalCtrl.dismiss();
  }

  sendReview() {
    if (!this.rate) { this.presentToast('You need to give a rating!'); }
    else if (!this.comment) { this.presentToast('You need to comment!'); }
    else {
      this.dismissModal();

      this.newReview = {
        'id': 'aa',
        'rating': this.rate,
        'comment': this.comment,
        'owner': this.name
      }
      this.revService.addReview(this.newReview).then(res => {
        this.biz.reviews.push(res.id);
        this.bizService.updateBusiness(this.biz);
      });

      this.presentToast('Review submitted successfully');

      // automatically refresh the reviews
      this.revService.callForRefresh();
    }
  }

}
