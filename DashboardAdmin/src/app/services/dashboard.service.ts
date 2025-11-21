import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private isDarkMode = false;
  private isSidebarClosed = false;

  constructor() { }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }

  toggleSidebar(): void {
    this.isSidebarClosed = !this.isSidebarClosed;
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.content');
    
    if (sidebar && content) {
      if (this.isSidebarClosed) {
        sidebar.classList.add('close');
        content.classList.add('close');
      } else {
        sidebar.classList.remove('close');
        content.classList.remove('close');
      }
    }
  }

  isDarkModeEnabled(): boolean {
    return this.isDarkMode;
  }

  isSidebarClosedState(): boolean {
    return this.isSidebarClosed;
  }
}