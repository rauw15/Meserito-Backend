import { Pedido, ProductoEnPedido, UsuarioInfo } from "./Pedido";

export interface PedidoFilters {
  status?: string;
  userId?: number;
  table_id?: number;
}

export interface CreatePedidoData {
  table_id: number;
  user_id: number;
  user_info?: UsuarioInfo;
  products: ProductoEnPedido[];
  total: number;
  status?: string;
}

export interface PedidoRepository {
  getAll(): Promise<Pedido[] | null>;
  getFiltered(filters: PedidoFilters): Promise<Pedido[] | null>;
  createPedido(data: CreatePedidoData): Promise<Pedido | null>;
  getById(id: number): Promise<Pedido | null>;
  update(id: number, data: Partial<Pedido>): Promise<Pedido | null>;
  delete(id: number): Promise<boolean>;
  getActiveByTableId(table_id: number): Promise<Pedido | null>;
}
