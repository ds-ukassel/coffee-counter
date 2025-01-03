import {Component} from '@angular/core';
import {NavbarComponent} from './navbar/navbar.component';
import {RouterOutlet} from '@angular/router';
import {ToastModule} from '@mean-stream/ngbx';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    NavbarComponent,
    RouterOutlet,
    ToastModule,
  ],
})
export class AppComponent {
  title = 'frontend';
}
