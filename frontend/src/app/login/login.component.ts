import { Component } from '@angular/core';
import { AuthorizationService } from '../authorization.service';
import { Router } from '@angular/router';

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
    private router: Router
  ) {}

  login(): void {
    const credentials = this.authorization.login(this.username, this.password);
    
    credentials.subscribe((obj) => {
      const { token } = obj;

      if (token) {
        sessionStorage.setItem('token', token);
        this.error = false;
        this.router.navigate(['/chat'])
      } else {
        this.error = true;
        this.username = '';
        this.password = '';
      }
    });
  }
}
