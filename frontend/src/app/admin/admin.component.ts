import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {User} from '../model/user.interface';
import {UserService} from '../user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  @ViewChild('modalRef') modalRef!: TemplateRef<any>;

  users: User[] = [];

  constructor(
    private modalService: NgbModal,
    private userService: UserService,
  ) {
  }

  ngOnInit(): void {
    this.userService.findAll().subscribe(users => {
      this.users = users;
    });
  }
}
