import { Component, OnInit } from "@angular/core";
import { NavParams } from "@ionic/angular";

@Component({
  selector: "app-popover",
  templateUrl: "./popover.component.html",
  styleUrls: ["./popover.component.scss"]
})
export class PopoverComponent implements OnInit {
  category: string = "";
  subCategories: any;
  constructor(private navParams: NavParams) {}

  ngOnInit() {
    this.category = this.navParams.get("category");
    switch (this.category.toLowerCase()) {
      case "restaurants":
        this.subCategories = [
          {
            title: "Fast Food"
          },
          {
            title: "Pizza"
          },
          {
            title: "Home delivery"
          },
          {
            title: "All"
          }
        ];
        break;
      case "home services":
        this.subCategories = [
          {
            title: "Gardening"
          },
          {
            title: "Dry Cleaning"
          },
          {
            title: "Plumbers"
          },
          {
            title: "Electritions"
          },
          {
            title: "All"
          }
        ];
        break;
      case "health & pets":
        this.subCategories = [
          {
            title: "Vets"
          },
          {
            title: "Spa"
          },
          {
            title: "Dentist"
          },
          {
            title: "Beauty Salons"
          },
          {
            title: "All"
          }
        ];
        break;
      case "repairators":
        this.subCategories = [
          {
            title: "Phone reparators"
          },
          {
            title: "PC reparators"
          },
          {
            title: "All"
          }
        ];
        break;
    }
  }
}
