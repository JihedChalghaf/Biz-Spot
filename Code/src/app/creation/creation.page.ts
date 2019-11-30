import { Observable } from "rxjs";
import { BusinessService } from "./../services/business.service";
import { AuthService } from "./../services/auth.service";
import { Category } from "./../models/category";
import { Router } from "@angular/router";
import { Platform } from "@ionic/angular";
import { Component, OnInit } from "@angular/core";
import { AlertController } from "@ionic/angular";
import { ToastController } from "@ionic/angular";
import { LoadingController } from "@ionic/angular";
import { Camera, CameraOptions } from "@ionic-native/Camera/ngx";
import { File } from "@ionic-native/file/ngx";
import { ActionSheetController } from "@ionic/angular";
import { Business } from "../models/business";
import {
  AngularFireStorage,
  AngularFireUploadTask
} from "@angular/fire/storage";
import { finalize, tap } from "rxjs/operators";

import Swal from "sweetalert2";

@Component({
  selector: "app-creation",
  templateUrl: "./creation.page.html",
  styleUrls: ["./creation.page.scss"]
})
export class CreationPage implements OnInit {
  mBiz: Business;

  inputList: any[];
  automaticClose: boolean = false;
  imageThumbnail: string;
  croppedImagepath = "";
  isLoading = false;
  imagePickerOptions = {
    maximumImagesCount: 1,
    quality: 50
  };
  location: any = {};

  /* image upload */
  task: AngularFireUploadTask;

  // Progress in percentage
  percentage: Observable<number>;

  // Snapshot of uploading file
  snapshot: Observable<any>;

  // Uploaded File URL
  UploadedFileURL: Observable<string>;

  //Uploaded Image List
  images: Observable<Business[]>;

  //File details
  fileName: string;
  fileSize: number;

  //Status check
  isUploading: boolean;
  isUploaded: boolean;

  constructor(
    public alertController: AlertController,
    public loadingController: LoadingController,
    public toastController: ToastController,
    private camera: Camera,
    public actionSheetController: ActionSheetController,
    private file: File,
    private router: Router,
    private authService: AuthService,
    private bizService: BusinessService,
    private storage: AngularFireStorage,
    private platform: Platform
  ) {
    this.imageThumbnail = "";
    this.inputList = [
      {
        field: "General",
        open: false,
        children: [
          {
            field: "Location",
            open: true
          },
          {
            field: "Category",
            open: true
          },
          {
            field: "Contact",
            open: true
          }
        ]
      },
      {
        field: "Highlight",
        open: false,
        children: [
          {
            field: "Availability",
            open: true
          },
          {
            field: "Tags",
            open: true
          }
        ]
      },
      {
        field: "Upload Photos",
        open: false,
        children: [
          {
            field: "Cover",
            open: true
          }
          // {
          //   field: "Share Pics / Stories",
          //   open: true
          // }
        ]
      },
      {
        field: "More",
        open: false,
        children: [
          {
            field: "Members",
            open: true
          },
          {
            field: "About",
            open: true
          }
        ]
      }
    ];

    // init Biz
    this.mBiz = {
      title: "",
      type: "Home Services",
      thumbnail: "",
      location: "",
      email: "",
      phone: +216,
      images: [],
      rating: 1,
      owner: "",
      tags: [],
      description: "",
      reviews: [],
      status: "",
      level: "raising",
      members: 1,
      category: {
        name: "",
        subCategory: "",
        ref: ""
      }
    };

    this.location = {
      full: "",
      city: "",
      state: "",
      zip: ""
    };
  }

  ionViewWillEnter() {
    this.presentLoading();
  }

  ngOnInit() {
    // this.presentLoading();

    this.platform.backButton.subscribeWithPriority(999990, () => {
      //alert("back pressed");
      this.router.navigate(["tabs/home"]);
    });
  }

  toggleSection(index) {
    this.inputList[index].open = !this.inputList[index].open;

    if (this.automaticClose && this.inputList[index].open) {
      this.inputList
        .filter((item, itemIndex) => itemIndex != index)
        .map(item => (item.open = false));
    }
  }

  toggleItem(index, childIndex) {
    this.inputList[index].children[childIndex].open = !this.inputList[index]
      .children[childIndex].open;
  }

  // Validate form before submit
  // check if biz name is redandant!!!
  validate() {
    this.authService.getToken().then(userId => {
      console.log(userId);
      this.mBiz.owner = userId;

      this.mBiz.location =
        this.location.full +
        ", " +
        this.location.city +
        " " +
        this.location.zip;
      if (this.mBiz.title == "") {
        this.presentAlertPrompt();
      } else {
        this.bizService.getBusinessByTitle(this.mBiz.title).subscribe(biz => {
          console.log(biz);
          if (biz !== undefined) {
            this.presentAlertPromptError();
          } else {
            let emptyKeys = [];
            let reservedKeys = ["thumbnail", "images", "reviews"];
            for (var key in this.mBiz) {
              if (
                this.mBiz.hasOwnProperty(key) &&
                this.mBiz[key] == "" &&
                !reservedKeys.includes(key)
              ) {
                emptyKeys.push(key);
              }
            }
            if (emptyKeys.length > 0) this.presentToastWithOptions(emptyKeys);
            else {
              console.log(this.mBiz);
              this.presentLoadingLong();
              this.bizService.addBusiness(this.mBiz).then(biz => {
                console.log(biz);
                this.mBiz.id = biz.id;
                //   if (this.imageThumbnail != undefined)
                //     this.uploadFile(this.imageThumbnail);
              });
            }
            // else {
            // }
          }
        });
      }
    });
  }

  async presentToastWithOptions(errors) {
    const toast = await this.toastController.create({
      header: "Error",
      message: "Required: " + errors,
      position: "bottom",
      duration: 5000,
      buttons: [
        {
          side: "end",
          icon: "alert",
          text: "Ok",
          handler: () => {
            console.log("Favorite clicked");
          }
        }
      ]
    });
    toast.present();
  }
  // load prompt -> register biz name
  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      header: "Create first Biz",
      inputs: [
        {
          name: "Title",
          type: "text",
          placeholder: "Brand Name"
        }
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
            console.log("Confirm Cancel");
            this.cancel();
          }
        },
        {
          text: "Ok",
          handler: data => {
            console.log("Confirm Ok");
            this.mBiz.title = data.Title;
          }
        }
      ]
    });

    await alert.present();
  }

  // load prompt -> register biz name
  async presentAlertPromptError() {
    const alert = await this.alertController.create({
      header: "Create first Biz",
      subHeader: "DUPLICATE",
      message: "Try input an other brand.",
      inputs: [
        {
          name: "Title",
          type: "text",
          placeholder: "Brand Name"
        }
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
            console.log("Confirm Cancel");
            this.cancel();
          }
        },
        {
          text: "Ok",
          handler: data => {
            console.log("Confirm Ok");
            this.mBiz.title = data.Title;
          }
        }
      ]
    });

    await alert.present();
  }

  async addTag() {
    const alert = await this.alertController.create({
      header: "Add Biz Tag",
      inputs: [
        {
          name: "tagname",
          type: "text",
          placeholder: "Tag name here.."
        }
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
            console.log("Confirm Cancel");
            this.cancel();
          }
        },
        {
          text: "Ok",
          handler: data => {
            console.log("Confirm Ok");
            console.log(data.tagname);
            this.mBiz.tags.push(data.tagname);
          }
        }
      ]
    });

    await alert.present();
  }

  removeTag(idx) {
    this.mBiz.tags.splice(idx, 1);
  }

  cancel() {
    this.router.navigateByUrl("tabs/home");
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: "Please wait...",
      duration: 1000,
      spinner: "lines-small"
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();

    console.log("Loading dismissed!");
    this.presentAlertPrompt();
  }

  async presentLoadingLong() {
    const loading = await this.loadingController.create({
      message: "Please wait...",
      duration: 2000,
      spinner: "lines-small"
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();

    console.log("Loading dismissed!");
    // this.presentAlertPrompt();
    Swal.fire({
      text: "Your Biz has been created sucessfully",
      icon: "success",
      title: "WOOW!"
    }).then(() => {
      this.router.navigateByUrl("tabs/home");
    });
  }

  pickImage(sourceType) {
    const options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };
    this.camera.getPicture(options).then(
      imageData => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64 (DATA_URL):
        let base64Image = "data:image/jpeg;base64," + imageData;
        this.imageThumbnail = base64Image;
      },
      err => {
        console.log(err);
        // Handle error
      }
    );
  }

  async uploadCover() {
    const actionSheet = await this.actionSheetController.create({
      header: "Select Image source",
      buttons: [
        {
          text: "Load from Library",
          handler: () => {
            this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: "Use Camera",
          handler: () => {
            this.pickImage(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: "Cancel",
          role: "cancel"
        }
      ]
    });
    await actionSheet.present();
  }

  uploadFile(file) {
    // Validation for Images Only
    if (file.type.split("/")[0] !== "image") {
      console.error("unsupported file type :( ");
      return;
    }

    // The storage path
    const path = `freakyStorage/${new Date().getTime()}_${file.name}`;

    // Totally optional metadata
    const customMetadata = { app: "Freaky Image Upload Demo" };

    //File reference
    const fileRef = this.storage.ref(path);

    // The main task
    this.task = this.storage.upload(path, file, { customMetadata });

    // Get file progress percentage
    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges().pipe(
      finalize(() => {
        // Get uploaded file storage path
        this.UploadedFileURL = fileRef.getDownloadURL();

        this.UploadedFileURL.subscribe(
          resp => {
            this.mBiz.thumbnail = resp;
            this.bizService.updateImage(this.mBiz);
            this.isUploading = false;
            this.isUploaded = true;
          },
          error => {
            console.error(error);
          }
        );
      }),
      tap(snap => {
        this.fileSize = snap.totalBytes;
      })
    );
  }
}
