export interface Service {
    name: string;
    image?: string;
    ports?: string[];
    environment?: Record<string, string>;
    volumes?: string[];
    depends_on?: string[];
}