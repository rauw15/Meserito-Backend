// models/RobotCommand.ts
export interface RobotCommand {
  action: 'move_forward' | 'stop' | 'rotate_left' | 'rotate_right' | 'search_color' | 'return' | 'check_distance'; // Acciones específicas
  value?: number | string;
}
