import { Component, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { SessionUserState } from '@core/store/session-user/session-user.state';
import { selectIsAdmin, selectSessionUser } from '@core/store/session-user/session-user.selector';

interface NavigationRoute {
  path: string;
  displayName: string;
  exactPath: boolean;
  accessRoles: string[];
  icon: string;
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  navigationRoutes = [
    {
      path: 'products-list',
      displayName: 'My products',
      exactPath: false,
      accessRoles: ['seller', 'admin'],
      icon: 'list'
    },
    {
      path: 'users-list',
      displayName: 'All users',
      exactPath: true,
      accessRoles: ['admin'],
      icon: 'supervisor_account'
    }
  ] as NavigationRoute[];

  sessionUser$ = this.storeSessionUser.select(selectSessionUser);
  constructor(private storeSessionUser: Store<SessionUserState>) { }

  ngOnInit(): void {
  }

}
