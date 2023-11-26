import re

#Validador de RUT reales
def validar_rut(rut):
    # Eliminar puntos y guiones
    rut = rut.replace("-", "")

    # Verificar que el RUT tiene el formato correcto
    if not rut[:-1].isdigit():
        return False

    # Obtener el dígito verificador
    digito_verificador = rut[-1].upper()
    if digito_verificador != 'K' and not digito_verificador.isdigit():
        return False

    # Calcular el dígito verificador esperado
    rut_numerico = int(rut[:-1])
    suma = 0
    multiplicador = 2
    for d in reversed(str(rut_numerico)):
        suma += int(d) * multiplicador
        multiplicador = (multiplicador + 1) % 8 or 2

    digito_esperado = str((11 - suma % 11) % 11)

    if digito_esperado == '10':
        digito_esperado = 'K'

    # Comparar el dígito verificador calculado con el proporcionado
    return digito_verificador == digito_esperado




def validar_password(password):
    errors = []

    # Longitud mínima
    if len(password) < 8:
        errors.append("La contraseña debe tener al menos 8 caracteres.")

    # Caracteres especiales
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        errors.append("La contraseña debe contener al menos un carácter especial.")

    # Números
    if not any(char.isdigit() for char in password):
        errors.append("La contraseña debe contener al menos un número.")

    # Mayúsculas y minúsculas
    if not any(char.isupper() for char in password) or not any(char.islower() for char in password):
        errors.append("La contraseña debe contener al menos una letra mayúscula y una letra minúscula.")

    # Evitar palabras comunes
    common_words = ['password', '12345678', 'admin', 'colocolo', 'Admin@123']
    if any(common_word in password.lower() for common_word in common_words):
        errors.append("La contraseña no debe contener palabras comunes.")

    # Si hay errores, devuelve la lista de mensajes de error
    if errors:
        return False, errors
    
    # Si pasa todas las validaciones, la contraseña se considera segura
    return True, None


