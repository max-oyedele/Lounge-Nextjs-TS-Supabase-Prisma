import moment from 'moment'

export function getFormatPrice(price, currency) {
  if (isNaN(price)) return "-"
  const formatPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(price) // '$100.00'
  return formatPrice
}

export function formatAmountForStripe(
  amount: number,
  currency: string
): number {
  let numberFormat = new Intl.NumberFormat(['en-US'], {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol',
  })
  const parts = numberFormat.formatToParts(amount)
  
  let zeroDecimalCurrency: boolean = true
  for (let part of parts) {
    if (part.type === 'decimal') {
      zeroDecimalCurrency = false
    }
  }
  return zeroDecimalCurrency ? amount : Math.round(amount * 100)
}

export const isSameDate = (date1, date2) => {
  // console.log('compare', moment(selectedDate).isSame('2021-05-26', 'day')) // javascript date format == string
  return moment(date1).isSame(moment(date2), 'day')
}