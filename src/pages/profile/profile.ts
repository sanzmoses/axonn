import { Component } from '@angular/core';
import { AlertController , IonicPage, NavController, NavParams } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  
  public user : any;
  constructor(public alertCtrl: AlertController , public navCtrl: NavController, public navParams: NavParams,private http: HTTP) {
  		  this.user = {};
  }

  ionViewDidLoad() {
  console.log('ionViewDidLoad HomePage');
          this.getUserData();
  }

   logForm() {
	    console.log(this.user)
	    let base_api_url = localStorage.getItem('base_url_api');
	      this.http.get(base_api_url+'update/user/'+this.user.email+'/'+this.user.fullname+'/'+this.user.address+'/'+this.user.contact, {}, {})
	      .then(data => {
	        
	         if (data.data == 1) {
	            let alert = this.alertCtrl.create({
	              title: 'Success!',
	              subTitle: 'Update Complete',
	              buttons: ['Dismiss']
	            });
	          localStorage.setItem('address',this.user.address);
	            
	            alert.present();
	         }else{
	            this.presentAlert('Update failed please try again');
	         }
	      }).catch(error => {
       
	       this.presentAlert(error.error)
	       console.log(error.error)
	       console.log(error)

	      });
	  }
   
  getUserData()
  {
  		let email = localStorage.getItem('email');
  		  this.user.email = email;
  	      let base_url = localStorage.getItem('base_url');
	      this.http.get(base_url+'user/'+this.user.email+'/', {}, {})
	      .then(data => {
	      	  let  userdata = JSON.parse(data.data);
	        
	          this.user.fullname =   userdata.name;
	          this.user.address  =   userdata.address;
	          this.user.contact  =   userdata.contact;
	          localStorage.setItem('address',userdata.address);
	     
	           
	      }).catch(error => {
	      	if (error.status == 403) {
	      		 let  userdata = JSON.parse(error.error);
		        
		        this.user.fullname =   userdata.name;
	          	this.user.address  =   userdata.address;
	          	this.user.contact  =   userdata.contact;
	          localStorage.setItem('address',userdata.address);

	      	}else{
	      		this.presentAlert(error.error)
	       		
	      	}
	      	console.log(error.error);
	       		console.log(error);

	      });
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
