# Biblioteca API REST

Este proyecto consiste en una API REST desarrollada para gestionar una biblioteca de libros. Proporciona las operaciones básicas de un CRUD (Crear, Leer, Actualizar y Eliminar) inicialmente en memoria y, posteriormente, utilizando MongoDB con el ODM Mongoose.

## Funcionalidades

La API permite las siguientes operaciones:

1. **Crear**: Añadir un nuevo libro con los campos:
   - Título
   - Autor
   - ISBN (Identificador único)
   - Precio
   - URL de la portada
2. **Leer**: Mostrar una lista de todos los libros en la biblioteca.
3. **Buscar**: Buscar un libro por su ISBN y mostrar sus datos.
4. **Actualizar**: Modificar los datos de un libro existente utilizando su ISBN.
5. **Eliminar**: Borrar un libro de la biblioteca utilizando su ISBN.

## Especificaciones técnicas

- Los libros se almacenan inicialmente en un array llamado `biblioteca`.
- El campo `ISBN` se usa como identificador único para las operaciones de búsqueda, actualización o eliminación.

## Herramientas necesarias

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Postman](https://www.postman.com/) (opcional)
- [Swagger](https://swagger.io/)
- [MongoDB](https://www.mongodb.com/) y [Mongoose](https://mongoosejs.com/)

## Instalación y ejecución

1. Clona este repositorio:
   ```bash
   git clone https://github.com/tu-usuario/biblioteca-api.git

2. Instala las dependencias:
   ```bash
   npm install

3. Ejecuta el servidor:
   ```bash
   npm start

4. Accede a Swagger para probar las APIs:
   ```bash
   http://localhost:3000/api-docs
    