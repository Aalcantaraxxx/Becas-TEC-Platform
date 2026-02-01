const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, 
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// --- RECURSOS VISUALES (URLs Públicas Oficiales) ---
// Usamos enlaces externos porque los correos no pueden leer archivos locales
const LOGO_BECAS = "https://brand.tec.mx/sites/default/files/2022-06/Logotipo_Tec_de_Monterrey_azul.png"; // Logo Institucional
const LOGO_SAT = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/SAT_logo.png/640px-SAT_logo.png"; // Logo SAT
const LOGO_TECMILENIO = "https://javier.rodriguez.org.mx/itesm/2014/tecmilenio.png";
const LOGO_TECSALUD = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/TecSalud_logo.png/320px-TecSalud_logo.png";

// Estilos Base (Inline CSS para compatibilidad Gmail/Outlook)
const styles = {
    container: 'font-family: Helvetica, Arial, sans-serif; max-width: 640px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;',
    header: 'background-color: #ffffff; padding: 20px 40px; border-bottom: 3px solid #0036A0; text-align: left;',
    headerSat: 'background-color: #f8f9fa; padding: 20px 40px; border-bottom: 1px solid #e5e7eb; display: flex; align-items: center; justify-content: space-between;',
    body: 'padding: 40px;',
    footer: 'background-color: #F3F4F6; padding: 30px 40px; text-align: center; border-top: 1px solid #E5E7EB;',
    btn: 'background-color: #0036A0; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 4px; font-weight: bold; display: inline-block; font-size: 16px; margin: 20px 0;',
    label: 'color: #6B7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: bold;',
    value: 'color: #111827; font-size: 16px; font-weight: 500; margin-bottom: 15px;',
    tableHeader: 'background-color: #F3F4F6; color: #374151; font-weight: bold; font-size: 12px; padding: 10px;',
    tableCell: 'padding: 12px 10px; border-bottom: 1px solid #E5E7EB; font-size: 13px; color: #4B5563;',
    footerLogos: 'height: 30px; margin: 0 15px; opacity: 0.6; filter: grayscale(100%); vertical-align: middle;'
};

// --- 1. CONFIRMACIÓN AL DONANTE ---
const sendDonorConfirmation = async (donorEmail, donorName, amount, orderId) => {
    const html = `
    <!DOCTYPE html>
    <html>
    <body style="margin:0; padding:20px; background-color:#F3F4F6;">
        <div style="${styles.container}">
            
            <div style="${styles.header}">
                <table width="100%">
                    <tr>
                        <td align="left">
                            <img src="${LOGO_BECAS}" alt="Tecnológico de Monterrey" height="50" style="display:block;">
                        </td>
                        <td align="right" style="color: #0036A0; font-weight: bold; font-size: 14px;">
                            DONATIVOS
                        </td>
                    </tr>
                </table>
            </div>

            <div style="${styles.body}">
                <h1 style="color: #111827; font-size: 26px; margin: 0 0 15px 0;">¡Gracias, ${donorName}!</h1>
                <p style="color: #4B5563; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                    Tu generosidad impulsa el futuro educativo de miles de estudiantes. Hemos procesado tu donación exitosamente.
                </p>

                <div style="background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 8px; padding: 25px;">
                    <div style="margin-bottom: 5px; ${styles.label}">MONTO TOTAL</div>
                    <div style="font-size: 32px; font-weight: 800; color: #0036A0; margin-bottom: 20px;">$${amount.toLocaleString('en-US')} MXN</div>
                    
                    <table width="100%">
                        <tr>
                            <td width="50%">
                                <div style="${styles.label}">REFERENCIA</div>
                                <div style="font-family: monospace; font-size: 14px; color: #374151;">${orderId.substring(0, 18)}...</div>
                            </td>
                            <td width="50%">
                                <div style="${styles.label}">FECHA</div>
                                <div style="font-size: 14px; color: #374151;">${new Date().toLocaleDateString('es-MX')}</div>
                            </td>
                        </tr>
                    </table>
                </div>

                <div style="text-align: center; margin-top: 35px;">
                    <a href="http://localhost:5173" style="${styles.btn}">Descargar Certificados</a>
                    <p style="color: #9CA3AF; font-size: 12px; margin-top: 10px;">Enlace seguro a la plataforma Becas Tec</p>
                </div>
            </div>

            <div style="${styles.footer}">
                <p style="margin-bottom: 20px; font-size: 10px; color: #9CA3AF; text-transform: uppercase; letter-spacing: 1px;">Una iniciativa de</p>
                <div>
                    <img src="${LOGO_BECAS}" style="${styles.footerLogos}">
                    <img src="${LOGO_TECMILENIO}" style="${styles.footerLogos}">
                    <img src="${LOGO_TECSALUD}" style="${styles.footerLogos}">
                </div>
                <p style="margin-top: 20px; font-size: 11px; color: #D1D5DB;">
                    © 2026 Tecnológico de Monterrey. Todos los derechos reservados.<br>
                    Este correo fue enviado automáticamente por el sistema de donaciones.
                </p>
            </div>
        </div>
    </body>
    </html>`;

    await transporter.sendMail({ from: '"Becas Tec" <notifications@protesispiernas.com>', to: donorEmail, subject: 'Confirmación de Donativo', html });
};

// --- 2. CORREO AL BENEFICIARIO (Con Mensaje Real) ---
const sendBeneficiaryNotification = async (email, name, donorName, dedication) => {
    const html = `
    <!DOCTYPE html>
    <html>
    <body style="margin:0; padding:20px; background-color:#F3F4F6;">
        <div style="${styles.container}">
            
            <div style="${styles.header}">
                <img src="${LOGO_BECAS}" alt="Becas Tec" height="45">
            </div>

            <div style="background-color: #0036A0; padding: 40px 30px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px;">¡Felicidades, ${name}!</h1>
                <p style="color: #BFDBFE; margin-top: 10px; font-size: 16px;">Has recibido un reconocimiento especial.</p>
            </div>

            <div style="${styles.body}">
                <p style="color: #4B5563; font-size: 16px; text-align: center; margin-bottom: 30px;">
                    <strong>${donorName}</strong> ha realizado una donación en tu nombre al programa de Líderes del Mañana, celebrando tu esfuerzo.
                </p>

                <div style="background-color: #FFFBEB; border-left: 4px solid #D97706; padding: 25px; margin-bottom: 30px;">
                    <p style="margin: 0; color: #92400E; font-family: 'Times New Roman', serif; font-size: 20px; font-style: italic; text-align: center;">
                        "${dedication || 'Sigue inspirando a los demás con tu talento.'}"
                    </p>
                    <div style="margin-top: 15px; text-align: center; font-size: 11px; color: #B45309; font-weight: bold; text-transform: uppercase;">
                        — MENSAJE DEL DONANTE
                    </div>
                </div>

                <div style="text-align: center;">
                    <a href="http://localhost:5173" style="${styles.btn}">Ver mi Certificado Digital</a>
                </div>
            </div>

            <div style="${styles.footer}">
                <div>
                    <img src="${LOGO_BECAS}" style="${styles.footerLogos}">
                    <img src="${LOGO_TECMILENIO}" style="${styles.footerLogos}">
                </div>
                <p style="margin-top: 15px; font-size: 11px; color: #9CA3AF;">Estás recibiendo este correo porque alguien quiso reconocer tu trayectoria.</p>
            </div>
        </div>
    </body>
    </html>`;

    await transporter.sendMail({ from: '"Becas Tec" <notifications@protesispiernas.com>', to: email, subject: `🎁 ${donorName} te envió un mensaje`, html });
};

// --- 3. CORREO CFDI (SIMULACIÓN SAT REALISTA) ---
const sendInvoiceRequestNotification = async (email, fiscalData, amount, orderId) => {
    // Cálculos Reales
    const subtotal = amount / 1.16;
    const iva = amount - subtotal;
    const fecha = new Date().toISOString();
    
    // Cadena Original Simulada (Datos Reales)
    const cadenaOriginal = `||1.1|${orderId}|${fecha}|SAT970701NN3|${fiscalData.rfc}|${fiscalData.razon}|${amount.toFixed(2)}|MXN|I|01||`;

    const html = `
    <!DOCTYPE html>
    <html>
    <body style="margin:0; padding:20px; background-color:#E5E7EB;">
        <div style="${styles.container}; max-width: 700px;">
            
            <div style="padding: 20px 40px; border-bottom: 1px solid #E5E7EB; background: white;">
                <table width="100%">
                    <tr>
                        <td>
                            <img src="${LOGO_BECAS}" height="40">
                            <span style="font-size: 20px; color: #D1D5DB; margin: 0 10px;">|</span>
                            <img src="${LOGO_SAT}" height="30" style="vertical-align: middle;">
                        </td>
                        <td align="right" style="font-size: 12px; color: #6B7280;">
                            <strong>COMPROBANTE FISCAL DIGITAL</strong><br>
                            Folio: ${orderId.substring(0,8).toUpperCase()}
                        </td>
                    </tr>
                </table>
            </div>

            <div style="padding: 40px; background: white;">
                <p style="font-size: 14px; color: #374151; margin-bottom: 25px;">
                    Estimado contribuyente, por medio del presente le hacemos entrega de su factura electrónica (CFDI) correspondiente a su donativo.
                </p>

                <table width="100%" cellspacing="0" cellpadding="0" style="border: 1px solid #E5E7EB; margin-bottom: 30px;">
                    <tr style="background: #F9FAFB;">
                        <td colspan="2" style="padding: 10px 15px; border-bottom: 1px solid #E5E7EB; font-weight: bold; font-size: 13px; color: #111827;">EMISOR Y RECEPTOR</td>
                    </tr>
                    <tr>
                        <td width="50%" style="padding: 15px; border-right: 1px solid #E5E7EB;">
                            <div style="${styles.label}">EMISOR</div>
                            <div style="font-weight: bold; font-size: 13px;">INSTITUTO TECNOLÓGICO Y DE ESTUDIOS SUPERIORES DE MONTERREY</div>
                            <div style="font-size: 12px; color: #6B7280;">ITE4302154J2</div>
                        </td>
                        <td width="50%" style="padding: 15px;">
                            <div style="${styles.label}">RECEPTOR</div>
                            <div style="font-weight: bold; font-size: 13px;">${fiscalData.razon.toUpperCase()}</div>
                            <div style="font-size: 12px; color: #6B7280;">${fiscalData.rfc.toUpperCase()}</div>
                            <div style="font-size: 11px; color: #9CA3AF; margin-top: 4px;">Uso CFDI: G03 - Gastos en general</div>
                        </td>
                    </tr>
                </table>

                <table width="100%" cellspacing="0" cellpadding="0" style="border: 1px solid #E5E7EB; margin-bottom: 30px;">
                    <thead>
                        <tr style="background: #0036A0; color: white;">
                            <th align="left" style="padding: 10px; font-size: 12px;">Concepto</th>
                            <th align="right" style="padding: 10px; font-size: 12px;">Importe</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="${styles.tableCell}">Donativo para fines educativos</td>
                            <td align="right" style="${styles.tableCell}">$${subtotal.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                        </tr>
                        <tr>
                            <td align="right" style="padding: 10px; font-weight: bold; font-size: 12px; color: #374151;">Subtotal:</td>
                            <td align="right" style="padding: 10px; font-size: 12px; color: #374151;">$${subtotal.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                        </tr>
                        <tr>
                            <td align="right" style="padding: 5px 10px; font-weight: bold; font-size: 12px; color: #374151;">IVA (16%):</td>
                            <td align="right" style="padding: 5px 10px; font-size: 12px; color: #374151;">$${iva.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                        </tr>
                        <tr style="background: #F3F4F6;">
                            <td align="right" style="padding: 10px; font-weight: bold; font-size: 14px; color: #0036A0;">TOTAL:</td>
                            <td align="right" style="padding: 10px; font-weight: bold; font-size: 14px; color: #0036A0;">$${amount.toLocaleString('en-US', {minimumFractionDigits: 2})} MXN</td>
                        </tr>
                    </tbody>
                </table>

                <div style="background-color: #F8FAFC; padding: 15px; border: 1px dashed #D1D5DB; word-break: break-all; font-family: monospace; font-size: 9px; color: #6B7280;">
                    ${cadenaOriginal}
                </div>
                <p style="font-size: 10px; color: #9CA3AF; text-align: center; margin-top: 5px;">Este documento es una representación impresa de un CFDI v4.0</p>
            </div>
        </div>
    </body>
    </html>`;

    // XML Falso pero con datos reales incrustados
    const fakeXML = `<?xml version="1.0" encoding="UTF-8"?><cfdi:Comprobante Total="${amount.toFixed(2)}" Moneda="MXN" Fecha="${new Date().toISOString()}" Sello="...firma_digital..."><cfdi:Emisor Rfc="ITE4302154J2" Nombre="TECNOLOGICO DE MONTERREY"/><cfdi:Receptor Rfc="${fiscalData.rfc}" Nombre="${fiscalData.razon}"/></cfdi:Comprobante>`;

    await transporter.sendMail({
        from: '"Facturación Electrónica" <notifications@protesispiernas.com>',
        to: email,
        subject: `Factura ${orderId.substring(0,6)} - Envío de CFDI`,
        html,
        attachments: [{ filename: `F-${orderId.substring(0,8)}.xml`, content: fakeXML, contentType: 'text/xml' }]
    });
};

module.exports = { sendDonorConfirmation, sendBeneficiaryNotification, sendInvoiceRequestNotification };