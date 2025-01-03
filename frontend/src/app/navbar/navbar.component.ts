import {DOCUMENT} from '@angular/common';
import {Component, Inject} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {NgbCollapse, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [
    RouterLink,
    NgbCollapse,
    RouterLinkActive,
    NgbTooltip,
  ],
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
