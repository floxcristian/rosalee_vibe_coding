import { Injectable, signal, computed } from '@angular/core';
import { User, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSignal = signal<User | null>(null);

  currentUser = this.currentUserSignal.asReadonly();
  isAuthenticated = computed(() => this.currentUserSignal() !== null);
  userRole = computed(() => this.currentUserSignal()?.role ?? null);
  isAdmin = computed(() => this.currentUserSignal()?.role === 'admin');
  isClient = computed(() => this.currentUserSignal()?.role === 'client');

  // Mock users
  private mockUsers: User[] = [
    {
      id: '1',
      name: 'María García',
      email: 'maria@example.com',
      phone: '+34 612 345 678',
      role: 'client',
      avatar: 'https://i.pravatar.cc/150?img=1',
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'Admin Rosalee',
      email: 'admin@rosalee.com',
      phone: '+34 612 999 888',
      role: 'admin',
      avatar: 'https://i.pravatar.cc/150?img=5',
      createdAt: new Date('2023-01-01')
    }
  ];

  login(email: string, password: string): boolean {
    // Mock login - in production, this would call an API
    const user = this.mockUsers.find(u => u.email === email);
    if (user) {
      this.currentUserSignal.set(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  }

  loginAsClient(): void {
    const client = this.mockUsers.find(u => u.role === 'client');
    if (client) {
      this.currentUserSignal.set(client);
      localStorage.setItem('currentUser', JSON.stringify(client));
    }
  }

  loginAsAdmin(): void {
    const admin = this.mockUsers.find(u => u.role === 'admin');
    if (admin) {
      this.currentUserSignal.set(admin);
      localStorage.setItem('currentUser', JSON.stringify(admin));
    }
  }

  logout(): void {
    this.currentUserSignal.set(null);
    localStorage.removeItem('currentUser');
  }

  // Check if user is already logged in (from localStorage)
  checkAuth(): void {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSignal.set(user);
      } catch (e) {
        localStorage.removeItem('currentUser');
      }
    }
  }
}
