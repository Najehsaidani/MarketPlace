import { Component } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {
  onSearch(query: string) {
    console.log('Search query:', query);
    // In a real application, this would trigger a search
    // For now, we'll just log the query
  }
}
