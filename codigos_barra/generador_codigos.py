##### IMPORTACIÓN BARCODE ##### 
from barcode import EAN13
from barcode.writer import ImageWriter
import os


# Metodo para Generar Códigos de barra de 13 digitos

def generar_codigos(usu_rut):
    rut = str(usu_rut)
    rut = ''.join(filter(str.isdigit, rut))
    rut = rut.zfill(12) # para que agrege 0 antes del rut

    nombre_archivo = f"codigosGen_{rut}"
    ruta_completa = os.path.join("media", "codigos_barra", f"{nombre_archivo}")

    barcode = EAN13(rut, writer=ImageWriter()) #Genera la imagen en formato PNG

    barcode.save(ruta_completa)

    return rut