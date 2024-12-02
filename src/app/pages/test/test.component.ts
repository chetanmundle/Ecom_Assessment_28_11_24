import { Component, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css',
})
export class TestComponent {
  private toster = inject(ToastrService);
  onClickTest() {
    this.toster.success('Hello');
  }
}
