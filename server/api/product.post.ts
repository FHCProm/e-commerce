// server/api/product.post.ts
import { defineEventHandler, readBody, createError } from 'h3'
import { prisma } from './utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { title, short, full, price, image, type: categoryName, sizes = [], quantity = 0 } = body

  if (!title || !categoryName || price == null) {
    throw createError({ statusCode: 400, statusMessage: 'Missing required fields' })
  }

  // Find or create category
  let category = await prisma.category.findUnique({ where: { name: categoryName } })
  if (!category) {
    category = await prisma.category.create({ data: { name: categoryName } })
  }

  const createdProducts = []

  if (Array.isArray(sizes) && sizes.length > 0) {
    for (const s of sizes) {
      const product = await prisma.product.create({
        data: {
          title,
          price: Number(price),
          size: s,
          categoryId: category.id,
          inventory: {
            create: { quantity: Number(quantity) },
          },
          // You can extend Product model to store short/full/image if needed
        },
      })
      createdProducts.push(product)
    }
  } else {
    const product = await prisma.product.create({
      data: {
        title,
        price: Number(price),
        size: null,
        categoryId: category.id,
        inventory: {
          create: { quantity: Number(quantity) },
        },
      },
    })
    createdProducts.push(product)
  }

  return { created: createdProducts }
})
