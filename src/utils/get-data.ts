export const getUser = (users, item) => {
  const user = users?.find((user) => user.id === item.userId)
  return user
}

export const getServer = (users, item) => {
  const user = users?.find((user) => user.id === item.serverId)
  return user
}

export const getSection = (sections, item) => {
  const section = sections?.find((section) => section.id === item.sectionId)
  return section
}

export const getPackage = (packages, item) => {
  const packageItem = packages?.find((e) => e.id === item.packageId)
  return packageItem
}

export const getProduct = (products, item) => {
  const product = products.find((product) => product.id === item.productId)
  return product
}

export const getProductOption = (productOptions, item) => {
  const productOption = productOptions?.find((e) => e.id === item.productOptionId)
  return productOption
}

export const getProductOptionSoldAmount = (orderDetails, item) => {
  const orderDetailsGroupByOption = orderDetails?.filter((orderDetail) => orderDetail.productOptionId === item.id)
  let amount = 0 //sold
  orderDetailsGroupByOption?.forEach((e) => {
    amount += e.productOptionAmount
  })
  return amount
}
