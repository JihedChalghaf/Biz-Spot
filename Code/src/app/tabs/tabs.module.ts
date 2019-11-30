import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";

import { TabsPageRoutingModule } from "./tabs-routing.module";

import { TabsPage } from "./tabs.page";

const routes: Routes = [
  {
    path: "",
    component: TabsPage,
    children: [
      { path: "home", loadChildren: "../home/home.module#HomePageModule" },
      {
        path: "profile",
        loadChildren: "../profile/profile.module#ProfilePageModule"
      },
      {
        path: "create",
        loadChildren: "../creation/creation.module#CreationPageModule"
      },
      {
        path: "detailed-info",
        loadChildren:
          "../detailed-info/detailed-info.module#DetailedInfoPageModule"
      },
      {
        path: "login",
        loadChildren: "../pages/login/login.module#LoginPageModule"
      }
    ]
  },
  { path: "tabs", redirectTo: "/tabs/home", pathMatch: "full" },
  {
    path: "",
    redirectTo: "/tabs/home",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    TabsPageRoutingModule
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
