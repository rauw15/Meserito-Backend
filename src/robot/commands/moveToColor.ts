import TableModel from '../../table/domain/Table'; // Importar el modelo Mongoose
import { moveToColor } from '../services/RobotService';

export async function moveToTableColor(tableColor: string): Promise<void> {
  // Lógica para obtener la mesa con el color especificado
  const table = await TableModel.findOne({ color: tableColor }).exec();
  if (!table) {
    throw new Error(`No table found with color: ${tableColor}`);
  }

  // Usar el servicio del robot para mover hacia el color
  await moveToColor(tableColor);

  console.log(`Moving to table with color: ${tableColor}`);
}
