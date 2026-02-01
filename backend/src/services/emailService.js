// backend/src/services/emailService.js
require('dotenv').config();

// Configuración API Brevo
const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

// --- REMITENTES OFICIALES ---
const SENDER_CONTACTO = { name: "Becas Tec", email: "contacto@becas.tec.protesispiernas.com" };
const SENDER_NOTIFICACIONES = { name: "Notificaciones Becas", email: "notificaciones@becas.tec.protesispiernas.com" };
const SENDER_FACTURACION = { name: "Facturación Electrónica", email: "facturacion@becas.tec.protesispiernas.com" };

// --- RECURSOS VISUALES ---
const DOMINIO_WEB = "https://becas.tec.protesispiernas.com"; 

// Asegúrate de tener estas imágenes en tu hosting (o usa las mismas URLs públicas si no tienes la versión blanca aún)
const LOGO_BECAS = `${DOMINIO_WEB}/logos/logo_tec.png`; 
const LOGO_BECAS_BLANCO = `${DOMINIO_WEB}/logos/logo_tec_blanco.png`; // Úsalo sobre fondos oscuros
const LOGO_SAT = `${DOMINIO_WEB}/logos/logo_SAT.png`;
const LOGO_SAT_BLANCO = `${DOMINIO_WEB}/logos/logo_SAT_blanco.png`;
const LOGO_TECMILENIO = `${DOMINIO_WEB}/logos/logo_tecmilenio.png`;
const LOGO_TECSALUD = `${DOMINIO_WEB}/logos/logo_tecsalud.png`;

// Helper Flexible para envío API
const sendEmailViaApi = async (senderIdentity, toEmail, subject, htmlContent, attachments = []) => {
    if (!process.env.BREVO_API_KEY) {
        console.error("❌ FALTA LA BREVO_API_KEY");
        return;
    }
    const body = {
        sender: senderIdentity,
        to: [{ email: toEmail }],
        subject: subject,
        htmlContent: htmlContent
    };
    if (attachments && attachments.length > 0) body.attachment = attachments;

    try {
        const response = await fetch(BREVO_API_URL, {
            method: 'POST',
            headers: { 'accept': 'application/json', 'api-key': process.env.BREVO_API_KEY, 'content-type': 'application/json' },
            body: JSON.stringify(body)
        });
        if (!response.ok) throw new Error(JSON.stringify(await response.json()));
        console.log(`✅ Correo enviado a: ${toEmail} (${senderIdentity.name})`);
    } catch (error) {
        console.error(`❌ FALLO ENVÍO a ${toEmail}:`, error.message);
    }
};

// --- ESTILOS CSS "INLINE" PARA COMPATIBILIDAD TOTAL ---
const style = {
    // Layout
    wrapper: 'background-color: #F4F6F8; padding: 40px 10px; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;',
    card: 'background-color: #ffffff; max-width: 600px; margin: 0 auto; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);',
    body: 'padding: 40px 40px;',
    
    // Headers
    headerBlue: 'background-color: #0036A0; padding: 40px 40px; text-align: center;',
    headerWhite: 'background-color: #ffffff; padding: 30px 40px; border-bottom: 1px solid #E5E7EB;',
    
    // Tipografía
    h1: 'color: #111827; font-size: 24px; font-weight: 700; margin: 0 0 15px 0; line-height: 1.2;',
    h1White: 'color: #ffffff; font-size: 26px; font-weight: 700; margin: 0;',
    p: 'color: #4B5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;',
    small: 'color: #6B7280; font-size: 12px; line-height: 1.5;',
    
    // Componentes
    btn: 'display: inline-block; background-color: #0036A0; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: bold; font-size: 16px; margin-top: 20px;',
    boxGray: 'background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 8px; padding: 20px;',
    boxGold: 'background-color: #FFFBEB; border-left: 4px solid #D97706; padding: 20px; border-radius: 4px;',
    
    // Datos
    label: 'display: block; font-size: 11px; text-transform: uppercase; color: #9CA3AF; font-weight: 700; margin-bottom: 5px; letter-spacing: 0.5px;',
    value: 'color: #1F2937; font-size: 15px; font-weight: 600;',
    amount: 'color: #0036A0; font-size: 32px; font-weight: 800; letter-spacing: -1px;',
    
    // Footer
    footer: 'background-color: #ffffff; padding: 30px 40px; text-align: center; border-top: 1px solid #F3F4F6;',
    footerLogos: 'height: 25px; margin: 0 12px; opacity: 0.5; filter: grayscale(100%); vertical-align: middle;'
};

// --- HELPER: FOOTER COMÚN (Para no repetir código) ---
const getCommonFooter = () => `
    <div style="${style.footer}">
        <div style="margin-bottom: 20px;">
            <img src="${LOGO_BECAS}" style="${style.footerLogos}" alt="Tec">
            <img src="${LOGO_TECMILENIO}" style="${style.footerLogos}" alt="Tecmilenio">
            <img src="${LOGO_TECSALUD}" style="${style.footerLogos}" alt="TecSalud">
        </div>
        <p style="${style.small}">
            © 2026 Tecnológico de Monterrey.<br>
            Transformando vidas a través de la educación.
        </p>
    </div>
`;


// ==========================================
// 1. CONFIRMACIÓN (Estilo "Receipt" Elegante)
// ==========================================
const sendDonorConfirmation = async (donorEmail, donorName, amount, orderId) => {
    const html = `
    <!DOCTYPE html>
    <html>
    <body style="margin:0; padding:0; background-color:#F4F6F8;">
        <div style="${style.wrapper}">
            <div style="${style.card}">
                <div style="${style.headerWhite}">
                    <img src="${LOGO_BECAS}" height="40" alt="Logo">
                </div>
                
                <div style="${style.body}">
                    <h1 style="${style.h1}">¡Gracias, ${donorName}!</h1>
                    <p style="${style.p}">Tu generosidad impulsa el futuro. Hemos procesado tu donativo exitosamente.</p>
                    
                    <div style="${style.boxGray}">
                        <span style="${style.label}">MONTO TOTAL</span>
                        <div style="${style.amount}">$${amount.toLocaleString('en-US', {minimumFractionDigits: 2})} MXN</div>
                        
                        <table width="100%" style="margin-top: 20px; border-top: 1px dashed #D1D5DB; padding-top: 15px;">
                            <tr>
                                <td width="50%">
                                    <span style="${style.label}">REFERENCIA</span>
                                    <div style="${style.value}">#${orderId.substring(0, 8).toUpperCase()}</div>
                                </td>
                                <td width="50%">
                                    <span style="${style.label}">FECHA</span>
                                    <div style="${style.value}">${new Date().toLocaleDateString('es-MX')}</div>
                                </td>
                            </tr>
                        </table>
                    </div>

                    <div style="text-align: center;">
                        <a href="${DOMINIO_WEB}" style="${style.btn}">Descargar Comprobante</a>
                    </div>
                </div>
                ${getCommonFooter()}
            </div>
        </div>
    </body>
    </html>`;

    await sendEmailViaApi(SENDER_CONTACTO, donorEmail, 'Confirmación de Donativo', html);
};


// ==========================================
// 2. BENEFICIARIO (Estilo "Celebración" Azul)
// ==========================================
const sendBeneficiaryNotification = async (email, name, donorName, dedication) => {
    const html = `
    <!DOCTYPE html>
    <html>
    <body style="margin:0; padding:0; background-color:#F4F6F8;">
        <div style="${style.wrapper}">
            <div style="${style.card}">
                <div style="${style.headerBlue}">
                    <img src="${LOGO_BECAS_BLANCO}" height="50" style="display:block; margin: 0 auto 20px auto;" alt="Logo Blanco">
                    <h1 style="${style.h1White}">¡Felicidades, ${name}!</h1>
                    <p style="color: #E0E7FF; font-size: 16px; margin: 10px 0 0 0;">Has recibido un reconocimiento especial.</p>
                </div>
                
                <div style="${style.body}">
                    <p style="${style.p}; text-align: center;">
                        <strong>${donorName}</strong> ha realizado una donación en tu nombre al programa de Líderes del Mañana, celebrando tu esfuerzo.
                    </p>
                    
                    <div style="${style.boxGold}; margin: 30px 0;">
                        <p style="color: #92400E; font-family: Georgia, serif; font-size: 18px; font-style: italic; text-align: center; margin: 0; line-height: 1.5;">
                            "${dedication || 'Sigue inspirando a los demás con tu talento.'}"
                        </p>
                        <div style="margin-top: 15px; text-align: center; font-size: 11px; color: #B45309; font-weight: 700; text-transform: uppercase;">
                            — Mensaje del Donante
                        </div>
                    </div>

                    <div style="text-align: center;">
                        <a href="${DOMINIO_WEB}" style="${style.btn}">Ver mi Certificado Digital</a>
                    </div>
                </div>
                ${getCommonFooter()}
            </div>
        </div>
    </body>
    </html>`;

    await sendEmailViaApi(SENDER_NOTIFICACIONES, email, `🎁 ${donorName} te envió un mensaje`, html);
};


// ==========================================
// 3. CFDI / SAT (Estilo "Documento Oficial")
// ==========================================
const sendInvoiceRequestNotification = async (email, fiscalData, amount, orderId) => {
    // 1. Cálculos y Mapeos
    const subtotal = amount; 
    const fecha = new Date().toISOString();
    const usoDesc = { 'D04': 'D04 - Donativos', 'G03': 'G03 - Gastos en general', 'S01': 'S01 - Sin efectos fiscales', 'CP01': 'CP01 - Pagos' }[fiscalData.usoCfdi] || fiscalData.usoCfdi;
    const regimenDesc = {
        '605': '605 - Sueldos y Salarios e Ingresos Asimilados',
        '626': '626 - RESICO',
        '601': '601 - General de Ley Personas Morales',
        '612': '612 - Personas Físicas Act. Emp.'
    }[fiscalData.regimen] || fiscalData.regimen;
    
    const direccion = `${fiscalData.calle} ${fiscalData.noExt} ${fiscalData.noInt || ''}, ${fiscalData.colonia}, ${fiscalData.municipio}, ${fiscalData.estado}, CP: ${fiscalData.cp}`.toUpperCase();
    const cadenaOriginal = `||1.1|${orderId}|${fecha}|SAT970701NN3|${fiscalData.rfc}|${fiscalData.razon}|${amount.toFixed(2)}|MXN|I|01||`;

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            /* LÓGICA DE MODO OSCURO */
            /* Por defecto (Light Mode), ocultamos la imagen oscura */
            .dark-img { display: none !important; }

            /* Si el usuario tiene Dark Mode activado: */
            @media (prefers-color-scheme: dark) {
                /* Ocultamos la imagen normal */
                .light-img { display: none !important; }
                /* Mostramos la imagen blanca */
                .dark-img { display: block !important; }
            }
        </style>
    </head>
    <body style="margin:0; padding:0; background-color:#F4F6F8;">
        <div style="${style.wrapper}">
            <div style="${style.card}">
                <div style="padding: 25px 40px; border-bottom: 2px solid #0036A0; display: flex; align-items: center; justify-content: space-between; background: white;">
                    <div>
                        <img src="${LOGO_BECAS}" class="light-img" height="35" style="vertical-align: middle;">
                        
                        <img src="${LOGO_BECAS_BLANCO}" class="dark-img" height="35" style="display:none; vertical-align: middle;">

                        <span style="color: #D1D5DB; font-size: 20px; margin: 0 10px;">|</span>
                        
                        <img src="${LOGO_SAT}" height="30" style="vertical-align: middle;">
                    </div>
                    <div style="text-align: right;">
                        <div style="${style.label}">FOLIO FISCAL</div>
                        <div style="font-weight: bold; color: #1F2937;">${orderId.substring(0,8).toUpperCase()}</div>
                    </div>
                </div>

                <div style="${style.body}">
                    <p style="${style.p}">Estimado contribuyente, adjunto encontrará su factura electrónica (CFDI) correspondiente a su donativo.</p>

                    <table width="100%" cellspacing="0" cellpadding="0" style="border: 1px solid #E5E7EB; border-radius: 8px; margin-bottom: 25px; overflow: hidden;">
                        <tr style="background: #F9FAFB;">
                            <td width="50%" style="padding: 10px 15px; border-bottom: 1px solid #E5E7EB; border-right: 1px solid #E5E7EB; font-size: 11px; font-weight: bold; color: #6B7280;">EMISOR</td>
                            <td width="50%" style="padding: 10px 15px; border-bottom: 1px solid #E5E7EB; font-size: 11px; font-weight: bold; color: #6B7280;">RECEPTOR</td>
                        </tr>
                        <tr>
                            <td style="padding: 15px; border-right: 1px solid #E5E7EB; vertical-align: top;">
                                <div style="font-weight: bold; font-size: 12px; margin-bottom: 4px;">TECNOLÓGICO DE MONTERREY</div>
                                <div style="font-size: 11px; color: #6B7280;">ITE4302154J2</div>
                            </td>
                            <td style="padding: 15px; vertical-align: top;">
                                <div style="font-weight: bold; font-size: 12px; margin-bottom: 4px;">${fiscalData.razon.toUpperCase()}</div>
                                <div style="font-size: 11px; color: #6B7280;">${fiscalData.rfc.toUpperCase()}</div>
                                <div style="font-size: 10px; color: #9CA3AF; margin-top: 8px; line-height: 1.3;">
                                    ${regimenDesc}<br>
                                    Uso: ${usoDesc}<br>
                                    ${direccion}
                                </div>
                            </td>
                        </tr>
                    </table>

                    <table width="100%" cellspacing="0" cellpadding="0" style="border: 1px solid #E5E7EB; border-radius: 8px; overflow: hidden;">
                        <tr style="background: #0036A0; color: white;">
                            <th align="left" style="padding: 10px 15px; font-size: 12px;">Descripción</th>
                            <th align="right" style="padding: 10px 15px; font-size: 12px;">Importe</th>
                        </tr>
                        <tr>
                            <td style="padding: 15px; border-bottom: 1px solid #E5E7EB; font-size: 13px; color: #4B5563;">Donativo para fines educativos</td>
                            <td align="right" style="padding: 15px; border-bottom: 1px solid #E5E7EB; font-size: 13px; font-weight: bold; color: #1F2937;">$${subtotal.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                        </tr>
                        <tr style="background-color: #F9FAFB;">
                            <td align="right" style="padding: 15px; font-weight: bold; color: #0036A0; font-size: 14px;">TOTAL:</td>
                            <td align="right" style="padding: 15px; font-weight: bold; color: #0036A0; font-size: 14px;">$${amount.toLocaleString('en-US', {minimumFractionDigits: 2})} MXN</td>
                        </tr>
                    </table>
                    
                    <div style="margin-top: 20px; font-size: 10px; color: #9CA3AF; text-align: center;">
                        Cadena Original: ${cadenaOriginal.substring(0, 50)}...
                    </div>
                </div>
                ${getCommonFooter()}
            </div>
        </div>
    </body>
    </html>`;

    // Adjuntos
    const fakeXML = `<?xml version="1.0" encoding="UTF-8"?><cfdi:Comprobante Total="${amount.toFixed(2)}" Moneda="MXN" Fecha="${new Date().toISOString()}" UsoCFDI="${fiscalData.usoCfdi}"><cfdi:Emisor Rfc="ITE4302154J2"/><cfdi:Receptor Rfc="${fiscalData.rfc}" Nombre="${fiscalData.razon}" RegimenFiscalReceptor="${fiscalData.regimen}"/></cfdi:Comprobante>`;
    const xmlBase64 = Buffer.from(fakeXML).toString('base64');
    const attachments = [{ name: `F-${orderId.substring(0,8)}.xml`, content: xmlBase64 }];

    await sendEmailViaApi(SENDER_FACTURACION, email, `Factura ${orderId.substring(0,6)} - CFDI`, html, attachments);
};

module.exports = { sendDonorConfirmation, sendBeneficiaryNotification, sendInvoiceRequestNotification };