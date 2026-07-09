import { defineEventHandler, readBody, createError } from 'h3'
import { prisma } from './utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { id, name } = body

  if (!id || !name) {
    throw createError({ statusCode: 400, statusMessage: 'Missing id or name' })
  }

  const updated = await prisma.category.update({
    where: { id },
    data: { name }
  })

  return { updated }
})
