import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './Admin/admin.component';
import { ChangePasswordComponent } from './Admin/pages/admin/change-password/change-password.component';
import { ProfileComponent } from './Admin/pages/admin/profile/profile.component';
import { AddBannerComponent } from './Admin/pages/banner/add/add.component';
import { ViewBannerComponent } from './Admin/pages/banner/view/view.component';
import { AddBlogComponent } from './Admin/pages/blog/add/add.component';
import { ViewBlogComponent } from './Admin/pages/blog/view/view.component';
import { AddCategoryComponent } from './Admin/pages/category/add/add.component';
import { ViewCategoryComponent } from './Admin/pages/category/view/view.component';
import { DashboardComponent } from './Admin/pages/dashboard/dashboard.component';
import { ForgotpasswordComponent } from './Admin/pages/forgotpassword/forgotpassword.component';
import { LoginComponent } from './Admin/pages/login/login.component';
import { AddPageComponent } from './Admin/pages/page/add/add.component';
import { ViewPageComponent } from './Admin/pages/page/view/view.component';
import { AddProductComponent } from './Admin/pages/product/add/add.component';
import { ViewProductComponent } from './Admin/pages/product/view/view.component';
import { AppComponent } from './app.component';
import { AuthGuard } from './guard/auth.guard';
import { Error404Component } from './shared/error404/error404.component';
import { AboutUsComponent } from './Website/pages/about-us/about-us.component';
import { CartComponent } from './Website/pages/cart/cart.component';
import { CollectionComponent } from './Website/pages/collection/collection.component';
import { ContactUsComponent } from './Website/pages/contact-us/contact-us.component';
import { HomeComponent } from './Website/pages/home/home.component';
import { MultiBlogsComponent } from './Website/pages/multi-blogs/multi-blogs.component';
import { ProductComponent } from './Website/pages/product/product.component';
import { ProductsComponent } from './Website/pages/products/products.component';
import { SingleBlogComponent } from './Website/pages/single-blog/single-blog.component';
import { UserLoginComponent } from './Website/pages/user/login/login.component';
import { UserRegisterComponent } from './Website/pages/user/register/register.component';
import { WebsiteComponent } from './Website/website/website.component';

const routes: Routes = [
  {
    path: 'admin',component: AdminComponent,
    children:[
      {
        path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]
      },
      {
        path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuard]
      },
      {
        path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]
      },
      // Category
      {
        path: 'add-category', component: AddCategoryComponent, canActivate: [AuthGuard]
      },
      {
        path: 'add-category/:id', component: AddCategoryComponent, canActivate: [AuthGuard]
      },
      {
        path: 'view-category', component: ViewCategoryComponent, canActivate: [AuthGuard]
      },
      {
        path: 'view-category/:id', component: ViewCategoryComponent, canActivate: [AuthGuard]
      },
      // Banner
      {
        path: 'add-banner', component: AddBannerComponent, canActivate: [AuthGuard]
      },
      {
        path: 'add-banner/:id', component: AddBannerComponent, canActivate: [AuthGuard]
      },
      {
        path: 'view-banner', component: ViewBannerComponent, canActivate: [AuthGuard]
      },
      // Product

      {
        path: 'add-product', component: AddProductComponent, canActivate: [AuthGuard]
      },
      {
        path: 'add-product/:id', component: AddProductComponent, canActivate: [AuthGuard]
      },
      {
        path: 'view-product', component: ViewProductComponent, canActivate: [AuthGuard]
      },
      // Blog

      {
        path: 'add-blog', component: AddBlogComponent, canActivate: [AuthGuard]
      },
      {
        path: 'add-blog/:id', component: AddBlogComponent, canActivate: [AuthGuard]
      },
      {
        path: 'view-blog', component: ViewBlogComponent, canActivate: [AuthGuard]
      },
      // Page Content

      {
        path: 'add-page', component: AddPageComponent, canActivate: [AuthGuard]
      },
      {
        path: 'add-page/:id', component: AddPageComponent, canActivate: [AuthGuard]
      },
      {
        path: 'view-page', component: ViewPageComponent, canActivate: [AuthGuard]
      },
      {
        path: '', redirectTo:'/admin/dashboard', pathMatch: 'full'
      }
    ]
  },
  {
    path: 'user',component: AppComponent,
    children:[
      {
        path: 'login',component: UserLoginComponent
      },
      {
        path: 'register',component: UserRegisterComponent
      }
    ]
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'about-us', component: AboutUsComponent
  },
  {
    path: 'collection', component: CollectionComponent
  },
  {
    path: 'products', component: ProductsComponent
  },
  {
    path: 'products/:id', component: ProductsComponent
  },
  {
    path: 'product/:id', component: ProductComponent
  },
  {
    path: 'multi-blogs', component: MultiBlogsComponent
  },
  {
    path: 'single-blog', component: SingleBlogComponent
  },
  {
    path: 'forgot-password', component: ForgotpasswordComponent
  },
  {
    path: 'cart',component: CartComponent
  },
  {
    path: '', redirectTo: "/home",pathMatch: 'full'
  },
  {
    path: 'home',component: HomeComponent
  },
  {
    path: 'contact-us',component: ContactUsComponent
  },
  {
    path: '**',component: Error404Component
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
