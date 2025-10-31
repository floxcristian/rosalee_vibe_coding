import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    TableModule,
    TagModule,
    AvatarModule,
    MenubarModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  protected readonly menuItems = signal<MenuItem[]>([
    {
      label: 'Home',
      icon: 'pi pi-home'
    },
    {
      label: 'Features',
      icon: 'pi pi-star'
    },
    {
      label: 'Projects',
      icon: 'pi pi-briefcase'
    },
    {
      label: 'Contact',
      icon: 'pi pi-envelope'
    }
  ]);

  protected readonly products = signal<Product[]>([
    { id: 1, name: 'Wireless Headphones', category: 'Electronics', price: 99.99, status: 'In Stock' },
    { id: 2, name: 'Smart Watch', category: 'Electronics', price: 299.99, status: 'In Stock' },
    { id: 3, name: 'Laptop Stand', category: 'Accessories', price: 49.99, status: 'Low Stock' },
    { id: 4, name: 'USB-C Hub', category: 'Accessories', price: 79.99, status: 'Out of Stock' },
    { id: 5, name: 'Mechanical Keyboard', category: 'Electronics', price: 149.99, status: 'In Stock' }
  ]);

  getSeverity(status: string): 'success' | 'warn' | 'danger' {
    switch (status) {
      case 'In Stock':
        return 'success';
      case 'Low Stock':
        return 'warn';
      case 'Out of Stock':
        return 'danger';
      default:
        return 'success';
    }
  }
}
