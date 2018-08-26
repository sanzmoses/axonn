import { Component } from '@angular/core';
import { AlertController , ModalController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { ProfilePage } from '../profile/profile';

@IonicPage()
@Component({
  selector: 'page-orders',
  templateUrl: 'orders.html',
})
export class OrdersPage {

  public ordersdata:any;
  public base_url_api:any;
	public user_id:any;

  constructor(private alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams,private http: HTTP,public modalCtrl: ModalController) {
       this.base_url_api = localStorage.getItem('base_url_api');
       this.user_id = localStorage.getItem('user_id');
  }

  ionViewDidLoad() {
  	this.getOrders();
  }

  getOrders(){
    this.http.get(this.base_url_api+'orders/'+this.user_id, {}, {}).then(data => {
       this.ordersdata = JSON.parse(data.data);
    })
    .catch(error => {

    });
  }

  cancelOrder(id)
  {
    
    this.http.get(this.base_url_api+'orders/delete/'+id, {}, {}).then(data => {
        if (data.data == 1) {
          this.presentSuccess();
        }else{
         this.presentAlert('Cancel order failed!')
        }
        this.getOrders();
    })
    .catch(error => {
         this.presentAlert(error.error);
    });
  }

  presentModal() {
    let modal = this.modalCtrl.create(ProfilePage);
    modal.present();
  }

   presentAlert(e) {
      let alert = this.alertCtrl.create({
        title: 'Something Went Wrong!',
        subTitle: e,
        buttons: ['Dismiss']
      });
      alert.present();
  }

     presentSuccess() {
      let alert = this.alertCtrl.create({
        title: 'Order Deleted!',
        subTitle: '',
        buttons: ['Dismiss']
      });
      alert.present();
  }

}
