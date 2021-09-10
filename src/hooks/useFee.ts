import BigNumber from "bignumber.js"
import { GAS_MAX_AMOUNT } from "../constants"
import useNetwork from "./useNetwork"

const useFee = (length = 1, gasAdjust = 1) => {
  const { fee } = useNetwork()
  const { gasPrice } = fee
  const limitLength =
    new BigNumber(GAS_MAX_AMOUNT)
      .times(gasPrice)
      .div(fee.amount)
      .div(gasAdjust)
      .integerValue(BigNumber.ROUND_CEIL)
      .toNumber() - 1
  const msgLength = length < limitLength ? length : limitLength

  const amount = new BigNumber(fee.amount)
    .times(msgLength)
    .times(gasAdjust)
    .toNumber()

  const gas = new BigNumber(amount)
    .div(gasPrice)
    .integerValue(BigNumber.ROUND_FLOOR)
    .toNumber()

  return {
    ...fee,
    amount,
    gas,
    limit: length <= limitLength ? undefined : limitLength,
  }
}

export default useFee
