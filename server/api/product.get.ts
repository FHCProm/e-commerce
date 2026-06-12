import { defineEventHandler } from 'h3'
import { prisma } from './utils/prisma.ts'

export default defineEventHandler(async () => {
  const products = await prisma.product.findMany()
  return { data: products }
})