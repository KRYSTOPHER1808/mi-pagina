const express = require('express');
const bodyParser = require('body-parser');
const { Connection, Request } = require('tedious');

// Configuración del servidor
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de la base de datos
const config = {
    server: 'DESKTOP-P9BAHCO',  // Nombre del servidor
    authentication: {
        type: 'default',
        options: {
            userName: "ejemplo",  // Nombre de usuario
            password: "ejemplo123@123"  // Contraseña
        }
    },
    options: {
        port: 1433,  // Puerto de conexión
        database: 'EvaluaRendimiento',  // Nombre de la base de datos
        trustServerCertificate: true  // Confianza en el certificado del servidor
    }
};

const connection = new Connection(config);

connection.connect();

connection.on('connect', (err) => {
    if (err) {
        console.log("Error al conectarse a la base de datos");
        throw err;
    }
    console.log("Conectado a la base de datos");
});

app.get('/cursos', (req, res) => {
    const correo = req.query.correo; // El correo del estudiante se pasará como parámetro

    const query = `
        SELECT Cursos.codigoCurso, Cursos.nombreCurso, Cursos.aula, Cursos.seccion
        FROM Usuarios
        INNER JOIN Cursos ON Usuarios.idUsuario = Cursos.idProfesor
        WHERE Usuarios.correo = '${correo}'
    `;

    const request = new Request(query, (err, rowCount, rows) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err);
            res.status(500).send('Error al ejecutar la consulta');
        } else {
            let cursos = [];

            rows.forEach((columns) => {
                let curso = {};
                columns.forEach((column) => {
                    curso[column.metadata.colName] = column.value;
                });
                cursos.push(curso);
            });

            res.json(cursos); // Devolver los cursos en formato JSON
        }
    });

    connection.execSql(request);
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});


// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

