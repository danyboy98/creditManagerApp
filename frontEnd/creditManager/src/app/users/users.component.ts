import { Component, OnInit } from '@angular/core';
import { User } from '../shared/user';
import { UserService } from '../services/user.service';
import { baseURL } from '../shared/baseurl';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users: User[];
  BaseURL;
  constructor(private userService: UserService) {
    this.BaseURL = baseURL;
   }
  
  ngOnInit() {
    this.userService.getAllUsers().subscribe(users => this.users = users);
    console.log(this.users)
  }
}
