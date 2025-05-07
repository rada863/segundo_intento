// server.js - Servidor Node.js para manejar el formulario de contacto

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    tls: {
        rejectUnauthorized: false // Solo para desarrollo, en producción debería ser true
    }
});

// Ruta para manejar el formulario de contacto
app.post('/enviar-mensaje', async (req, res) => {
    try {
        const { name, email, phone, subject, message, newsletter } = req.body;

        // Validación básica
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ 
                success: false, 
                message: 'Por favor complete todos los campos obligatorios' 
            });
        }

        // Configurar el correo electrónico
        const mailOptions = {
            from: `"Formulario de Contacto" <${process.env.SMTP_USER}>`,
            to: process.env.CONTACT_EMAIL,
            subject: `Nuevo mensaje de contacto: ${subject}`,
            html: `
                <h2>Nuevo mensaje de contacto</h2>
                <p><strong>Nombre:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Teléfono:</strong> ${phone || 'No proporcionado'}</p>
                <p><strong>Asunto:</strong> ${subject}</p>
                <p><strong>Mensaje:</strong></p>
                <p>${message}</p>
                <p><strong>Desea recibir newsletter:</strong> ${newsletter ? 'Sí' : 'No'}</p>
                <br>
                <p>Este mensaje fue enviado desde el formulario de contacto de Hydra Desarrollo de Software.</p>
            `
        };

        // Enviar el correo electrónico
        await transporter.sendMail(mailOptions);

        // Enviar copia al usuario si está suscrito al newsletter
        if (newsletter) {
            const userMailOptions = {
                from: `"Hydra Desarrollo de Software" <${process.env.SMTP_USER}>`,
                to: email,
                subject: 'Gracias por contactarnos',
                html: `
                    <h2>Gracias por contactar con Hydra</h2>
                    <p>Hemos recibido tu mensaje y nos pondremos en contacto contigo pronto.</p>
                    <p><strong>Resumen de tu mensaje:</strong></p>
                    <p>Asunto: ${subject}</p>
                    <p>Mensaje: ${message}</p>
                    <br>
                    <p>También te hemos añadido a nuestra lista de newsletter donde recibirás nuestras últimas noticias y promociones.</p>
                    <p>Si no deseas recibir estas comunicaciones, puedes darte de baja en cualquier momento.</p>
                    <br>
                    <p>Saludos,</p>
                    <p>El equipo de Hydra</p>
                `
            };

            await transporter.sendMail(userMailOptions);
        }

        res.json({ 
            success: true, 
            message: '¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.' 
        });

    } catch (error) {
        console.error('Error al enviar el mensaje:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Ocurrió un error al enviar tu mensaje. Por favor inténtalo de nuevo más tarde.' 
        });
    }
});

// Servir archivos estáticos (tu frontend)
app.use(express.static('public'));

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});