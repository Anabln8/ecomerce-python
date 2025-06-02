import re

def is_valid_email(email):
    regex = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return re.match(regex, email) is not None

def validate_product_data(product):
    if not product["name"] or len(product["name"]) < 1:
        raise ValueError("El nombre del producto es obligatorio")
    if product["price"] is None or product["price"] <= 0:
        raise ValueError("El precio debe ser mayor a 0")
    if product["stock"] is None or product["stock"] < 0:
        raise ValueError("El stock no puede ser negativo")
    if product["image_url"]:
        regex_url = r'^https?://.+'
        if not re.match(regex_url, product["image_url"]):
            raise ValueError("URL de imagen inválida")
