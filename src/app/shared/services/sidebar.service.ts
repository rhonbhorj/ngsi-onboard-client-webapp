import { Injectable, signal } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private _isCollapsed = signal(false)
  
  readonly isCollapsed = this._isCollapsed.asReadonly()
  
  toggle() {
    this._isCollapsed.update(collapsed => !collapsed)
  }
  
  setCollapsed(collapsed: boolean) {
    this._isCollapsed.set(collapsed)
  }
}

