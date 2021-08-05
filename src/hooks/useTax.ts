import BigNumber from "bignumber.js"
import { TAX } from "../graphql/gqldocs"
import useFee from "./useFee"
import { useQuery } from "@apollo/client"

export default () => {
  const { data } = useQuery<TaxData>(TAX)
  const fee = useFee()

  const rate = data?.TreasuryTaxRate.Result
  const cap = data?.TreasuryTaxCapDenom.Result

  const calcTax = (amount = "0") =>
    rate && cap
      ? BigNumber.min(new BigNumber(amount).times(rate), cap)
          .integerValue(BigNumber.ROUND_CEIL)
          .toString()
      : "0"

  const getMax = (balance = "0") => {
    if (rate && cap) {
      const balanceSafe = new BigNumber(balance).minus(1e6)
      const calculatedTax = new BigNumber(balanceSafe)
        .times(rate)
        .div(new BigNumber(1).plus(rate))
        .integerValue(BigNumber.ROUND_CEIL)
        .toString()

      const tax = BigNumber.min(calculatedTax, cap)
      const max = BigNumber.max(
        new BigNumber(balanceSafe).minus(tax).minus(fee.amount),
        0
      )

      return max.toString()
    } else {
      return "0"
    }
  }

  return { calcTax, getMax }
}
