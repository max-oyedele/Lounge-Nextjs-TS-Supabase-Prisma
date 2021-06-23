import { PrismaClient } from '@prisma/client'
import { sections } from './seeds/sections'
import { packages } from './seeds/packages'
import { products } from './seeds/products'
import { productOptions } from './seeds/productOptions'
import { packagesProducts } from './seeds/packagesProducts'

const prisma = new PrismaClient()

async function main() {
  // sections
  for (let index = 0; index < sections.length; index++) {
    await prisma.section.upsert({
      where: {
        id: index + 1,
      },
      update: {},
      create: sections[index],
    })
  }

  //packages
  for (let index = 0; index < packages.length; index++) {
    await prisma.package.upsert({
      where: {
        id: index + 1,
      },
      update: {},
      create: packages[index],
    })
  }

  //products
  for (let index = 0; index < products.length; index++) {
    await prisma.product.upsert({
      where: {
        id: index + 1,
      },
      update: {},
      create: products[index],
    })
  }

  //packages-products
  for (let index = 0; index < packagesProducts.length; index++) {
    await prisma.packageProduct.upsert({
      where: {
        packageId_productId: {
          packageId: packagesProducts[index].packageId,
          productId: packagesProducts[index].productId,
        },
      },
      update: {},
      create: packagesProducts[index],
    })
  }

  //product options
  for (let index = 0; index < productOptions.length; index++) {
    await prisma.productOption.upsert({
      where: {
        id: index + 1,
      },
      update: {},
      create: productOptions[index],
    })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
