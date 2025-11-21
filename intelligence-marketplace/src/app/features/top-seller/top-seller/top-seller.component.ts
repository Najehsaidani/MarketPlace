import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-top-seller',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './top-seller.component.html',
  styleUrl: './top-seller.component.css'
})
export class TopSellerComponent implements OnInit {

  topSellers = [
    {
      id: 1,
      name: 'Boutique ÉlectroTech',
      rating: 4.8,
      salesCount: 1250,
      productsCount: 45,
      image: 'assets/images/sellers/seller1.jpg'
    },
    {
      id: 2,
      name: 'FashionStyle Store',
      rating: 4.7,
      salesCount: 980,
      productsCount: 32,
      image: 'assets/images/sellers/seller2.jpg'
    },
    {
      id: 3,
      name: 'Home & Living',
      rating: 4.9,
      salesCount: 2100,
      productsCount: 68,
      image: 'assets/images/sellers/seller3.jpg'
    },
    {
      id: 4,
      name: 'Sports Essentials',
      rating: 4.6,
      salesCount: 750,
      productsCount: 28,
      image: 'assets/images/sellers/seller4.jpg'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
