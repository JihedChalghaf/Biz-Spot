import { PopoverComponent } from "./../popover/popover.component";
import { BusinessService } from "./../services/business.service";
import { Component, OnInit } from "@angular/core";
import { Business } from "../models/business";
import { Observable } from "rxjs";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { LoadingController } from "@ionic/angular";
import { PopoverController } from "@ionic/angular";

@Component({
  selector: "app-category",
  templateUrl: "./category.page.html",
  styleUrls: ["./category.page.scss"]
})
export class CategoryPage implements OnInit {
  allBiz: Business[] = [];
  items: Business[] = [];
  categories: any[] = [];
  Arr = Array; // Array type captured in a variable
  filters: any[] = [];
  selected: boolean = false;
  isFiltred: boolean = false;

  searchField: string = "";
  category: string = "";

  constructor(
    private bizService: BusinessService,
    private router: Router,
    public loadingController: LoadingController,
    private activatedRoute: ActivatedRoute,
    public popoverController: PopoverController
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.category = params["ref"];
    });

    this.bizService
      .getAllBusinessByCategory(this.category)
      .subscribe(allItems => {
        this.items = allItems.filter(biz => {
          return biz.category.name
            .toLowerCase()
            .includes(this.category.toLowerCase().slice(0, 4));
        });
        this.allBiz = this.items = allItems.filter(biz => {
          return biz.category.name
            .toLowerCase()
            .includes(this.category.toLowerCase().slice(0, 4));
        });
      });

    this.filters = [
      { label: "Open now", value: false },
      { label: "High price", value: false },
      { label: "Low price", value: false }
    ];
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: ev,
      translucent: true,
      componentProps: { category: this.category }
    });
    return await popover.present();
  }

  ionViewWillEnter() {}

  searchItems() {
    if (this.searchField != "")
      this.items = this.allBiz.filter(item => {
        return (
          item.title.toLowerCase().includes(this.searchField.toLowerCase()) ||
          item.location.toLowerCase().includes(this.searchField.toLowerCase())
        );
      });

    this.isFiltred = this.items.length == 0;
  }

  refresh() {
    this.isFiltred = false;
    this.bizService.refresh().subscribe(allItems => {
      this.items = allItems.filter(biz => {
        return biz.category.name
          .toLowerCase()
          .includes(this.category.toLowerCase());
      });
      this.allBiz = this.items = allItems.filter(biz => {
        return biz.category.name
          .toLowerCase()
          .includes(this.category.toLowerCase().slice(0, 4));
      });
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
}
