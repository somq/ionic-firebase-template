
export interface Roles { 
    subscriber?: boolean;
    editor?: boolean;
    admin?: boolean;
 }
  
export interface User {
    uid: string;
    email: string;
    roles: Roles;
}

export interface Userx {
    email: string;
    password: string;
  }