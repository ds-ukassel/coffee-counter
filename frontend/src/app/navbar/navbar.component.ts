import {Component, DOCUMENT, inject} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {NgbCollapse, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [RouterLink, NgbCollapse, RouterLinkActive, NgbTooltip],
})
export class NavbarComponent {
  readonly document = inject<Document>(DOCUMENT);

  isMenuCollapsed = true;

  toggleFullscreen() {
    if (this.document.fullscreenElement) {
      this.document.exitFullscreen();
    } else {
      this.document.documentElement.requestFullscreen();
    }
  }
}
