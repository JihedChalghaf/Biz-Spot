import { Router } from "@angular/router";
import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { IonSlides } from "@ionic/angular";
import { Storage } from "@ionic/storage";

@Component({
  selector: "app-slider",
  templateUrl: "./slider.page.html",
  styleUrls: ["./slider.page.scss"]
})
export class SliderPage implements OnInit {
  @ViewChild(IonSlides, { static: false }) slider: IonSlides;

  slideOpts = {
    initialSlide: 0
    // speed: 400
  };
  constructor(private router: Router, private storage: Storage) {}

  ngOnInit() {}

  next() {
    this.slider.slideNext();
  }
  go() {
    // set a key/value
    this.storage.set("visit", true);
    this.router.navigate(["login"]);
  }
}
