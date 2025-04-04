# Propuesta TP DSW

## Grupo
### Integrantes
* 46155 - Avila, Marisol
* 39749 - Egea, Lucas
* 52889 - Cisneros, Juan Pablo
* 47868 - Silva, Alejo Lautaro

### Repositorios
* [Frontend App Repo](https://github.com/alejosilvalau/olivenders-frontend)
* [Backend App Repo](https://github.com/alejosilvalau/olivenders-backend)


## Tema
### Descripción
*Olivenders es una plataforma web donde los magos pueden comprar varitas mágicas de manera fácil y segura. Cada transacción permite valoración a las varitas compradas, ayudando a construir una comunidad de confianza. Además, les permite a los magos encontrar su varita perfecta mediante un breve cuestionario. Ya sea desde la versión de escritorio o a través del portal móvil, Olivenders te ayuda a encontrar la varita perfecta, sin importar en qué rincón del mundo mágico te encuentres.*


### Modelo
![Diagrama DER](./DER%20Inicial.png)
Ver diagrama en [Draw.io](https://drive.google.com/file/d/1aHBuIdu2SuQJKwL8StDEmREH56euT88r/view?usp=sharing)

**Nota:** la division de las varitas entre *madera* y *núcleo* es dada por la [wiki de Harry Potter](https://harrypotter.fandom.com/es/wiki/Varita)

## Alcance Funcional 
### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Mago<br>2. CRUD Varita<br>3. CRUD Compra<br>4. CRUD Calificación|
|CRUD dependiente |1. CRUD Compra {depende de} CRUD Mago<br>2. CRUD Calificación {depende de} CRUD Compra|
|Listado<br>+<br>Detalle | 1. Listado de varitas filtrado por madera, núcleo y precio. Muestra madera, núcleo, descripción y precio => detalle muestra longitud y flexibilidadcripción<br> 2. Listado de respuesta de cuestionario donde se muestra fecha de respuesta y nombre, longitud y flexibilidad, madera y nucleo de varita, que redirige a la varita al clickear|
|CUU/Epic|1. Comprar una varita<br>2. Calificar varita en base a compra|

Adicionales para Aprobación Directa:
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Pregunta Cuestionario<br> 2. CRUD Clave Token<br> 3. CRUD Madera<br> 4. CRUD Núcleo|
|CUU/Epic |1. Contestar cuestionario<br>2. Comprar varita en base a resultado de cuestionario|
