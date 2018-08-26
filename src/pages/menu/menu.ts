import { Component } from '@angular/core';
import { AlertController , ModalController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { ProfilePage } from '../profile/profile';
import _ from 'lodash';

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

	public farmdata:any;
  public orderList:any;
  public base_url_api:any;

    constructor(private alertCtrl: AlertController , public navCtrl: NavController, public navParams: NavParams,private http: HTTP,public modalCtrl: ModalController) {
      this.orderList = [];
  }

  ionViewDidLoad() {
      let vm = this;
      this.base_url_api  =  localStorage.getItem('base_url_api');
      this.initializeItems();

  }

  addItem(item){

     var ids = _.map(this.orderList, 'id')
      if (!_.includes(ids, item.id)) {
          item.quantity = 1
          this.orderList.push(item)
      } else {
          var index = _.findIndex(this.orderList, item)
          this.orderList[index].quantity = this.orderList[index].quantity + 1
      }

      console.log(this.orderList);
  };

  decreaseItem(item){
      var index = _.findIndex(this.orderList, item)
      this.orderList[index].quantity = this.orderList[index].quantity - 1;
      console.log(this.orderList);

  }

  initializeItems() {
    let restaurant_id  =  localStorage.getItem('restaurant_id');
    let base_api_url   =  localStorage.getItem('base_url_api');
    
    this.http.get(base_api_url+'menu/'+restaurant_id, {}, {}).then(data => {
       this.farmdata = JSON.parse(data.data);
    })
    .catch(error => {

    });
  }

   getItems(ev: any) {

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.farmdata = this.farmdata.filter((item) => {
        console.log(item);
        return (item.product_name.toLowerCase().indexOf(val.toLowerCase()) > -1);
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

    presentPayment(): void
    {
        let prompt = this.alertCtrl.create({
        title: 'Pay Online?',
        message: 'Select a payment method',
        inputs : [
        {
            type:'radio',
            label:'Paypal',
            value:'paypal'
        },
         {
            type:'radio',
            label:'Stripe',
            value:'stripe'
        },
         {
            type:'radio',
            label:'Union Bank',
            value:'unionbank'
        },
         {
            type:'radio',
            label:'Dragon Pay',
            value:'dragonpay'
        }],
        buttons : [
        {
            text: "Pay later",
            handler: data => {
            console.log("cancel clicked");
            }
        },
        {
            text: "Submit",
            handler: data => {
              let payment = JSON.stringify(data);
                this.presentSuccessPay(); 
            }
        }]});
        prompt.present();
    }

    presentConfirm(): void
    {
        let prompt = this.alertCtrl.create({
        title: 'Confirm purchase?',
        message: 'Select dining option',
        inputs : [
        {
            type:'radio',
            label:'Deliver Order',
            value:'deliver'
        },
        {
            type:'radio',
            label:'Reserve Stocks',
            value:'reserve'
        }],
        buttons : [
        {
            text: "Cancel",
            handler: data => {
                  this.presentSuccess();
              
            }
        },
        {
            text: "Submit",
            handler: data => {
              let user_address = localStorage.getItem('address');
              if (!user_address || user_address === '' || typeof user_address === 'undefined' ||  user_address === 'null') {
                    
                this.presentAddressAlert('something went wrong!');

              }else{
                   let dining_option = JSON.stringify(data);
                   for(var key in this.orderList) {
                        if (this.orderList.hasOwnProperty(key)) {
                            let user_id = localStorage.getItem('user_id');
                            let quantity = this.orderList[key].quantity;
                            let menu_id = this.orderList[key].id;
                            let restaurant_id = this.orderList[key].restaurant_id;
                        
                            this.http.post(this.base_url_api+'orders/submit', 
                              {
                                user_id:user_id,
                                quantity:quantity,
                                menu_id:menu_id,
                                restaurant_id:restaurant_id,
                                dining_option:dining_option,
                              }, {'Content-Type': 'application/json'}).then((data) => {
                                if (data.data == 1) {
                                  this.presentPayment();
                                }else{
                                  this.presentAlert('Error submitting orders');
                                }
                            })
                            .catch((error) => {
                                  console.log(error.error);
                            });
                        
                        }
                    }
              }
            }
        }]});
        prompt.present();
    }

    presentAlert(e) {
        let alert = this.alertCtrl.create({
          title: 'Something Went Wrong!',
          subTitle: e,
          buttons: ['Dismiss']
        });
        alert.present();
    }

    presentAddressAlert(e) {
        let alert = this.alertCtrl.create({
          title: 'Please fillup your address on profile settings to continue!',
          subTitle: e,
          buttons: ['Dismiss']
        });
        alert.present();
    }

    presentSuccess() {
        let alert = this.alertCtrl.create({
          title: 'Order successfully submitted!',
          subTitle: '',
          buttons: ['Dismiss']
        });
        alert.present();
    }

    presentSuccessPay() {
        let alert = this.alertCtrl.create({
          title: 'You  successfully pay your order online!',
          subTitle: '',
          buttons: ['Dismiss']
        });
        alert.present();
    }

}
