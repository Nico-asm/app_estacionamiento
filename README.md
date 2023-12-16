# Aplicación Gestión de estacionamiento con Códigos de barra

## Para iniciar el Proyecto
### 1- Generar un vitualenv
``` 
py -m venv venv
 ```
#### Activar  virtualenv en la ruta
.\/venv/Scripts/activate
### 2- Bajar el Proyecto del repositorio y dejarlo a la altura del venv

### 3- Instalar el requierements para que instale todas las Librerias
``` 
pip install -r requirements.txt
 ```

### 4-Para ejectutar el lector de códigos de barra, es necesario bajar este Script y posteriormente ejecturarlo
    https://github.com/Nico-asm/Script_Scan_Code_bar

### 5- Finalmente conectar con la Base de datos. Cofigura tu BD
    MySQL
    name = db_estacionamiento
    port = 3306


### 6- Iniciar el servidor de Django
``` 
py manage.py runserver
 ```

### 7- instalar servidor node.js 
 ## entrar al client , con cd client, luego instalar 
```
npm i
```
### 8- Iniciar servidor vite, hay que estar posicionado en client
```
npm run dev
```