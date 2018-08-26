import { NgZone , Component, ViewChild , ElementRef } from '@angular/core';
import { ModalController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { HTTP } from '@ionic-native/http';
import { ProfilePage } from '../profile/profile';


declare var google:any;

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  @ViewChild('map') mapRef : ElementRef;	
  map :any;
  restaurantdata:any;
  base_url_api:any;
  base_url:any;
  latitude:any;
  longitude:any;

  constructor(public navCtrl: NavController, private geolocation: Geolocation, public navParams: NavParams,private http: HTTP,public modalCtrl: ModalController,public zone:NgZone) {
      (window as any).angularComponent = { navigateRestaurant: this.navigateRestaurant, zone: zone };
  }

  ionViewDidLoad() {
  	this.base_url_api = localStorage.getItem('base_url_api');
    this.base_url = localStorage.getItem('base_url');

    let restaurant_id  =  localStorage.getItem('restaurant_id');
    if (restaurant_id) {
        this.http.get(this.base_url_api+'restaurant/'+restaurant_id, {}, {}).then(data => {
           var restaurantdata = JSON.parse(data.data);
           console.log(restaurantdata)
           console.log(restaurantdata[0].latitude)
               if (restaurantdata[0].latitude) {
                 this.latitude = restaurantdata[0].latitude;
                 this.longitude = restaurantdata[0].longitude;
               }
           

             this.http.get(this.base_url_api+'all', {}, {}).then(innderdata => {
               this.restaurantdata = JSON.parse(innderdata.data);
               this.showMap();
             })
            .catch(error => {
            
            });  

        })
        .catch(error => {

        });
    }else{
        this.geolocation.getCurrentPosition().then((resp) => {
            this.latitude = resp.coords.latitude;
            this.longitude =resp.coords.longitude;
            
             this.http.get(this.base_url_api+'all', {}, {}).then(innderdata => {
             this.restaurantdata = JSON.parse(innderdata.data);
             this.showMap();
             })
            .catch(error => {
            
            });  
        }).catch((error) => {
          console.log('Error getting location', error);
        });
    }

  	

      var email = localStorage.getItem('email');
      this.http.get('http://restofinder.itresourcesgroup.com.au/user/'+email+'/', {}, {}).then(data => {
          let  userdata = JSON.parse(data.data);
          console.log(userdata);
          console.log(data);

          localStorage.setItem('user_id',userdata.id);
          localStorage.setItem('address',userdata.address);
          
      }).catch(error => {
          console.log(error);
          var user = JSON.parse(error.error);
          localStorage.setItem('user_id',user.id);
          localStorage.setItem('address',user.address);
      });

  }

  showMap(){
  	 var locations = [];
  	 var vm = this;

      for(var key in this.restaurantdata) {
        if (this.restaurantdata.hasOwnProperty(key)) {
	            let image = this.restaurantdata[key].image;
	            let restaurant_name = this.restaurantdata[key].restaurant_name;
	            let id = this.restaurantdata[key].id;
	            let latitude = this.restaurantdata[key].latitude;
	            let longitude = this.restaurantdata[key].longitude;
	            let location = this.restaurantdata[key].location;
	            let arr = [restaurant_name,latitude,longitude,id,location,image];
	            locations.push(arr);
        }
      }

  	 const location = new google.maps.LatLng(this.latitude, this.longitude);

  	 const opt = {
  	 	center: location,
  	 	zoom: 20
  	 }
  	 this.map = new google.maps.Map(this.mapRef.nativeElement,opt)

  	  var infowindow = new google.maps.InfoWindow();
	    var marker, i;

	    for (i = 0; i < locations.length; i++) {  
	      marker = new google.maps.Marker({
	        position: new google.maps.LatLng(locations[i][1], locations[i][2]),
          icon: "http://api.itresourcesgroup.com.au/farms.png",
	        map: this.map
	      });

	      google.maps.event.addListener(marker, 'click', (function(marker, i) {
	        return function() {
	          infowindow.setContent('<img src="'+vm.base_url+'storage/app/'+locations[i][5]+'" style="width:150px;height:150px;" onclick="window.angularComponent.navigateRestaurant('+locations[i][3]+')"><center><h3>'+locations[i][0]+'</h3></center><p style="text-align:justify;">'+locations[i][4]+'</p>');
	          infowindow.open(this.map, marker);
	          console.log(vm.base_url+'storage/app/'+locations[i][5]);
	        }
	      })(marker, i));
      }

  }

  presentModal() {
    let modal = this.modalCtrl.create(ProfilePage);
    modal.present();
  }

    navigateRestaurant = (id: any) => { this.zone.run(() => { 
		  			//Navigate To New Page 
		  		 localStorage.setItem('restaurant_id',id);
		  	     this.navCtrl.push('MenuPage')
         }); 
    }


}
