// server/api/product.get.ts
import { defineEventHandler } from 'h3'
import { prisma } from './utils/prisma.ts'

export default defineEventHandler(async () => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,   // 👈 include category relation so category.name is available
        inventory: true,  // optional: include inventory if you want quantity
      },
    })
    return { data: products }
  } catch (err) {
    console.error(err)
    return { error: 'Failed to fetch products' }
  }
})
