// backend/src/services/emailService.js
// VERSIÓN API (CORREGIDA: Solo envía 'attachment' si hay archivos)
require('dotenv').config();

// Configuración
const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
const SENDER_EMAIL = process.env.SMTP_USER || "notifications@protesispiernas.com"; 
const SENDER_NAME = "Becas Tec";

// Helper para enviar usando FETCH
const sendEmailViaApi = async (toEmail, subject, htmlContent, attachments = []) => {
    
    if (!process.env.BREVO_API_KEY) {
        console.error("❌ FALTA LA BREVO_API_KEY en las variables de entorno.");
        return;
    }

    // 1. Creamos el cuerpo BÁSICO (Sin attachments todavía)
    const body = {
        sender: { name: SENDER_NAME, email: SENDER_EMAIL },
        to: [{ email: toEmail }],
        subject: subject,
        htmlContent: htmlContent
    };

    // 2. Lógica Inteligente: Solo agregamos 'attachment' si el array NO está vacío
    if (attachments && attachments.length > 0) {
        body.attachment = attachments;
    }

    try {
        const response = await fetch(BREVO_API_URL, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': process.env.BREVO_API_KEY,
                'content-type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error API Brevo: ${JSON.stringify(errorData)}`);
        }

        console.log(`✅ Correo API enviado a: ${toEmail}`);
    } catch (error) {
        console.error(`❌ FALLO ENVÍO API a ${toEmail}:`, error.message);
    }
};

// --- RECURSOS VISUALES ---
const DOMINIO_WEB = "https://becas.tec.protesispiernas.com"; 
const LOGO_BECAS = `${DOMINIO_WEB}/logos/logo_tec.png`; 
const LOGO_SAT = `${DOMINIO_WEB}/logos/logo_SAT.png`;
const LOGO_TECMILENIO = `${DOMINIO_WEB}/logos/logo_tecmilenio.png`;
const LOGO_TECSALUD = `${DOMINIO_WEB}/logos/logo_tecsalud.png`;

// Estilos Base
const styles = {
    container: 'font-family: Helvetica, Arial, sans-serif; max-width: 640px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;',
    header: 'background-color: #ffffff; padding: 20px 40px; border-bottom: 3px solid #0036A0; text-align: left;',
    body: 'padding: 40px;',
    footer: 'background-color: #F3F4F6; padding: 30px 40px; text-align: center; border-top: 1px solid #E5E7EB;',
    btn: 'background-color: #0036A0; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 4px; font-weight: bold; display: inline-block; font-size: 16px; margin: 20px 0;',
    label: 'color: #6B7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: bold;',
    footerLogos: 'height: 30px; margin: 0 15px; opacity: 0.6; filter: grayscale(100%); vertical-align: middle;',
    tableCell: 'padding: 12px 10px; border-bottom: 1px solid #E5E7EB; font-size: 13px; color: #4B5563;'
};

// --- 1. CONFIRMACIÓN AL DONANTE ---
const sendDonorConfirmation = async (donorEmail, donorName, amount, orderId) => {
    const html = `
    <!DOCTYPE html>
    <html>
    <body style="margin:0; padding:20px; background-color:#F3F4F6;">
        <div style="${styles.container}">
            <div style="${styles.header}"><img src="${LOGO_BECAS}" alt="Tec" height="50" style="display:block;"></div>
            <div style="${styles.body}">
                <h1 style="color: #111827; font-size: 26px;">¡Gracias, ${donorName}!</h1>
                <p style="color: #4B5563; font-size: 16px;">Hemos procesado tu donación exitosamente.</p>
                <div style="background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 8px; padding: 25px; margin-top: 20px;">
                    <div style="${styles.label}">MONTO TOTAL</div>
                    <div style="font-size: 32px; font-weight: 800; color: #0036A0;">$${amount.toLocaleString('en-US')} MXN</div>
                    <div style="margin-top: 10px; font-size: 12px; color: #6B7280;">Ref: ${orderId}</div>
                </div>
                <div style="text-align: center; margin-top: 30px;"><a href="${DOMINIO_WEB}" style="${styles.btn}">Ir a la Plataforma</a></div>
            </div>
            <div style="${styles.footer}"><img src="${LOGO_BECAS}" style="${styles.footerLogos}"></div>
        </div>
    </body></html>`;

    await sendEmailViaApi(donorEmail, 'Confirmación de Donativo', html);
};

// --- 2. CORREO AL BENEFICIARIO ---
const sendBeneficiaryNotification = async (email, name, donorName, dedication) => {
    const html = `
    <!DOCTYPE html>
    <html>
    <body style="margin:0; padding:20px; background-color:#F3F4F6;">
        <div style="${styles.container}">
            <div style="${styles.header}"><img src="${LOGO_BECAS}" height="45"></div>
            <div style="background-color: #0036A0; padding: 40px 30px; text-align: center;">
                <h1 style="color: white; font-size: 24px;">¡Felicidades, ${name}!</h1>
            </div>
            <div style="${styles.body}">
                <p style="color: #4B5563; font-size: 16px; text-align: center;"><strong>${donorName}</strong> ha realizado una donación en tu nombre.</p>
                <div style="background-color: #FFFBEB; border-left: 4px solid #D97706; padding: 25px; margin: 30px 0;">
                    <p style="color: #92400E; font-style: italic; text-align: center;">"${dedication || 'Sigue inspirando.'}"</p>
                </div>
                <div style="text-align: center;"><a href="${DOMINIO_WEB}" style="${styles.btn}">Ver mi Certificado</a></div>
            </div>
            <div style="${styles.footer}"><img src="${LOGO_BECAS}" style="${styles.footerLogos}"></div>
        </div>
    </body></html>`;

    await sendEmailViaApi(email, `🎁 ${donorName} te envió un mensaje`, html);
};

// --- 3. CORREO CFDI ---
const sendInvoiceRequestNotification = async (email, fiscalData, amount, orderId) => {
    // Generar XML Falso
    const fakeXML = `<?xml version="1.0" encoding="UTF-8"?><cfdi:Comprobante Total="${amount.toFixed(2)}" Moneda="MXN" Fecha="${new Date().toISOString()}" UsoCFDI="${fiscalData.usoCfdi}"><cfdi:Emisor Rfc="ITE4302154J2"/><cfdi:Receptor Rfc="${fiscalData.rfc}" Nombre="${fiscalData.razon}"/></cfdi:Comprobante>`;
    
    // Convertir a Base64 para la API
    const xmlBase64 = Buffer.from(fakeXML).toString('base64');
    const attachments = [{ name: `F-${orderId.substring(0,8)}.xml`, content: xmlBase64 }];

    const html = `
    <!DOCTYPE html>
    <html>
    <body style="margin:0; padding:20px; background-color:#E5E7EB;">
        <div style="${styles.container}">
            <div style="padding: 20px 40px; background: white; border-bottom: 1px solid #E5E7EB;">
                <img src="${LOGO_BECAS}" height="40"><span style="margin:0 10px;">|</span><img src="${LOGO_SAT}" height="30" style="vertical-align:middle;">
            </div>
            <div style="padding: 40px; background: white;">
                <p style="color: #374151;">Estimado contribuyente, le hacemos entrega de su factura electrónica (CFDI).</p>
                <div style="background-color: #F9FAFB; padding: 15px; margin: 20px 0;">
                    <strong>Receptor:</strong> ${fiscalData.razon}<br>
                    <strong>RFC:</strong> ${fiscalData.rfc}<br>
                    <strong>Monto:</strong> $${amount.toFixed(2)} MXN
                </div>
                <p style="font-size: 10px; color: #9CA3AF; text-align: center;">Documento adjunto.</p>
            </div>
        </div>
    </body></html>`;

    await sendEmailViaApi(email, `Factura ${orderId.substring(0,6)} - CFDI`, html, attachments);
};

module.exports = { sendDonorConfirmation, sendBeneficiaryNotification, sendInvoiceRequestNotification };