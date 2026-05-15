export interface Project {
  id?: string;
  title: string;
  slug: string;
  category: string;
  location: string;
  date: string;
  description: string;
  images: string[];
  features: string[];
  createdAt?: any;
}
