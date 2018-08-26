import { Component } from '@angular/core';
import { AlertController , IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../models/User';
import { AngularFireAuth } from 'angularfire2/auth';
import { HTTP } from '@ionic-native/http';



@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user = {} as User;
  constructor(private alertCtrl: AlertController ,public navCtrl: NavController, private http: HTTP ,public navParams: NavParams,public afAuth: AngularFireAuth,) {
     
  }

  ionViewDidLoad() {
     localStorage.setItem('base_url_api','http://axonn.itresourcesgroup.com.au/api/');
     localStorage.setItem('base_url','http://axonn.itresourcesgroup.com.au/');
  }

  async login(user : User){

  	try{
  		const result = await this.afAuth.auth.signInWithEmailAndPassword(user.email,user.password);

      localStorage.setItem('email',user.email);

  		if (result) {
              this.navCtrl.push('HomePage')
  		}

  	}catch(e){
      this.presentAlert("something went wrong please try again!")
  	}
  }


  register(){
  	this.navCtrl.push('RegisterPage')
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
