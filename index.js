const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const sharp = require('sharp');

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    console.log('Dale no qr Code:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Tudo certo vambora!');
});

// Mensagens que o cliente autenticado recebe
// client.on('message', async message => {
//     console.log('Mensagem recebida: ', message.body, '\nTem mídia?', message.hasMedia);
//     if (message.hasMedia && message.body.trim().toLowerCase() === 'bot stk') {
//         try {
//             const media = await message.downloadMedia();
//             const buffer = Buffer.from(media.data, 'base64');
            
//             const stickerBuffer = await sharp(buffer)
//             .resize({
//                 width: 512,
//                 height: 512,
//                 fit: 'inside',
//                 withoutEnlargement: true
//             })
//             .toFormat('webp')
//             .toBuffer();
            
//             const sticker = new MessageMedia('image/webp', stickerBuffer.toString('base64'));
            
//             client.sendMessage(message.from, sticker, { sendMediaAsSticker: true });
//         } catch (err) {
//             console.error('Erro ao processar imagem:', err);
//             message.reply('Deu ruim.');
//         }
//     }
// });

// Mensagens que o cliente autenticado envia
// As figurinhas geradas por esse metodo serão enviadas ao proprio numero do cliente autenticado
client.on('message_create', async message => {
    console.log('Mensagem enviada: ', message.body, '\nTem mídia?\n', message.hasMedia);
    if (message.fromMe && message.body.trim().toLowerCase() === 'bot stk') {
        if (message.hasMedia) {
            try {
                const media = await message.downloadMedia();
                const buffer = Buffer.from(media.data, 'base64');

                const stickerBuffer = await sharp(buffer)
                    .resize({
                        width: 512,
                        height: 512,
                        fit: 'inside',
                        withoutEnlargement: true
                    })
                    .toFormat('webp')
                    .toBuffer();

                const sticker = new MessageMedia('image/webp', stickerBuffer.toString('base64'));

                client.sendMessage(message.from, sticker, { sendMediaAsSticker: true });
            } catch (err) {
                console.error('Erro ao processar imagem:', err);
                client.sendMessage(message.from, 'Houve um erro ao processar a imagem.');
            }
        }
    }
});

client.initialize();
