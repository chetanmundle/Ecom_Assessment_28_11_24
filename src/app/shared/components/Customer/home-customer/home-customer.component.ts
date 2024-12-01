import { Component, Input } from '@angular/core';
import { UserDataDto } from '../../../../core/models/classes/User/UserDataDto';

@Component({
  selector: 'app-home-customer',
  standalone: true,
  imports: [],
  templateUrl: './home-customer.component.html',
  styleUrl: './home-customer.component.css',
})
export class HomeCustomerComponent {
  @Input() loggedUser?: UserDataDto;
}
