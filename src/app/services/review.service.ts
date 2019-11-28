import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { Review } from '../models/review';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private reviews: Observable<Review[]>;
  private reviewsCollection: AngularFirestoreCollection<Review>;
  private componentMethodCallSource = new Subject<any>();
  public componentMethodCalled$ = this.componentMethodCallSource.asObservable();

  constructor(private afs: AngularFirestore) {
    this.reviewsCollection = this.afs.collection<Review>("reviews");
  }

  addReview(review: Review): Promise<DocumentReference> {
    return this.reviewsCollection.add(review);
  }

  callForRefresh() {
    this.componentMethodCallSource.next();
  }
}
