import { defineEventHandler, readBody, createError } from 'h3'
import { prisma } from './utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name } = body

  if (!name) {
    throw createError({ statusCode: 400, statusMessage: 'Category name required' })
  }

  // Create new category
  const category = await prisma.category.create({
    data: { name }
  })

  return { created: category }
})
