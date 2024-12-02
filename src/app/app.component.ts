import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavBarComponent } from './shared/components/nav-bar/nav-bar.component';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnDestroy {
  title = 'Ecom_Assessment_Frontend';
  showNavbar: boolean = true;
  private subscription: Subscription;

  constructor(private router: Router) {
    this.subscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        if (
          this.router.url === '/auth/Login' ||
          this.router.url === '/auth/Register' ||
          this.router.url === '/auth/Forgot-Password' ||
              this.router.url === '/test'
        ) {
          this.showNavbar = false;
        } else {
          this.showNavbar = true;
        }
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
