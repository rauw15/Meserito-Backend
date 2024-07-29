import TableModel from '../../table/domain/Table'; // Importar el modelo Mongoose
import { deliverOrder } from '../services/RobotService';

export async function deliverOrderToTable(tableId: string): Promise<void> {
  // Lógica para obtener la mesa por ID
  const table = await TableModel.findById(tableId).exec();
  if (!table) {
    throw new Error(`No table found with ID: ${tableId}`);
  }

  // Usar el servicio del robot para entregar el pedido
  await deliverOrder();

  console.log(`Delivering order to table ID: ${tableId}`);
}
