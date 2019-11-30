import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  constructor(private authService: AuthService) { }

  connected: boolean;

  ngOnInit() {
    this.authService.authenticationState.subscribe(state => {
      if (state) {
        this.connected = true;
      } else {
        this.connected = false;
      }
    });

  }
}
