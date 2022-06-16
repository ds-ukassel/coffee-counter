import {DOCUMENT} from '@angular/common';
import {Component, Inject} from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  isMenuCollapsed = true;

  constructor(
    @Inject(DOCUMENT) public document: Document,
  ) {
  }

  toggleFullscreen() {
    if (this.document.fullscreenElement) {
      this.document.exitFullscreen();
    } else {
      this.document.documentElement.requestFullscreen();
    }
  }
}
