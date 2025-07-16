import pytest
import requests

BASE_URL = "http://127.0.0.1:30000"
TABLES_URL = f"{BASE_URL}/tables"

ADMIN = {"email": "admin@example.com", "password": "adminpass"}
WAITER = {"email": "mesero@example.com", "password": "meseropass"}

admin_token = None
waiter_token = None
created_table_id = None

# Utilidades

def login(user):
    resp = requests.post(f"{BASE_URL}/users/login", json=user)
    assert resp.status_code == 200
    return resp.json()["token"]

def auth_header(token):
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture(scope="module", autouse=True)
def setup_tokens():
    global admin_token, waiter_token
    admin_token = login(ADMIN)
    waiter_token = login(WAITER)

def test_get_all_tables():
    resp = requests.get(f"{TABLES_URL}/getAll")
    assert resp.status_code == 200
    assert resp.json()["status"] == "success"
    print("test_get_all_tables PASSED")

def test_create_table_success():
    global created_table_id
    payload = {"id": 2001, "number": 10, "status": "disponible", "color": "azul"}
    resp = requests.post(f"{TABLES_URL}/create", json=payload, headers=auth_header(admin_token))
    assert resp.status_code == 200 or resp.status_code == 201
    data = resp.json()
    assert data["status"] == "success"
    created_table_id = data["data"]["id"]
    print("test_create_table_success PASSED")

def test_get_table_by_id():
    resp = requests.get(f"{TABLES_URL}/get/{2001}")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "success"
    assert data["data"]["id"] == 2001
    print("test_get_table_by_id PASSED")

def test_get_table_by_id_not_found():
    resp = requests.get(f"{TABLES_URL}/get/99999")
    assert resp.status_code == 404
    assert resp.json()["status"] == "error"
    print("test_get_table_by_id_not_found PASSED")

def test_create_table_duplicate_number():
    payload = {"id": 2002, "number": 10, "status": "disponible", "color": "azul"}
    resp = requests.post(f"{TABLES_URL}/create", json=payload, headers=auth_header(admin_token))
    assert resp.status_code == 400 or resp.status_code == 409
    print("test_create_table_duplicate_number PASSED")

def test_update_table_to_occupied():
    payload = {"status": "ocupada"}
    resp = requests.put(f"{TABLES_URL}/update/{2001}", json=payload, headers=auth_header(admin_token))
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "success"
    assert data["data"]["status"] == "ocupada"
    print("test_update_table_to_occupied PASSED")

def test_update_table_to_available():
    payload = {"status": "disponible"}
    resp = requests.put(f"{TABLES_URL}/update/{2001}", json=payload, headers=auth_header(admin_token))
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "success"
    assert data["data"]["status"] == "disponible"
    print("test_update_table_to_available PASSED")

def test_assign_order_to_table():
    # Simula asignar un pedido (ajusta el payload según tu API)
    payload = {"order_id": 5001}
    resp = requests.put(f"{TABLES_URL}/update/{2001}", json=payload, headers=auth_header(admin_token))
    assert resp.status_code == 200
    print("test_assign_order_to_table PASSED")

def test_update_table_not_found():
    payload = {"status": "ocupada"}
    resp = requests.put(f"{TABLES_URL}/update/99999", json=payload, headers=auth_header(admin_token))
    assert resp.status_code == 404
    print("test_update_table_not_found PASSED")

def test_delete_table_success():
    resp = requests.delete(f"{TABLES_URL}/delete/{2001}", headers=auth_header(admin_token))
    assert resp.status_code == 200
    assert resp.json()["status"] == "success"
    print("test_delete_table_success PASSED")

def test_delete_table_with_active_order():
    # Primero crea una mesa y asígnale un pedido activo
    payload = {"id": 2003, "number": 11, "status": "ocupada", "color": "azul"}
    resp = requests.post(f"{TABLES_URL}/create", json=payload, headers=auth_header(admin_token))
    assert resp.status_code == 200 or resp.status_code == 201
    # Simula asignar un pedido activo (ajusta el payload según tu API)
    assign_payload = {"order_id": 5002}
    resp = requests.put(f"{TABLES_URL}/update/{2003}", json=assign_payload, headers=auth_header(admin_token))
    assert resp.status_code == 200
    # Intentar eliminar la mesa con pedido activo
    resp = requests.delete(f"{TABLES_URL}/delete/{2003}", headers=auth_header(admin_token))
    assert resp.status_code == 400 or resp.status_code == 409
    print("test_delete_table_with_active_order PASSED")
