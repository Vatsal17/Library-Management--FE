import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { UserType } from '../../../models/models';

export interface NavigationItem {
  value: string;
  link: string;
}

@Component({
  selector: 'page-side-nav',
  templateUrl: './page-side-nav.component.html',
  styleUrl: './page-side-nav.component.scss',
})
export class PageSideNavComponent {
  panelName: string = '';
  navItems: NavigationItem[] = [];

  constructor(private apiService: ApiService, private router: Router) {
    // Subscribe to user status changes
    apiService.userStatus.subscribe({
      next: (status) => {
        if (status === 'loggedIn') {
          this.handleLoggedInUser();
        } else if (status === 'loggedOff') {
          this.handleLoggedOffUser();
        }
      },
      error: (err) => {
        console.error('Error fetching user status:', err);
      },
    });
  }

  // Handle user navigation and nav items for logged-in users
  handleLoggedInUser() {
    this.router.navigateByUrl('/home');
    let user = this.apiService.getUserInfo();
    
    if (user) {
      this.setUserPanel(user.userType);
    } else {
      console.warn('User info is unavailable.');
      this.router.navigateByUrl('/login');  // Fallback in case user info is not found
    }
  }

  // Set the panel name and navigation items based on user type
  setUserPanel(userType: UserType) {
    const commonNavItems: NavigationItem[] = [{ value: 'View Books', link: '/home' }];

    if (userType === UserType.LIBRARIAN) {
      this.panelName = 'Librarian Panel';
      this.navItems = [
        ...commonNavItems,
        { value: 'Maintenance', link: '/maintenance' },
        { value: 'Return Book', link: '/return-book' },
        { value: 'View Users', link: '/view-users' },
        { value: 'Approval Requests', link: '/approval-requests' },
        { value: 'All Orders', link: '/all-orders' },
        { value: 'My Orders', link: '/my-orders' },
      ];
    } else if (userType === UserType.MEMBER) {
      this.panelName = 'Member Panel';
      this.navItems = [
        ...commonNavItems,
        { value: 'My Orders', link: '/my-orders' },
      ];
    } else {
      console.error('Unknown user type:', userType);
    }
  }

  // Handle user navigation when logged off
  handleLoggedOffUser() {
    this.panelName = 'Auth Panel';
    this.navItems = [];
    this.router.navigateByUrl('/login');
  }
}
