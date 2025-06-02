from database.db_handler import DBHandler

def seed_products():
    db = DBHandler()

    # Productos de ejemplo
    products = [
        {
            "name": "Producto A",
            "description": "Descripción del producto A",
            "price": 12.5,
            "stock": 10,
            "category": "Cat1",
            "image_url": "/default-product.png",
            "is_active": 1
        },
        {
            "name": "Producto B",
            "description": "Descripción del producto B",
            "price": 15,
            "stock": 5,
            "category": "Cat2",
            "image_url": "/default-product.png",
            "is_active": 1
        },
        {
            "name": "Producto C",
            "description": "Descripción del producto C",
            "price": 20,
            "stock": 8,
            "category": "Cat1",
            "image_url": "/default-product.png",
            "is_active": 1
        },
        {
            "name": "Producto D",
            "description": "Descripción del producto D",
            "price": 7.5,
            "stock": 15,
            "category": "Cat3",
            "image_url": "/default-product.png",
            "is_active": 1
        }
    ]

    for p in products:
        try:
            query = '''
            INSERT INTO products (name, description, price, stock, category, image_url, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            '''
            db.execute_query(query, (
                p['name'], p['description'], p['price'], p['stock'], p['category'], p['image_url'], p['is_active']
            ))
            print(f"Producto '{p['name']}' insertado correctamente.")
        except Exception as e:
            print(f"Error insertando producto '{p['name']}': {e}")

if __name__ == '__main__':
    seed_products()
