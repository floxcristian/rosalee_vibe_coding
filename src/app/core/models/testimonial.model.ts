export interface Testimonial {
  id: string;
  clientName: string;
  clientAvatar?: string;
  rating: number;
  comment: string;
  service: string;
  date: Date;
}
