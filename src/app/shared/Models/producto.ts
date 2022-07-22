export interface Producto {
    id: number | 0;
    imagen: string | '';
    nombre: string | '';
    costo: number | 0;
    stock: number | 0;
    descripcion: string | '';
    instrucciones?: string | '';
    categoria: string | '';
    categoria_id: number | 0;
    notas: string;
}
