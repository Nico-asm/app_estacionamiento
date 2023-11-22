##### IMPORTACIÓN BARCODE ##### 
from barcode import EAN13
from barcode.writer import ImageWriter



# Metodo para Generar Códigos de barra de 13 digitos

def generar_codigos(usu_rut):
    rut = str(usu_rut)
    rut = ''.join(filter(str.isdigit, rut))
    rut = rut.zfill(13) # para que agrege 0 antes del rut

    nombre_archivo = f"codigosGen_{rut}"
    barcode = EAN13(rut, writer=ImageWriter())

    barcode.save(nombre_archivo)

    return rut