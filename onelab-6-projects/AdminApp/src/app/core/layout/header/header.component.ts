import { Component, OnInit } from '@angular/core';
import { LogoutSessionUserAction } from '@core/store/session-user/session-user.action';
import { Store } from '@ngrx/store';
import { SessionUserState } from '@core/store/session-user/session-user.state';
import {
  selectIsAdmin,
  selectIsLoading
} from '@core/store/session-user/session-user.selector';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isLoading$ = this.storeSessionUser.select(selectIsLoading);
  isAdmin$ = this.storeSessionUser.select(selectIsAdmin);
  constructor(private storeSessionUser: Store<SessionUserState>) { }

  ngOnInit(): void {
  }

  logout(): void {
    this.storeSessionUser.dispatch(LogoutSessionUserAction());
  }
}
