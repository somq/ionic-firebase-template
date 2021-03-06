import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';
import { User, Userx } from './user';


@Injectable()
export class AuthProvider {

  user$: Observable<User>;
  userx = {} as Userx;

  constructor(private afAuth: AngularFireAuth,
              private afs: AngularFirestore) {

    // Get auth data, then get firestore user document || null
    this.user$ = this.afAuth.authState
      .switchMap(user => {
        console.log('>>authState:', user)
        if (user) {
          console.info(`A user is logged in ! (${user.uid})`)
          return this.afs.doc(`users/${user.uid}`).valueChanges()
        } else {
          return Observable.of(null)
        }
      })
  }


    ///// Login/Signup //////

  emailLogin(email, password) {
    // return this.afAuth.auth.signInWithEmailAndPassword(email, password);
    return this.afAuth.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(res => {
      return this.afAuth.auth.signInWithEmailAndPassword(email, password);
    })
  }
  
  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider()
    return this.oAuthLogin(provider);
  }

  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.updateUserData(credential.user)
      })
  }

  signOut() {
    this.afAuth.auth.signOut()
  }

  private updateUserData(user) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const data: User = {
      uid: user.uid,
      email: user.email,
      roles: {
        subscriber: true
      }
    }
    return userRef.set(data, { merge: true })
  }

  addUser(username) {
    const password = 'ocpdev';
    console.log(`adding user (${username + '@ocp.com'} - ${password})`)
    this.afAuth.auth.createUserWithEmailAndPassword(username + '@ocp.com', password).then(res => {
      console.log('Created an account:', res)
    })
  }

  addPhone() {
    console.log('adding phone')

  }
  addAppProfile() {
    console.log('adding app profile')

  }
  ///// Role-based Authorization //////

  canRead(user: User): boolean {
    const allowed = ['admin', 'editor', 'subscriber']
    return this.checkAuthorization(user, allowed)
  }

  canEdit(user: User): boolean {
    const allowed = ['admin', 'editor']
    return this.checkAuthorization(user, allowed)
  }

  canDelete(user: User): boolean {
    const allowed = ['admin']
    return this.checkAuthorization(user, allowed)
  }



  // determines if user has matching role
  private checkAuthorization(user: User, allowedRoles: string[]): boolean {
    if (!user) return false
    for (const role of allowedRoles) {
      if ( user.roles[role] ) {
        return true
      }
    }
    return false
  }


}
