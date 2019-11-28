import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { AuthenticationGuard } from "./guards/authentication.guard";

const routes: Routes = [
  {
    path: "login",
    loadChildren: "./pages/login/login.module#LoginPageModule"
    //  loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)},
  },
  {
    path: "profile",
    loadChildren: () =>
      import("./profile/profile.module").then(m => m.ProfilePageModule)
  },
  {
    path: "register",
    loadChildren: () =>
      import("./pages/register/register.module").then(m => m.RegisterPageModule)
  },
  {
    path: "home",
    loadChildren: () => import("./home/home.module").then(m => m.HomePageModule)
  },
  {
    path: "detailed-info",
    loadChildren: () =>
      import("./detailed-info/detailed-info.module").then(
        m => m.DetailedInfoPageModule
      )
  },
  {
    path: "tabs",
    loadChildren: "./tabs/tabs.module#TabsPageModule"
  },
  { path: "", redirectTo: "login", pathMatch: "full" },
  {
    path: "category/:ref",
    loadChildren: () =>
      import("./category/category.module").then(m => m.CategoryPageModule)
  },  {
    path: 'creation',
    loadChildren: () => import('./creation/creation.module').then( m => m.CreationPageModule)
  }


  //{ path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
