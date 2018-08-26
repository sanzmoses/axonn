import { Component } from '@angular/core';
import { AlertController , IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../models/User';
import { AngularFireAuth } from 'angularfire2/auth';
import { HTTP } from '@ionic-native/http';



/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  user = {} as User;

  constructor(private alertCtrl: AlertController , public navCtrl: NavController, public navParams: NavParams, public afAuth: AngularFireAuth,private http: HTTP) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  async register(user : User){
  	try{
  		await this.afAuth.auth.createUserWithEmailAndPassword(user.email,user.password);
      let vm = this;
      let base_api_url = localStorage.getItem('base_url_api');
      this.http.get(base_api_url+'add/'+user.email+'/'+user.password, {}, {})
      .then(data => {
        
         console.log(data.data);
         if (data.data == 1) {
            let alert = this.alertCtrl.create({
              title: 'Success!',
              subTitle: 'Registration Complete',
              buttons: ['Dismiss']
            });
            alert.present();
         }else{
            this.presentAlert('Registration failed please try again');
         }
        
      })
      .catch(error => {
       
       this.presentAlert(error.error)
       console.log(error.error)

      });

  	}catch(e){

      this.presentAlert(e.message)
       console.log(e.message)
      
  	}
  }

  login()
  {
  	this.navCtrl.push('LoginPage')
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
