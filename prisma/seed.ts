import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const targetUrl = 'https://script.google.com/macros/s/AKfycbxIfb40jB8_ui7u2lQ7Au3NWU9BcFkrLe7qyVx2809qTMnXTIlFcMzwC5f0gTqn32qu/exec';

  // Actualizamos la URL de regalos en todas las invitaciones creadas
  await prisma.invitation.updateMany({
    data: {
      giftUrl: targetUrl,
      giftText: 'Si deseas acompañarnos también con un regalo, puedes consultar nuestra lista. Allí podrás elegir un regalo o realizar un aporte grupal para regalos de mayor valor. Cuando un regalo alcanza el valor total establecido, queda completado para evitar que otras personas continúen aportando.'
    }
  });

  console.log('¡URL de Lista de Regalos actualizada con éxito a Google Apps Script!')
}

main()