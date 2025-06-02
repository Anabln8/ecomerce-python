import sqlite3
from sqlite3 import Connection, Cursor

class DBHandler:
    def __init__(self, db_path='ecommerce.db'):
        self.db_path = db_path

    def get_connection(self) -> Connection:
        conn = sqlite3.connect(self.db_path, check_same_thread=False)
        conn.row_factory = sqlite3.Row  # Para devolver diccionarios
        return conn

    def create_tables(self):
        with open('database/schema.sql', 'r', encoding='utf-8') as f:
            schema_sql = f.read()
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.executescript(schema_sql)
            conn.commit()

    def execute_query(self, query, params=()):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, params)
            conn.commit()
            return cursor

    def fetch_one(self, query, params=()):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, params)
            return cursor.fetchone()

    def fetch_all(self, query, params=()):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, params)
            return cursor.fetchall()

    # Métodos específicos ejemplo: Usuarios

    def create_user(self, name, email, hashed_password, role='user'):
        query = '''
            INSERT INTO users (name, email, password_hash, role)
            VALUES (?, ?, ?, ?)
        '''
        self.execute_query(query, (name, email, hashed_password, role))

    def get_user_by_email(self, email):
        query = 'SELECT * FROM users WHERE email = ?'
        return self.fetch_one(query, (email,))

    def update_stock(self, product_id, new_stock):
        query = 'UPDATE products SET stock = ? WHERE id = ?'
        self.execute_query(query, (new_stock, product_id))

    # Puedes agregar más métodos aquí para productos y órdenes
