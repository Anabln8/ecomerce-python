from database.db_handler import DBHandler
from datetime import datetime

db = DBHandler()

class Order:
    def __init__(self, user_id, shipping_address, status='pending', id=None, created_at=None):
        self.id = id
        self.user_id = user_id
        self.shipping_address = shipping_address
        self.status = status
        self.created_at = created_at or datetime.utcnow().isoformat()
        self.items = []  # Lista de tuplas (product, quantity)

    def add_item(self, product, quantity):
        if quantity <= 0:
            raise ValueError("Cantidad debe ser positiva")
        self.items.append((product, quantity))

    def calculate_total(self):
        total = sum(product.price * quantity for product, quantity in self.items)
        return round(total * 1.16, 2)  # IVA 16%

    def process_order(self):
        # Verificar stock y descontar
        for product, quantity in self.items:
            if product.stock < quantity:
                raise ValueError(f"Stock insuficiente para el producto {product.name}")
            product.update_stock(-quantity)
        self.status = 'confirmed'

    def save(self):
        if not self.id:
            query = """
                INSERT INTO orders (user_id, shipping_address, status, created_at, total)
                VALUES (?, ?, ?, ?, ?)
            """
            total = self.calculate_total()
            cursor = db.execute_query(query, (self.user_id, self.shipping_address, self.status, self.created_at, total))
            self.id = cursor.lastrowid

            # Guardar items
            for product, quantity in self.items:
                sub_total = round(product.price * quantity, 2)
                query_item = """
                    INSERT INTO order_items (order_id, product_id, quantity, price, subtotal)
                    VALUES (?, ?, ?, ?, ?)
                """
                db.execute_query(query_item, (self.id, product.id, quantity, product.price, sub_total))
        else:
            # Aquí podrías implementar actualizar orden si es necesario
            pass

    @staticmethod
    def find_by_user(user_id):
        query = "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC"
        rows = db.fetch_all(query, (user_id,))
        orders = []
        for row in rows:
            order = Order(
                id=row["id"],
                user_id=row["user_id"],
                shipping_address=row["shipping_address"],
                status=row["status"],
                created_at=row["created_at"]
            )
            # Cargar items
            order.items = order.get_items()
            orders.append(order)
        return orders

    @staticmethod
    def find_by_id(order_id):
        query = "SELECT * FROM orders WHERE id = ?"
        row = db.fetch_one(query, (order_id,))
        if not row:
            return None
        order = Order(
            id=row["id"],
            user_id=row["user_id"],
            shipping_address=row["shipping_address"],
            status=row["status"],
            created_at=row["created_at"]
        )
        order.items = order.get_items()
        return order

    def get_items(self):
        query = """
            SELECT oi.quantity, oi.price, oi.subtotal, p.id, p.name, p.description, p.category, p.image_url
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = ?
        """
        rows = db.fetch_all(query, (self.id,))
        items = []
        for row in rows:
            product = {
                "id": row["id"],
                "name": row["name"],
                "description": row["description"],
                "category": row["category"],
                "image_url": row["image_url"]
            }
            items.append({
                "product": product,
                "quantity": row["quantity"],
                "price": row["price"],
                "subtotal": row["subtotal"]
            })
        return items

    def get_order_summary(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "shipping_address": self.shipping_address,
            "status": self.status,
            "created_at": self.created_at,
            "total": self.calculate_total(),
            "items": self.get_items()
        }
