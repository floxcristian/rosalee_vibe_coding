import { Injectable, signal } from '@angular/core';
import { BeautyService } from '../models/service.model';
import { Appointment } from '../models/appointment.model';
import { Testimonial } from '../models/testimonial.model';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  // Services
  private servicesSignal = signal<BeautyService[]>([
    {
      id: '1',
      name: 'Manicura Clásica',
      description: 'Manicura completa con limado, cutícula y esmaltado tradicional',
      duration: 45,
      price: 25,
      category: 'manicure',
      popular: true
    },
    {
      id: '2',
      name: 'Manicura Permanente',
      description: 'Esmaltado semipermanente de larga duración (hasta 3 semanas)',
      duration: 60,
      price: 35,
      category: 'manicure',
      popular: true
    },
    {
      id: '3',
      name: 'Pedicura Spa',
      description: 'Pedicura completa con exfoliación, masaje y esmaltado',
      duration: 75,
      price: 45,
      category: 'pedicure',
      popular: true
    },
    {
      id: '4',
      name: 'Nail Art Diseño',
      description: 'Diseños personalizados y decoración artística en uñas',
      duration: 90,
      price: 50,
      category: 'nail-art'
    },
    {
      id: '5',
      name: 'Uñas Acrílicas',
      description: 'Extensión y esculpido de uñas con acrílico',
      duration: 120,
      price: 65,
      category: 'treatments'
    },
    {
      id: '6',
      name: 'Uñas de Gel',
      description: 'Extensión con gel para un acabado natural y resistente',
      duration: 120,
      price: 70,
      category: 'treatments',
      popular: true
    },
    {
      id: '7',
      name: 'Spa de Manos',
      description: 'Tratamiento completo con exfoliación, mascarilla y masaje',
      duration: 60,
      price: 40,
      category: 'spa'
    },
    {
      id: '8',
      name: 'Tratamiento Parafina',
      description: 'Tratamiento hidratante intensivo con parafina caliente',
      duration: 45,
      price: 30,
      category: 'treatments'
    }
  ]);

  // Testimonials
  private testimonialsSignal = signal<Testimonial[]>([
    {
      id: '1',
      clientName: 'Ana Martínez',
      clientAvatar: 'https://i.pravatar.cc/150?img=10',
      rating: 5,
      comment: '¡Increíble servicio! El ambiente es muy relajante y el resultado de mis uñas es perfecto. Totalmente recomendado.',
      service: 'Manicura Permanente',
      date: new Date('2024-10-20')
    },
    {
      id: '2',
      clientName: 'Laura Sánchez',
      clientAvatar: 'https://i.pravatar.cc/150?img=9',
      rating: 5,
      comment: 'La mejor pedicura que he tenido. El personal es muy profesional y atento. ¡Volveré seguro!',
      service: 'Pedicura Spa',
      date: new Date('2024-10-18')
    },
    {
      id: '3',
      clientName: 'Carmen López',
      clientAvatar: 'https://i.pravatar.cc/150?img=20',
      rating: 5,
      comment: 'Me encantan mis uñas de gel. Duran muchísimo y se ven hermosas. El salón es muy limpio y moderno.',
      service: 'Uñas de Gel',
      date: new Date('2024-10-15')
    },
    {
      id: '4',
      clientName: 'Isabel Ruiz',
      clientAvatar: 'https://i.pravatar.cc/150?img=16',
      rating: 5,
      comment: 'El nail art que me hicieron superó todas mis expectativas. ¡Pura creatividad y profesionalismo!',
      service: 'Nail Art Diseño',
      date: new Date('2024-10-12')
    }
  ]);

  // Appointments
  private appointmentsSignal = signal<Appointment[]>([
    {
      id: '1',
      clientId: '1',
      clientName: 'María García',
      serviceId: '2',
      serviceName: 'Manicura Permanente',
      date: new Date('2024-11-05'),
      time: '10:00',
      status: 'confirmed',
      totalPrice: 35
    },
    {
      id: '2',
      clientId: '1',
      clientName: 'María García',
      serviceId: '3',
      serviceName: 'Pedicura Spa',
      date: new Date('2024-10-20'),
      time: '15:00',
      status: 'completed',
      totalPrice: 45
    },
    {
      id: '3',
      clientId: '3',
      clientName: 'Ana Martínez',
      serviceId: '6',
      serviceName: 'Uñas de Gel',
      date: new Date('2024-11-02'),
      time: '11:30',
      status: 'confirmed',
      totalPrice: 70
    },
    {
      id: '4',
      clientId: '4',
      clientName: 'Laura Sánchez',
      serviceId: '1',
      serviceName: 'Manicura Clásica',
      date: new Date('2024-11-01'),
      time: '16:00',
      status: 'pending',
      totalPrice: 25
    },
    {
      id: '5',
      clientId: '5',
      clientName: 'Carmen López',
      serviceId: '4',
      serviceName: 'Nail Art Diseño',
      date: new Date('2024-11-03'),
      time: '14:00',
      status: 'confirmed',
      totalPrice: 50
    }
  ]);

  services = this.servicesSignal.asReadonly();
  testimonials = this.testimonialsSignal.asReadonly();
  appointments = this.appointmentsSignal.asReadonly();

  getServiceById(id: string): BeautyService | undefined {
    return this.servicesSignal().find(s => s.id === id);
  }

  getPopularServices(): BeautyService[] {
    return this.servicesSignal().filter(s => s.popular);
  }

  getAppointmentsByClientId(clientId: string): Appointment[] {
    return this.appointmentsSignal().filter(a => a.clientId === clientId);
  }

  addAppointment(appointment: Appointment): void {
    this.appointmentsSignal.update(appointments => [...appointments, appointment]);
  }

  updateAppointmentStatus(appointmentId: string, status: Appointment['status']): void {
    this.appointmentsSignal.update(appointments =>
      appointments.map(a => a.id === appointmentId ? { ...a, status } : a)
    );
  }

  cancelAppointment(appointmentId: string): void {
    this.updateAppointmentStatus(appointmentId, 'cancelled');
  }
}
