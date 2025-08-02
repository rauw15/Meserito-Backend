import { PedidoRepository, CreatePedidoData } from '../domain/PedidoRepository';
import { Pedido, ProductoEnPedido, UsuarioInfo } from '../domain/Pedido';
import TableModel from '../../table/domain/Table';
import UserModel from '../../user/domain/User';
import ProductModel from '../../product/domain/Product';

export class CreatePedidoUseCase {
  constructor(private readonly pedidoRepository: PedidoRepository) {}

  async run(
    table_id: number,
    user_id: number,
    products: ProductoEnPedido[]
  ): Promise<Pedido | null> {
    try {
      console.log('🔍 CreatePedidoUseCase - Iniciando creación de pedido:', { table_id, user_id, productsCount: products.length });
      
      // 1. Verificar si la mesa existe y está disponible
      const table = await TableModel.findOne({ id: table_id });
      if (!table) {
        throw new Error('TABLE_NOT_FOUND');
      }
      if (table.status !== 'disponible') {
        throw new Error('TABLE_NOT_AVAILABLE');
      }

      // 2. Verificar que no haya pedido activo para esa mesa
      const existingPedido = await this.pedidoRepository.getActiveByTableId(table_id);
      if (existingPedido) {
        throw new Error('TABLE_HAS_ACTIVE_ORDER');
      }

      // 3. Obtener información del usuario
      const user = await UserModel.findOne({ id: user_id });
      if (!user) {
        throw new Error('USER_NOT_FOUND');
      }

      console.log('👤 Usuario encontrado:', { id: user.id, name: user.name, email: user.email });

      // 4. Enriquecer los productos con información completa
      const enrichedProducts: ProductoEnPedido[] = [];
      console.log('🛍️ Enriqueciendo productos...');
      
      for (const product of products) {
        console.log('🔍 Buscando producto con ID:', product.product_id);
        const productInfo = await ProductModel.findOne({ id: product.product_id });
        
        if (productInfo) {
          console.log('✅ Producto encontrado:', { 
            id: productInfo.id, 
            name: productInfo.name, 
            price: productInfo.price 
          });
          
          enrichedProducts.push({
            product_id: product.product_id,
            name: productInfo.name,
            price: product.price,
            quantity: product.quantity,
            unit_price: product.unit_price
          });
        } else {
          console.log('❌ Producto NO encontrado con ID:', product.product_id);
          // Agregar producto con información básica si no se encuentra
          enrichedProducts.push({
            product_id: product.product_id,
            name: `Producto ${product.product_id}`,
            price: product.price,
            quantity: product.quantity,
            unit_price: product.unit_price
          });
        }
      }

      console.log('📦 Productos enriquecidos:', enrichedProducts);

      // 5. Calcular el total
      const total = enrichedProducts.reduce((sum, product) => {
        return sum + (product.price * product.quantity);
      }, 0);

      console.log('💰 Total calculado:', total);

      // 6. Preparar información del usuario
      const userInfo: UsuarioInfo = {
        id: user.id,
        name: user.name,
        email: user.email
      };

      // 7. Crear el pedido con todos los datos
      const pedidoData: CreatePedidoData = {
        table_id,
        user_id,
        user_info: userInfo,
        products: enrichedProducts,
        total,
        status: 'pendiente'
      };

      console.log('📋 Datos del pedido a crear:', pedidoData);

      const newPedido = await this.pedidoRepository.createPedido(pedidoData);

      console.log('✅ Pedido creado:', newPedido ? { 
        id: newPedido.id, 
        productsCount: newPedido.products?.length,
        total: newPedido.total 
      } : 'null');

      // 8. Cambiar estado de la mesa a 'ocupada'
      if (newPedido) {
        table.status = 'ocupada';
        await table.save();
      }

      return newPedido;

    } catch (error) {
      // Re-lanzar errores específicos para que el controlador los maneje
      if (error instanceof Error && (
        error.message === 'TABLE_NOT_FOUND' ||
        error.message === 'TABLE_NOT_AVAILABLE' ||
        error.message === 'TABLE_HAS_ACTIVE_ORDER' ||
        error.message === 'USER_NOT_FOUND'
      )) {
        throw error;
      }
      console.error('Error in CreatePedidoUseCase:', error);
      return null;
    }
  }
}