import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, ParamMap, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { UserModel } from '@core/model/user.model';
import { UserService } from '@core/service/user.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {

  user$: Observable<UserModel | undefined | null>;

  constructor(private activatedRoute: ActivatedRoute,
              private userService: UserService) {
    this.user$ = this.activatedRoute.paramMap
      .pipe(
        switchMap((params: ParamMap) => this.userService.getUser$(params.get('uid') || '')),
      );
  }

  ngOnInit(): void {}

}
