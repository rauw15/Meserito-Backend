import pytest
import requests

BASE_URL = "http://127.0.0.1:30000"
ORDERS_URL = f"{BASE_URL}/orders"
TABLES_URL = f"{BASE_URL}/tables"
PRODUCTS_URL = f"{BASE_URL}/products"

ADMIN = {"email": "admin@example.com", "password": "adminpass"}
WAITER = {"email": "mesero@example.com", "password": "meseropass"}

admin_token = None
waiter_token = None
created_order_id = None
created_table_id = None
created_product_id = None

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

# 1. POST /api/orders: Crear un nuevo pedido vacío para una mesa específica.
def test_create_order_for_table():
    global created_table_id, created_order_id
    # Crear mesa disponible
    payload = {"id": 3001, "number": 20, "status": "disponible", "color": "azul"}
    resp = requests.post(f"{TABLES_URL}/create", json=payload, headers=auth_header(admin_token))
    assert resp.status_code in [200, 201]
    created_table_id = resp.json()["data"]["id"]
    # Crear pedido vacío
    payload = {"table_id": created_table_id}
    resp = requests.post(f"{ORDERS_URL}", json=payload, headers=auth_header(waiter_token))
    assert resp.status_code in [200, 201]
    data = resp.json()
    assert data["status"] == "success"
    created_order_id = data["data"]["id"]
    print("test_create_order_for_table PASSED")

# 2. POST /api/orders: Intentar crear un pedido para una mesa que ya está ocupada.
def test_create_order_for_occupied_table():
    # La mesa creada antes ya tiene un pedido activo
    payload = {"table_id": created_table_id}
    resp = requests.post(f"{ORDERS_URL}", json=payload, headers=auth_header(waiter_token))
    assert resp.status_code in [400, 409]
    print("test_create_order_for_occupied_table PASSED")

# 3. GET /api/orders: Obtener todos los pedidos activos.
def test_get_all_active_orders():
    resp = requests.get(f"{ORDERS_URL}", headers=auth_header(waiter_token))
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "success"
    assert any(order["id"] == created_order_id for order in data["data"])
    print("test_get_all_active_orders PASSED")

# 4. GET /api/orders/{id}: Obtener los detalles de un pedido específico, incluyendo sus productos.
def test_get_order_by_id():
    resp = requests.get(f"{ORDERS_URL}/{created_order_id}", headers=auth_header(waiter_token))
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "success"
    assert data["data"]["id"] == created_order_id
    assert "items" in data["data"]
    print("test_get_order_by_id PASSED")

# 5. PUT /api/orders/{id}/add_item: Añadir un producto a un pedido existente.
def test_add_product_to_order():
    global created_product_id
    # Crear producto
    payload = {"id": 4001, "name": "Ramen", "description": "Ramen", "price": 120}
    resp = requests.post(f"{PRODUCTS_URL}/create", json=payload, headers=auth_header(admin_token))
    assert resp.status_code in [200, 201]
    created_product_id = resp.json()["data"]["id"]
    # Añadir producto
    payload = {"product_id": created_product_id, "quantity": 1}
    resp = requests.put(f"{ORDERS_URL}/{created_order_id}/add_item", json=payload, headers=auth_header(waiter_token))
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "success"
    assert any(item["product_id"] == created_product_id for item in data["data"]["items"])
    print("test_add_product_to_order PASSED")

# 6. PUT /api/orders/{id}/add_item: Añadir el mismo producto varias veces (debe incrementar la cantidad).
def test_add_same_product_multiple_times():
    payload = {"product_id": created_product_id, "quantity": 2}
    resp = requests.put(f"{ORDERS_URL}/{created_order_id}/add_item", json=payload, headers=auth_header(waiter_token))
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "success"
    item = next(item for item in data["data"]["items"] if item["product_id"] == created_product_id)
    assert item["quantity"] >= 3
    print("test_add_same_product_multiple_times PASSED")

# 7. PUT /api/orders/{id}/add_item: Intentar añadir un producto que no existe en la base de datos.
def test_add_nonexistent_product():
    payload = {"product_id": 99999, "quantity": 1}
    resp = requests.put(f"{ORDERS_URL}/{created_order_id}/add_item", json=payload, headers=auth_header(waiter_token))
    assert resp.status_code == 404
    print("test_add_nonexistent_product PASSED")

# 8. PUT /api/orders/{id}/remove_item: Quitar un producto de un pedido.
def test_remove_product_from_order():
    payload = {"product_id": created_product_id}
    resp = requests.put(f"{ORDERS_URL}/{created_order_id}/remove_item", json=payload, headers=auth_header(waiter_token))
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "success"
    assert all(item["product_id"] != created_product_id for item in data["data"]["items"])
    print("test_remove_product_from_order PASSED")

# 9. PUT /api/orders/{id}/update_item_quantity: Actualizar la cantidad de un producto en el pedido.
def test_update_item_quantity():
    # Añadir producto de nuevo
    payload = {"product_id": created_product_id, "quantity": 1}
    resp = requests.put(f"{ORDERS_URL}/{created_order_id}/add_item", json=payload, headers=auth_header(waiter_token))
    assert resp.status_code == 200
    # Actualizar cantidad
    payload = {"product_id": created_product_id, "quantity": 5}
    resp = requests.put(f"{ORDERS_URL}/{created_order_id}/update_item_quantity", json=payload, headers=auth_header(waiter_token))
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "success"
    item = next(item for item in data["data"]["items"] if item["product_id"] == created_product_id)
    assert item["quantity"] == 5
    print("test_update_item_quantity PASSED")

# 10. PUT /api/orders/{id}: Verificar que el total del pedido se recalcula correctamente al añadir/quitar productos.
def test_order_total_recalculation():
    resp = requests.get(f"{ORDERS_URL}/{created_order_id}", headers=auth_header(waiter_token))
    assert resp.status_code == 200
    data = resp.json()["data"]
    total = sum(item["quantity"] * item["price"] for item in data["items"])
    assert abs(data["total"] - total) < 0.01
    print("test_order_total_recalculation PASSED")

# 11. PUT /api/orders/{id}: Cambiar el estado del pedido de "pendiente" a "servido".
def test_update_order_status_to_served():
    payload = {"status": "servido"}
    resp = requests.put(f"{ORDERS_URL}/{created_order_id}", json=payload, headers=auth_header(waiter_token))
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "success"
    assert data["data"]["status"] == "servido"
    print("test_update_order_status_to_served PASSED")

# 12. PUT /api/orders/{id}: Cambiar el estado del pedido de "servido" a "pagado".
def test_update_order_status_to_paid():
    payload = {"status": "pagado"}
    resp = requests.put(f"{ORDERS_URL}/{created_order_id}", json=payload, headers=auth_header(waiter_token))
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "success"
    assert data["data"]["status"] == "pagado"
    print("test_update_order_status_to_paid PASSED")

# 13. PUT /api/orders/{id}: Al pagar un pedido, verificar que la mesa asociada vuelve a estar "disponible".
def test_table_available_after_payment():
    resp = requests.get(f"{TABLES_URL}/get/{created_table_id}", headers=auth_header(waiter_token))
    assert resp.status_code == 200
    data = resp.json()["data"]
    assert data["status"] == "disponible"
    print("test_table_available_after_payment PASSED")

# 14. GET /api/orders/history: Obtener el historial de pedidos pagados.
def test_get_paid_orders_history():
    resp = requests.get(f"{ORDERS_URL}/history", headers=auth_header(waiter_token))
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "success"
    assert any(order["id"] == created_order_id for order in data["data"])
    print("test_get_paid_orders_history PASSED")

# 15. GET /api/orders/table/{table_id}: Obtener el pedido activo de una mesa específica.
def test_get_active_order_by_table():
    # Crear nueva mesa y pedido
    payload = {"id": 3002, "number": 21, "status": "disponible", "color": "azul"}
    resp = requests.post(f"{TABLES_URL}/create", json=payload, headers=auth_header(admin_token))
    assert resp.status_code in [200, 201]
    table_id = resp.json()["data"]["id"]
    payload = {"table_id": table_id}
    resp = requests.post(f"{ORDERS_URL}", json=payload, headers=auth_header(waiter_token))
    assert resp.status_code in [200, 201]
    order_id = resp.json()["data"]["id"]
    # Obtener pedido activo
    resp = requests.get(f"{ORDERS_URL}/table/{table_id}", headers=auth_header(waiter_token))
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "success"
    assert data["data"]["id"] == order_id
    print("test_get_active_order_by_table PASSED")

# 16. GET /api/orders/table/{table_id}: Intentar obtener el pedido de una mesa que no tiene pedido activo.
def test_get_order_by_table_no_active():
    # Crear mesa sin pedido
    payload = {"id": 3003, "number": 22, "status": "disponible", "color": "azul"}
    resp = requests.post(f"{TABLES_URL}/create", json=payload, headers=auth_header(admin_token))
    assert resp.status_code in [200, 201]
    table_id = resp.json()["data"]["id"]
    resp = requests.get(f"{ORDERS_URL}/table/{table_id}", headers=auth_header(waiter_token))
    assert resp.status_code == 404
    print("test_get_order_by_table_no_active PASSED")
