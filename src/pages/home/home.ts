import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { AuthProvider } from './../../providers/auth/auth';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  userId: string;
  userCollection: AngularFirestoreCollection<{}>;
  currentUserAppProfiles: Observable<{}[]>;
  currentUserPhones: Observable<{}[]>;

  userRef;
  ref$;
  user;
  userName;
  userPassword;

  constructor(
    private db: AngularFirestore,
    private afAuth:AngularFireAuth,
    public authS: AuthProvider
  ) {

    this.authS.user$.subscribe(user => {
      this.user = user;
      console.log(user)
      if(user) {
        this.createUser();
      }
    })
    
    this.afAuth.authState.subscribe(user => {
      if(user) {
        this.userId = user.uid;
      } else {
        console.info('User logged out.')
      }
    })



    

    // afAuth.auth.createUserWithEmailAndPassword('dev2@ocp.com', 'ocpdev2').then(res => {
    //   console.log(res)
    // })
    // this.afAuth.auth.signInWithEmailAndPassword(email, password).then(
    //   res => {
    //     console.info('[WizardPage] (firebase/auth/succ)', res);
    //     console.info('[WizardPage] (firebase/auth/succ)', res.uid);
    //     this.query(res.uid)
    //   },
    //   err => {
    //     console.info('[WizardPage] (firebase/auth/err)', err);
    //   }
    // ).catch(e => {
    //     console.error('[WizardPage] (firebase/auth/err)', e)
    // });




  }


  createUser() {
    const user = {
      uid: this.userId,
      location: 'France',
      name: 'Oberthur Cash Protection',
      roles: {
        admin:false,
        phone: false,
        superadmin: true,
        user: false
      }
    }

    this.userCollection = this.db.collection('users')
    // const id = this.db.createId();
    this.userCollection.doc(this.userId).set(user)
  }


  editPost() {
    // this.postRef.update({ title: 'Edited Title!'})
  }


  deletePost() {
    // this.postRef.delete()
  }


  query(uid) {

    this.currentUserAppProfiles = this.db.collection('appProfiles', ref => ref.where('owner', '==', uid)).valueChanges();

    this.currentUserAppProfiles.subscribe(res => {
      console.log(res)
    })

    this.currentUserPhones = this.db.collection('phones', ref => ref.where('owner', '==', uid).where('test', '==', 'abcdx')).valueChanges();

    this.currentUserPhones.subscribe(res => {
      console.log('a', res)

      // console.log(res[0].appProfile.path)

      // this.currentUserPhones = db.collection(res[0].appProfile.path).valueChanges();

      // this.currentUserPhones.subscribe(res => {
      //   console.log(res)
      // })

    })

  }
}
