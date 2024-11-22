const express = require("express");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();
app.use(express.json());

let biblioteca = [];

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Biblioteca API",
      version: "1.0.0",
      description: "API para gestionar una biblioteca de libros",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./app.js"], // Archivo donde están los comentarios de Swagger
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * components:
 *   schemas:
 *     Libro:
 *       type: object
 *       required:
 *         - titulo
 *         - autor
 *         - isbn
 *       properties:
 *         titulo:
 *           type: string
 *           description: El título del libro
 *         autor:
 *           type: string
 *           description: El autor del libro
 *         isbn:
 *           type: string
 *           description: El ISBN único del libro
 *         precio:
 *           type: number
 *           description: El precio del libro
 *         url:
 *           type: string
 *           description: URL del libro
 *       example:
 *         titulo: "El Principito"
 *         autor: "Antoine de Saint-Exupéry"
 *         isbn: "123456789"
 *         precio: 19.99
 *         url: "https://example.com/principito"
 */

/**
 * @swagger
 * /biblioteca:
 *   post:
 *     summary: Agrega un nuevo libro a la biblioteca
 *     tags: [Libros]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Libro'
 *     responses:
 *       201:
 *         description: Libro agregado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Libro'
 */
app.post("/biblioteca", (req, res) => {
  const newLibro = {
    titulo: req.body.titulo,
    autor: req.body.autor,
    isbn: req.body.isbn,
    precio: req.body.precio,
    url: req.body.url,
  };
  biblioteca.push(newLibro);
  res.status(201).json(newLibro);
});

/**
 * @swagger
 * /biblioteca:
 *   get:
 *     summary: Obtiene todos los libros de la biblioteca
 *     tags: [Libros]
 *     responses:
 *       200:
 *         description: Lista de libros
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Libro'
 */
app.get("/biblioteca", (req, res) => {
  res.json(biblioteca);
});

/**
 * @swagger
 * /biblioteca/{isbn}:
 *   get:
 *     summary: Obtiene un libro por su ISBN
 *     tags: [Libros]
 *     parameters:
 *       - in: path
 *         name: isbn
 *         schema:
 *           type: string
 *         required: true
 *         description: El ISBN del libro
 *     responses:
 *       200:
 *         description: Libro encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Libro'
 *       404:
 *         description: El libro no fue encontrado
 */
app.get("/biblioteca/:isbn", (req, res) => {
  const libro = biblioteca.find((i) => i.isbn === req.params.isbn);
  if (!libro) return res.status(404).send("No se ha encontrado el libro.");
  res.json(libro);
});

/**
 * @swagger
 * /biblioteca/{isbn}:
 *   put:
 *     summary: Actualiza un libro por su ISBN
 *     tags: [Libros]
 *     parameters:
 *       - in: path
 *         name: isbn
 *         schema:
 *           type: string
 *         required: true
 *         description: El ISBN del libro
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Libro'
 *     responses:
 *       200:
 *         description: Libro actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Libro'
 *       404:
 *         description: El libro no fue encontrado
 */
app.put("/biblioteca/:isbn", (req, res) => {
  const libro = biblioteca.find((i) => i.isbn === req.params.isbn);
  if (!libro) return res.status(404).send("No se ha encontrado el libro.");

  libro.titulo = req.body.titulo;
  libro.autor = req.body.autor;
  libro.precio = req.body.precio;
  libro.url = req.body.url;
  res.json(libro);
});

/**
 * @swagger
 * /biblioteca/{isbn}:
 *   delete:
 *     summary: Elimina un libro por su ISBN
 *     tags: [Libros]
 *     parameters:
 *       - in: path
 *         name: isbn
 *         schema:
 *           type: string
 *         required: true
 *         description: El ISBN del libro
 *     responses:
 *       200:
 *         description: Libro eliminado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Libro'
 *       404:
 *         description: El libro no fue encontrado
 */
app.delete("/biblioteca/:isbn", (req, res) => {
  const libroIndex = biblioteca.findIndex((i) => i.isbn.toString() === req.params.isbn.toString());
  if (libroIndex === -1)
    return res.status(404).send("El libro no fue encontrado.");

  const deletedLibro = biblioteca.splice(libroIndex, 1);
  res.json(deletedLibro[0]);
});

// Iniciar el servidor
app.listen(3000, () => {
  console.log("Servidor corriendo en el puerto 3000");
});
