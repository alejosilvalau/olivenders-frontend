# Propuesta TP DSW

## Grupo
### Integrantes
* 46155 - Avila, Marisol
* 39749 - Egea, Lucas
* 52889 - Cisneros, Juan Pablo
* 47868 - Silva, Alejo Lautaro

### Repositorios
* [frontend app](https://github.com/alejosilvalau/olivenders-frontend)
* [backend app](https://github.com/alejosilvalau/olivenders-backend)


## Tema
### Descripción
*Olivenders es una plataforma web donde magos pueden comprar, vender y alquilar varitas mágicas de forma sencilla y segura. Cada transacción permite a los usuarios valorarse entre sí, creando un sistema de reputación confiable. Disponible en la web y en aplicaciones móviles, Olivenders te ayuda a encontrar la varita ideal estés donde estés.*

### Modelo
*Nota*: incluir un link con la imagen de un modelo, puede ser modelo de dominio, diagrama de clases, DER. Si lo prefieren pueden utilizar diagramas con [Mermaid](https://mermaid.js.org) en lugar de imágenes.

**Faltan cosas, link para modificar -->**
https://drive.google.com/file/d/1aHBuIdu2SuQJKwL8StDEmREH56euT88r/view?usp=sharing

![imagen del modelo](./DER%20Inicial.png)

## Alcance Funcional 

### Alcance Mínimo

|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Tipo Varita<br>2. CRUD Fabricante<br>3. CRUD Localidad|
|CRUD dependiente|1. CRUD Varita {depende de} CRUD Tipo Varita<br>2. CRUD Cliente {depende de} CRUD Localidad|
|Listado<br>+<br>detalle| 1. Listado de varitas filtrado por tipo de varita, madera, nucleo y demas propiedades generales=> detalle CRUD Varita<br> 2. Listado de fabricantes, muestra datos del facbricante y los tipos de varitas que ha fabricado => detalle CRUD Fabricante
|CUU/Epic|1. Vender una varita<br>2. Alquilar una varita<br>3.Consultar disponibilidad.


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Tipo Habitacion<br>2. CRUD Servicio<br>3. CRUD Localidad<br>4. CRUD Provincia<br>5. CRUD Habitación<br>6. CRUD Empleado<br>7. CRUD Cliente|
|CUU/Epic|1. Reservar una habitación para la estadía<br>2. Realizar el check-in de una reserva<br>3. Realizar el check-out y facturación de estadía y servicios|


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados |1. Estadía del día filtrado por fecha muestra, cliente, habitaciones y estado <br>2. Reservas filtradas por cliente muestra datos del cliente y de cada reserve fechas, estado cantidad de habitaciones y huespedes|
|CUU/Epic|1. Consumir servicios<br>2. Cancelación de reserva|
|Otros|1. Envío de recordatorio de reserva por email|
