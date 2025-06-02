from database.db_handler import DBHandler
from utils.validators import validate_product_data
import re

db = DBHandler()

class Product:
    def __init__(self, name, description, price, stock, category, image_url, is_active=True, id=None):
        validate_product_data({
            "name": name,
            "price": price,
            "stock": stock,
            "image_url": image_url,
        })

        self.id = id
        self.name = name
        self.description = description
        self.price = price
        self.stock = stock
        self.category = category
        self.image_url = image_url
        self.is_active = is_active

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "price": self.price,
            "stock": self.stock,
            "category": self.category,
            "image_url": self.image_url,
            "is_active": self.is_active
        }

    def save(self):
        if self.id:
            query = """
                UPDATE products SET name=?, description=?, price=?, stock=?, category=?, image_url=?, is_active=?
                WHERE id=?
            """
            db.execute_query(query, (self.name, self.description, self.price, self.stock, self.category, self.image_url, int(self.is_active), self.id))
        else:
            query = """
                INSERT INTO products (name, description, price, stock, category, image_url, is_active)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """
            cursor = db.execute_query(query, (self.name, self.description, self.price, self.stock, self.category, self.image_url, int(self.is_active)))
            self.id = cursor.lastrowid

    @staticmethod
    def find_by_id(product_id):
        query = "SELECT * FROM products WHERE id = ?"
        row = db.fetch_one(query, (product_id,))
        if row:
            return Product(
                id=row["id"],
                name=row["name"],
                description=row["description"],
                price=row["price"],
                stock=row["stock"],
                category=row["category"],
                image_url=row["image_url"],
                is_active=bool(row["is_active"])
            )
        return None

    @staticmethod
    def list_active(max_price=None, page=1, limit=10):
        params = []
        query = "SELECT * FROM products WHERE is_active = 1"
        if max_price:
            query += " AND price <= ?"
            params.append(max_price)

        query += " LIMIT ? OFFSET ?"
        params.extend([limit, (page - 1) * limit])

        rows = db.fetch_all(query, tuple(params))
        return [Product(
            id=row["id"],
            name=row["name"],
            description=row["description"],
            price=row["price"],
            stock=row["stock"],
            category=row["category"],
            image_url=row["image_url"],
            is_active=bool(row["is_active"])
        ) for row in rows]

    def update_stock(self, amount):
        new_stock = self.stock + amount
        if new_stock < 0:
            raise ValueError("Stock no puede ser negativo")
        self.stock = new_stock
        self.save()
