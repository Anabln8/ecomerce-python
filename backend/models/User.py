import re
from werkzeug.security import generate_password_hash, check_password_hash
from database.db_handler import DBHandler
from utils.validators import is_valid_email

db = DBHandler()

class User:
    def __init__(self, name, email, password=None, password_hash=None, role='user', id=None, created_at=None):
        if not (2 <= len(name) <= 50):
            raise ValueError("Nombre debe tener entre 2 y 50 caracteres")
        if not is_valid_email(email):
            raise ValueError("Email inválido")

        if password:
            if len(password) < 8:
                raise ValueError("La contraseña debe tener al menos 8 caracteres")
            self.password_hash = self.hash_password(password)
        elif password_hash:
            self.password_hash = password_hash
        else:
            raise ValueError("Debe proporcionarse password o password_hash")

        self.id = id
        self.name = name
        self.email = email
        self.role = role
        self.created_at = created_at

    @staticmethod
    def hash_password(password):
        return generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "created_at": self.created_at
        }

    def save(self):
        if self.id:
            # Actualizar usuario si existe
            query = """
                UPDATE users SET name=?, email=?, password_hash=?, role=? WHERE id=?
            """
            db.execute_query(query, (self.name, self.email, self.password_hash, self.role, self.id))
        else:
            # Insertar nuevo usuario
            query = """
                INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)
            """
            cursor = db.execute_query(query, (self.name, self.email, self.password_hash, self.role))
            self.id = cursor.lastrowid

    @staticmethod
    def find_by_email(email):
        query = "SELECT * FROM users WHERE email = ?"
        row = db.fetch_one(query, (email,))
        if row:
            return User(
                id=row["id"],
                name=row["name"],
                email=row["email"],
                password_hash=row["password_hash"],  # Pasamos el hash directamente
                role=row["role"],
                created_at=row["created_at"]
            )
        return None
