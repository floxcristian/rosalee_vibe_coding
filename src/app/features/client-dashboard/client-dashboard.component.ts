import { Component, signal, inject, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { TimelineModule } from 'primeng/timeline';
import { DividerModule } from 'primeng/divider';
import { ChipModule } from 'primeng/chip';

import { AuthService } from '../../core/services/auth.service';
import { MockDataService } from '../../core/services/mock-data.service';
import { Appointment } from '../../core/models/appointment.model';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    TableModule,
    TagModule,
    AvatarModule,
    MenuModule,
    TimelineModule,
    DividerModule,
    ChipModule
  ],
  templateUrl: './client-dashboard.component.html',
  styleUrl: './client-dashboard.component.scss'
})
export class ClientDashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private mockDataService = inject(MockDataService);
  private router = inject(Router);

  protected currentUser = this.authService.currentUser;
  protected allAppointments = this.mockDataService.appointments;

  protected myAppointments = computed(() => {
    const userId = this.currentUser()?.id;
    if (!userId) return [];
    return this.allAppointments().filter(apt => apt.clientId === userId);
  });

  protected upcomingAppointments = computed(() => {
    const now = new Date();
    return this.myAppointments().filter(apt =>
      apt.date >= now && (apt.status === 'confirmed' || apt.status === 'pending')
    ).sort((a, b) => a.date.getTime() - b.date.getTime());
  });

  protected pastAppointments = computed(() => {
    const now = new Date();
    return this.myAppointments().filter(apt =>
      apt.date < now || apt.status === 'completed'
    ).sort((a, b) => b.date.getTime() - a.date.getTime());
  });

  protected menuItems = signal<MenuItem[]>([
    {
      label: 'Mi Perfil',
      icon: 'pi pi-user'
    },
    {
      label: 'Configuración',
      icon: 'pi pi-cog'
    },
    {
      separator: true
    },
    {
      label: 'Cerrar Sesión',
      icon: 'pi pi-sign-out',
      command: () => this.logout()
    }
  ]);

  ngOnInit(): void {
    // Check if user is authenticated and is a client
    if (!this.authService.isAuthenticated() || !this.authService.isClient()) {
      this.router.navigate(['/']);
    }
  }

  protected goToHome(): void {
    this.router.navigate(['/']);
  }

  protected logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  protected getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' {
    const severities: Record<string, 'success' | 'info' | 'warn' | 'danger'> = {
      'confirmed': 'success',
      'pending': 'warn',
      'completed': 'info',
      'cancelled': 'danger'
    };
    return severities[status] || 'info';
  }

  protected getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'confirmed': 'Confirmada',
      'pending': 'Pendiente',
      'completed': 'Completada',
      'cancelled': 'Cancelada'
    };
    return labels[status] || status;
  }

  protected cancelAppointment(appointmentId: string): void {
    this.mockDataService.cancelAppointment(appointmentId);
  }

  protected formatDate(date: Date): string {
    return new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  }
}
