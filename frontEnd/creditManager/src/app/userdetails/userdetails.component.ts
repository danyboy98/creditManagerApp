import { Component, OnInit } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { User } from '../shared/user';
import { UserService } from '../services/user.service';
import { baseURL } from '../shared/baseurl';

@Component({
  selector: 'app-userdetails',
  templateUrl: './userdetails.component.html',
  styleUrls: ['./userdetails.component.scss']
})
export class UserdetailsComponent implements OnInit {

  user: User;
  BaseURL;
  usercopy: User;
  constructor(private userService: UserService,
    private route: ActivatedRoute,
    private location: Location) {
      this.BaseURL = baseURL;
     }

  ngOnInit() {
    const id = +this.route.snapshot.params['id'];
    this.userService.getUser(id.toString()).subscribe((user) => this.user = user);
    this.usercopy = this.user;
  }

  goBack(): void {
    this.location.back();
  }

}
