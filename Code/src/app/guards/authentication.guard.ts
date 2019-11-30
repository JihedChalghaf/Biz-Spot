import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate  {

constructor(private auth: AuthService){}

  canActivate(): boolean {
    return this.auth.isAuthenticated();
  }
}
