import { Component } from '@angular/core';
import { AuthorizationService } from '../authorization.service';
import { Router } from '@angular/router';

import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  error: boolean = false;

  constructor (
    private authorization: AuthorizationService,
    private router: Router,
    private cookieService: CookieService
  ) {}

  login(): void {
    const credentials = this.authorization.login(this.username, this.password);
    
    credentials.subscribe((obj) => {
      const { token } = obj;

      if (token) {
        this.error = false;

        this.cookieService.set('token', token);

        this.router.navigate(['/chat']);
      } else {
        this.error = true;
        this.username = '';
        this.password = '';
      }
    });
  }
}
