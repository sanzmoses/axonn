import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { FarmsPage } from '../pages/farms/farms';
import { ProfilePage } from '../pages/profile/profile';
import { MenuPage } from '../pages/menu/menu';
import { OrdersPage } from '../pages/orders/orders';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = "LoginPage"
  activePage:any;


  pages: Array<{title: string, component: any}>;

  constructor( public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();
       // used for an example of ngFor and navigation
    this.pages = [
      { title: 'home', component: HomePage },
      { title: 'profile', component: ProfilePage },
      { title: 'restaurants', component: FarmsPage },
      { title: 'menu', component: MenuPage },
      { title: 'orders', component: OrdersPage }
    ];
 
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    // this.nav.setRoot(page);
    console.log(page);
    this.nav.push(page);
    this.activePage = page;
  }

  closeMenu(){
     this.platform.exitApp();
  }
}
