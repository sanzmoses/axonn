import { Component } from '@angular/core';
import { AlertController , ModalController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { ProfilePage } from '../profile/profile';

@IonicPage()
@Component({
  selector: 'page-farms',
  templateUrl: 'farms.html',
})
export class FarmsPage {

  public farmsdata:any;
	public base_url_api:any;

  constructor(private alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams,private http: HTTP,public modalCtrl: ModalController) {
       this.base_url_api = localStorage.getItem('base_url_api');
       this.initializeItems();
  }

  ionViewDidLoad() {
      let vm = this;

  	this.http.get(this.base_url_api+'all', {}, {}).then(data => {
	     vm.farmsdata = JSON.parse(data.data);
	  })
	  .catch(error => {
       this.presentAlert(error.error)
	  });

  }

  viewRestaurant(id)
  {
     localStorage.setItem('restaurant_id',id);
  	 this.navCtrl.push('HomePage')


  }

  initializeItems() {
    this.http.get(this.base_url_api+'all', {}, {}).then(data => {
       this.farmsdata = JSON.parse(data.data);
    })
    .catch(error => {
       this.presentAlert(error.error)
    });
  }

   getItems(ev: any) {

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.farmsdata = this.farmsdata.filter((item) => {
        console.log(item);
        return (item.restaurant_name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }else if(val == ''){
       this.initializeItems();
    }else{
       this.initializeItems();
    }
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

}
