import { Pedido } from "./Pedido";

export interface PedidoFilters {
  status?: string;
  userId?: number;
  table_id?: number;
}

export interface PedidoRepository {
  getAll(): Promise<Pedido[] | null>;
  getFiltered(filters: PedidoFilters): Promise<Pedido[] | null>;
  createPedido(id: number, userId: number | null, productIds: number[], status: string, table_id: number): Promise<Pedido | null>;
  getById(id: number): Promise<Pedido | null>;
  update(id: number, data: Partial<Pedido>): Promise<Pedido | null>;
  delete(id: number): Promise<boolean>;
  getActiveByTableId(table_id: number): Promise<Pedido | null>;
}
