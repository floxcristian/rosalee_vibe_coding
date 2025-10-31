import { Component, signal, inject, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { ChartModule } from 'primeng/chart';
import { ProgressBarModule } from 'primeng/progressbar';

import { AuthService } from '../../core/services/auth.service';
import { MockDataService } from '../../core/services/mock-data.service';
import { Appointment } from '../../core/models/appointment.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    TableModule,
    TagModule,
    AvatarModule,
    ChartModule,
    ProgressBarModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private mockDataService = inject(MockDataService);
  private router = inject(Router);

  protected currentUser = this.authService.currentUser;
  protected appointments = this.mockDataService.appointments;
  protected services = this.mockDataService.services;

  // Computed statistics
  protected todayAppointments = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.appointments().filter(apt => {
      const aptDate = new Date(apt.date);
      aptDate.setHours(0, 0, 0, 0);
      return aptDate.getTime() === today.getTime();
    });
  });

  protected pendingAppointments = computed(() => {
    return this.appointments().filter(apt => apt.status === 'pending');
  });

  protected totalRevenue = computed(() => {
    return this.appointments()
      .filter(apt => apt.status === 'completed')
      .reduce((sum, apt) => sum + apt.totalPrice, 0);
  });

  protected recentAppointments = computed(() => {
    return [...this.appointments()]
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 10);
  });

  // Chart data
  protected chartData = signal<any>(null);
  protected chartOptions = signal<any>(null);

  ngOnInit(): void {
    // Check if user is authenticated and is an admin
    if (!this.authService.isAuthenticated() || !this.authService.isAdmin()) {
      this.router.navigate(['/']);
    }

    this.initChartData();
  }

  private initChartData(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.chartData.set({
      labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
      datasets: [
        {
          label: 'Citas',
          data: [12, 15, 18, 20, 22, 25],
          fill: false,
          borderColor: '#ec4899',
          backgroundColor: 'rgba(236, 72, 153, 0.2)',
          tension: 0.4
        },
        {
          label: 'Ingresos (€)',
          data: [450, 525, 630, 700, 770, 875],
          fill: false,
          borderColor: '#8b5cf6',
          backgroundColor: 'rgba(139, 92, 246, 0.2)',
          tension: 0.4
        }
      ]
    });

    this.chartOptions.set({
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder
          }
        }
      }
    });
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

  protected confirmAppointment(appointmentId: string): void {
    this.mockDataService.updateAppointmentStatus(appointmentId, 'confirmed');
  }

  protected completeAppointment(appointmentId: string): void {
    this.mockDataService.updateAppointmentStatus(appointmentId, 'completed');
  }

  protected cancelAppointment(appointmentId: string): void {
    this.mockDataService.cancelAppointment(appointmentId);
  }
}
