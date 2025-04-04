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
*Olivenders es una plataforma web donde los magos pueden comprar, vender y alquilar varitas mágicas de manera fácil y segura. Cada transacción permite valoraciones entre los usuarios, ayudando a construir una comunidad de confianza. Ya sea en la web o a través de nuestra app móvil, Olivenders te ayuda a encontrar la varita perfecta, sin importar en qué rincón del mundo mágico te encuentres.*

### Modelo
*Nota*: incluir un link con la imagen de un modelo, puede ser modelo de dominio, diagrama de clases, DER. Si lo prefieren pueden utilizar diagramas con [Mermaid](https://mermaid.js.org) en lugar de imágenes.

**Faltan cosas, link para modificar -->**
https://drive.google.com/file/d/1aHBuIdu2SuQJKwL8StDEmREH56euT88r/view?usp=sharing

![imagen del modelo](./DER%20Inicial.png)

## Alcance Funcional 

### Alcance Mínimo

Regularidad
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Mago<br>2. CRUD Varita<br>3. CRUD Compra<br>4. CRUD Calificación|
|CRUD dependiente |1. CRUD Calificación {depende de} CRUD Compra<br>2. CRUD Compra {depende de} CRUD Varita|
|Listado<br>+<br>detalle (nec. 2)| 1. Listado de varitas filtrado por tipo de varita, madera, nucleo y demas propiedades generales=> detalle CRUD Varita<br> 2. Listado de fabricantes, muestra datos del facbricante y los tipos de varitas que ha fabricado => detalle CRUD Fabricante|
|CUU/Epic|1. Comprar una varita<br>2. Calificar varita en base a compra|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Pregunta Cuestionario<br> 2. CRUD Clave Token<br> 3. CRUD Madera<br> 4. CRUD Núcleo|
|CUU/Epic |1. Contestar cuestionario<br>2. Comprar varita en base a resultado de cuestionario|
