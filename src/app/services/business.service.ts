import { Category } from "./../models/category";
import { Business } from "./../models/business";
import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  DocumentReference
} from "@angular/fire/firestore";
import { map, take } from "rxjs/operators";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class BusinessService {
  private businesss: Observable<Business[]>;
  private categorizedBiz: Observable<Business[]>;
  private businessCollection: AngularFirestoreCollection<Business>;

  constructor(private afs: AngularFirestore) {
    this.businessCollection = this.afs.collection<Business>("business");
    this.businesss = this.businessCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getAllBusiness(): Observable<Business[]> {
    return this.businesss;
  }

  refresh(): Observable<Business[]> {
    this.businessCollection = this.afs.collection<Business>("business");
    this.businesss = this.businessCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
    return this.businesss;
  }

  getBusiness(id: string): Observable<Business> {
    return this.businessCollection
      .doc<Business>(id)
      .valueChanges()
      .pipe(
        take(1),
        map(business => {
          business.id = id;
          return business;
        })
      );
  }

  getBusinessByTitle(title: string): Observable<Business> {
    return this.businessCollection
      .doc<Business>(title)
      .valueChanges()
      .pipe(
        take(1),
        map(business => {
          if (business !== undefined) business.title = title;
          return business;
        })
      );
  }

  getAllBusinessByCategory(Category: string): Observable<Business[]> {
    this.categorizedBiz = this.businessCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
    return this.categorizedBiz;
  }

  addBusiness(business: Business): Promise<DocumentReference> {
    return this.businessCollection.add(business);
  }

  updateBusiness(business: Business): Promise<void> {
    return this.businessCollection.doc(business.id).update({
      title: business.title,
      location: business.location,
      reviews: business.reviews,
      rating: business.rating
    });
  }

  updateImage(business: Business): Promise<void> {
    return this.businessCollection.doc(business.id).update({
      thumbnail: business.thumbnail
    });
  }

  deleteBusiness(id: string): Promise<void> {
    return this.businessCollection.doc(id).delete();
  }
}
