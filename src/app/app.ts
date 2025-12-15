import { Component } from '@angular/core';
import { EmployeeDashboardComponent } from './employee-dashboard/employee-dashboard.component';

@Component({
  selector: 'app-root',
  imports: [EmployeeDashboardComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'Système de Gestion de Produits';
}
