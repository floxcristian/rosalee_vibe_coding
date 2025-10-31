export interface BeautyService {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  category: 'manicure' | 'pedicure' | 'nail-art' | 'spa' | 'treatments';
  image?: string;
  popular?: boolean;
}
