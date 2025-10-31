import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { CarouselModule } from 'primeng/carousel';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { BadgeModule } from 'primeng/badge';
import { DividerModule } from 'primeng/divider';

import { AuthService } from '../../core/services/auth.service';
import { MockDataService } from '../../core/services/mock-data.service';
import { BeautyService } from '../../core/models/service.model';
import { Testimonial } from '../../core/models/testimonial.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    MenubarModule,
    AvatarModule,
    RatingModule,
    CarouselModule,
    DataViewModule,
    TagModule,
    BadgeModule,
    DividerModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private authService = inject(AuthService);
  private mockDataService = inject(MockDataService);
  private router = inject(Router);

  // Navigation
  protected readonly menuItems = signal<MenuItem[]>([
    {
      label: 'Inicio',
      icon: 'pi pi-home',
      command: () => this.scrollToSection('hero')
    },
    {
      label: 'Servicios',
      icon: 'pi pi-sparkles',
      command: () => this.scrollToSection('services')
    },
    {
      label: 'Testimonios',
      icon: 'pi pi-star',
      command: () => this.scrollToSection('testimonials')
    },
    {
      label: 'Contacto',
      icon: 'pi pi-phone',
      command: () => this.scrollToSection('contact')
    }
  ]);

  // Data
  protected services = this.mockDataService.services;
  protected popularServices = signal<BeautyService[]>([]);
  protected testimonials = this.mockDataService.testimonials;

  // Auth
  protected currentUser = this.authService.currentUser;
  protected isAuthenticated = this.authService.isAuthenticated;

  // Carousel settings
  protected carouselResponsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 2,
      numScroll: 1
    },
    {
      breakpoint: '768px',
      numVisible: 1,
      numScroll: 1
    }
  ];

  ngOnInit(): void {
    this.authService.checkAuth();
    this.popularServices.set(this.mockDataService.getPopularServices());
  }

  protected scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  protected loginAsClient(): void {
    this.authService.loginAsClient();
    this.router.navigate(['/client']);
  }

  protected loginAsAdmin(): void {
    this.authService.loginAsAdmin();
    this.router.navigate(['/admin']);
  }

  protected logout(): void {
    this.authService.logout();
  }

  protected goToDashboard(): void {
    const role = this.authService.userRole();
    if (role === 'admin') {
      this.router.navigate(['/admin']);
    } else if (role === 'client') {
      this.router.navigate(['/client']);
    }
  }

  protected getServiceCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
      'manicure': 'Manicura',
      'pedicure': 'Pedicura',
      'nail-art': 'Nail Art',
      'spa': 'Spa',
      'treatments': 'Tratamientos'
    };
    return labels[category] || category;
  }

  protected getServiceCategorySeverity(category: string): 'success' | 'info' | 'warn' | 'danger' {
    const severities: Record<string, 'success' | 'info' | 'warn' | 'danger'> = {
      'manicure': 'success',
      'pedicure': 'info',
      'nail-art': 'warn',
      'spa': 'success',
      'treatments': 'info'
    };
    return severities[category] || 'info';
  }
}
