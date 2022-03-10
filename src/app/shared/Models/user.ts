export interface User {
  id: number | 0;
  nombre: string | null;
  apellidos: string | null;
  puesto: string | null;
  foto: any | null;
  isAdmin?: boolean | false;
  token?: string | null;
  authenticated?: boolean | false;
}
