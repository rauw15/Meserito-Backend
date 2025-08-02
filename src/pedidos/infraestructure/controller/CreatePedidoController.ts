import { Request, Response } from 'express';
import { CreatePedidoUseCase } from '../../application/CreatePedidoUseCase';
import { globalWebSocketServer } from '../../../server';
import { ProductoEnPedido } from '../../domain/Pedido';

export class CreatePedidoController {
  constructor(private readonly createPedidoUseCase: CreatePedidoUseCase) {}

  async run(req: Request, res: Response): Promise<void> {
    // Extraer todos los datos del body
    const { table_id, user_id, products } = req.body;

    // Validación básica de entrada
    if (!table_id || !user_id || !Array.isArray(products) || products.length === 0) {
      res.status(400).send({ 
        status: 'error', 
        message: 'Missing required fields: table_id, user_id, products (array)' 
      });
      return;
    }

    // Validar que cada producto tenga los campos requeridos
    for (const product of products) {
      if (!product.product_id || !product.quantity || !product.unit_price) {
        res.status(400).send({ 
          status: 'error', 
          message: 'Each product must have: product_id, quantity, unit_price' 
        });
        return;
      }
    }

    try {
      // Convertir productos al formato correcto
      const formattedProducts: ProductoEnPedido[] = products.map(product => ({
        product_id: parseInt(product.product_id),
        name: product.name || '', // Se llenará en el UseCase
        price: parseFloat(product.unit_price),
        quantity: parseInt(product.quantity),
        unit_price: parseFloat(product.unit_price)
      }));

      // Crear el pedido
      const newPedido = await this.createPedidoUseCase.run(
        parseInt(table_id),
        parseInt(user_id),
        formattedProducts
      );

      if (newPedido) {
        // Lógica de WebSocket
        if (globalWebSocketServer) {
          globalWebSocketServer.notifyOrderUpdate(
            newPedido.id.toString(),
            'creado',
            table_id.toString(),
            `Nuevo pedido #${newPedido.id} creado para la mesa ${table_id}`
          );
          globalWebSocketServer.sendNotification(
            `📋 Nuevo pedido creado: #${newPedido.id} en mesa ${table_id}`
          );
        }
        
        res.status(201).send({ status: 'success', data: newPedido });
      } else {
        res.status(500).send({ status: 'error', message: 'Error creating pedido' });
      }
    } catch (error: unknown) {
      // Lógica de manejo de errores
      if (error instanceof Error) {
        if (error.message === 'TABLE_NOT_FOUND') {
          res.status(404).send({ status: 'error', message: 'Table not found' });
        } else if (error.message === 'TABLE_NOT_AVAILABLE') {
          res.status(400).send({ status: 'error', message: 'Table is not available' });
        } else if (error.message === 'TABLE_HAS_ACTIVE_ORDER') {
          res.status(409).send({ status: 'error', message: 'Table already has an active order' });
        } else if (error.message === 'USER_NOT_FOUND') {
          res.status(404).send({ status: 'error', message: 'User not found' });
        } else {
          res.status(500).send({ status: 'error', message: error.message });
        }
      } else {
        res.status(500).send({ status: 'error', message: 'Internal Server Error' });
      }
    }
  }
}