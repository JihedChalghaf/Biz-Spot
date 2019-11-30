import { BusinessService } from "./../services/business.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Business } from "../models/business";
import { Observable } from "rxjs";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { Router, NavigationExtras } from "@angular/router";
import { LoadingController } from "@ionic/angular";
import { ToastController } from "@ionic/angular";
import { IonContent } from "@ionic/angular";
import { Platform } from "@ionic/angular";

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"]
})
export class HomePage implements OnInit {
  allBiz: Business[] = [];
  items: Business[] = [];
  categories: any[] = [];
  Arr = Array; // Array type captured in a variable
  filters: any[] = [];
  selected: boolean = false;
  isFiltred: boolean = false;

  bizField: string = "";
  locationField: string = "";
  @ViewChild(IonContent, { static: false }) content: IonContent;

  constructor(
    private platform: Platform,
    private bizService: BusinessService,
    private router: Router,
    private toastController: ToastController,
    private sanitizer: DomSanitizer,
    public loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.bizService.getAllBusiness().subscribe(allItems => {
      this.items = allItems;
      this.allBiz = allItems;

      this.categories = [
        {
          title: "Restaurants",
          thumbnail_url: "../../assets/img/blueberry.png",
          count: this.allBiz.filter(biz => {
            return biz.category.name.toLowerCase().includes("restaurant");
          }).length
        },
        {
          title: "Home Services",
          thumbnail_url: "../../assets/img/home.jpg",
          count: this.allBiz.filter(biz => {
            return biz.category.name.toLowerCase().includes("home");
          }).length
        },
        {
          title: "Health & Pets",
          thumbnail_url: "../../assets/img/petet.jpg",
          count: this.allBiz.filter(biz => {
            return biz.category.name.toLowerCase().includes("health");
          }).length
        },
        {
          title: "Repairators",
          thumbnail_url: "../../assets/img/repairators.jpg",
          count: this.allBiz.filter(biz => {
            return biz.category.name == "Repairators";
          }).length
        },
        {
          title: "Others",
          thumbnail_url: "../../assets/img/others.jpg",
          count: this.allBiz.filter(biz => {
            return biz.category.name.toLowerCase().includes("others");
          }).length
        }
      ];
    });

    this.filters = [
      { label: "Open now", value: false },
      { label: "High price", value: false },
      { label: "Low price", value: false }
    ];
  }

  ionViewWillEnter() {
    this.platform.backButton.subscribeWithPriority(999990, () => {
      //alert("back pressed");
      navigator["app"].exitApp();
    });
  }

  viewCategories(title) {
    this.router.navigate(["category", title]);
  }

  searchItems() {
    if (this.bizField != "" || this.locationField != "")
      this.items = this.allBiz.filter(item => {
        return (
          item.title.toLowerCase().includes(this.bizField.toLowerCase()) &&
          item.location.toLowerCase().includes(this.locationField.toLowerCase())
        );
      });
    else {
      this.ScrollToTop();
      this.presentToast("On top search by Name | Address");
    }
    this.isFiltred = this.items.length == 0;
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      showCloseButton: true
    });
    toast.present();
  }

  refresh() {
    this.isFiltred = false;
    this.bizService.getAllBusiness();
    this.bizService.refresh().subscribe(allItems => {
      this.items = allItems;
      this.allBiz = allItems;
    });
  }

  filterByTag(index) {
    console.log(this.items);
    this.filters[index].value = !this.filters[index].value;

    // any applied filter
    let appliedFilters = this.filters.filter(filter => {
      return filter.value;
    });

    // then reset
    if (appliedFilters.length <= 1) this.items = this.allBiz; // at least one filter

    let filtred = []; // filtres items
    this.filters.forEach(tag => {
      let items = this.items.filter(biz => {
        return (
          tag.value == true &&
          (biz.tags.includes(tag.label) ||
            (tag.label == "Open now" && biz.status == "Available")) &&
          !filtred.includes(biz)
        );
      });
      items.forEach(item => {
        filtred.push(item);
      });
    });

    this.isFiltred = true;
    // apply filter
    if (filtred.length > 0) this.items = filtred;
  }

  segmentChanged(ev: any) {
    // console.log("Segment changed", ev);
    this.selected = !this.selected;
  }

  round(n: number) {
    return Math.round(n);
  }

  openDetailedInfo(id: string) {
    let navigationExtras: NavigationExtras = {
      state: {
        id: id
      }
    };
    this.router.navigate(["tabs/detailed-info"], navigationExtras);
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: "Please wait...",
      duration: 2000,
      spinner: "lines-small"
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();

    console.log("Loading dismissed!");
    this.refresh();
  }

  ScrollToTop() {
    this.content.scrollToTop(1500);
  }
}
