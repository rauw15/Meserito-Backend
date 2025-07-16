import requests
import time
import sys
from pymongo import MongoClient

BASE_URL = "http://127.0.0.1:30000"

def wait_for_server():
    max_attempts = 30
    for attempt in range(max_attempts):
        try:
            response = requests.get(f"{BASE_URL}/users/get", timeout=1)
            if response.status_code in [200, 401, 403]:
                print("✅ Servidor está funcionando")
                return True
        except requests.exceptions.ConnectionError:
            print(f"⏳ Esperando servidor... intento {attempt + 1}/{max_attempts}")
            time.sleep(1)
    print("❌ Servidor no disponible después de 30 intentos")
    return False

def clear_all():
    print("🗑️ Borrando usuarios, mesas, pedidos y productos de la base de datos...")
    client = MongoClient("mongodb://localhost:27017/")
    db = client["meserito_test"]
    db.users.delete_many({})
    db.tables.delete_many({})
    db.pedidos.delete_many({})
    db.products.delete_many({})
    print("✅ Usuarios, mesas, pedidos y productos eliminados")

def create_test_users():
    users = [
        {
            "name": "Admin",
            "email": "admin@example.com",
            "password": "adminpass",
            "role": "administrador"
        },
        {
            "name": "Mesero",
            "email": "mesero@example.com",
            "password": "meseropass",
            "role": "mesero"
        }
    ]
    for user in users:
        try:
            response = requests.post(f"{BASE_URL}/users/create", json=user)
            if response.status_code in [200, 201]:
                print(f"✅ Usuario {user['email']} creado")
            else:
                print(f"❌ Error creando usuario {user['email']}: {response.status_code} {response.text}")
        except Exception as e:
            print(f"❌ Error creando usuario {user['email']}: {e}")

def main():
    print("🚀 Configurando base de datos de pruebas...")
    clear_all()
    if not wait_for_server():
        sys.exit(1)
    create_test_users()
    print("✅ Configuración completada")

if __name__ == "__main__":
    main() 