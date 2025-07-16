#!/usr/bin/env python3
"""
Script para ejecutar todas las pruebas del proyecto Meserito
"""
import subprocess
import sys
import time
import os

def run_command(command, description):
    """Ejecuta un comando y maneja errores"""
    print(f"\n🔄 {description}")
    print(f"Comando: {command}")
    
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ {description} completado exitosamente")
            return True
        else:
            print(f"❌ {description} falló")
            print(f"Error: {result.stderr}")
            return False
    except Exception as e:
        print(f"❌ Error ejecutando {description}: {e}")
        return False

def main():
    print("🚀 Iniciando pruebas del proyecto Meserito")
    
    # 1. Instalar dependencias si es necesario
    if not os.path.exists("node_modules"):
        print("📦 Instalando dependencias de Node.js...")
        run_command("npm install", "Instalación de dependencias")
    
    # 2. Iniciar el servidor en segundo plano
    print("🖥️ Iniciando servidor...")
    server_process = subprocess.Popen(
        ["npm", "start"], 
        stdout=subprocess.PIPE, 
        stderr=subprocess.PIPE
    )
    
    # 3. Esperar a que el servidor esté listo
    print("⏳ Esperando a que el servidor esté listo...")
    time.sleep(5)
    
    # 4. Configurar base de datos de pruebas
    print("🗄️ Configurando base de datos de pruebas...")
    run_command("python test/setup_test_db.py", "Configuración de base de datos")
    
    # 5. Ejecutar pruebas
    print("🧪 Ejecutando pruebas...")
    test_success = run_command("pytest test/ -v", "Ejecución de pruebas")
    
    # 6. Detener el servidor
    print("🛑 Deteniendo servidor...")
    server_process.terminate()
    server_process.wait()
    
    # 7. Mostrar resultados
    if test_success:
        print("\n🎉 ¡Todas las pruebas pasaron exitosamente!")
        return 0
    else:
        print("\n💥 Algunas pruebas fallaron")
        return 1

if __name__ == "__main__":
    sys.exit(main()) 