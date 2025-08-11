import { Component } from '@angular/core';
import { RouterOutlet, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { NavBarComponent } from './shared/components/navbar/navbar.component.js';
import { FooterComponent } from './shared/components/footer/footer.component.js';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavBarComponent, FooterComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'olivenders-frontend';
  hideLayout = false;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events.subscribe(() => {
      let route = this.activatedRoute;
      while (route.firstChild) {
        route = route.firstChild;
      }
      this.hideLayout = route.snapshot.data?.['hideLayout'] ?? false;
    });
  }
}
