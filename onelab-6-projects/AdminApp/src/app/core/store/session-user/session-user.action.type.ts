export enum SessionUserActionType {
  LOAD            = '[SESSION USER] Load user',
  LOAD_COMPLETE   = '[SESSION USER] Load user complete',
  LOAD_FAIL       = '[SESSION USER] Load user fail',

  LOGIN           = '[SESSION USER] Login user',
  LOGIN_COMPLETE  = '[SESSION USER] Login user complete',
  LOGIN_FAIL      = '[SESSION USER] Login user fail',

  LOGOUT          = '[SESSION USER] Logout user',
  LOGOUT_COMPLETE = '[SESSION USER] Logout user complete',
  LOGOUT_FAIL     = '[SESSION USER] Logout user fail',
}
