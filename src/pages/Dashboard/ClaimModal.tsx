import { UUSD } from "../../constants"
import { format, lookup } from "../../libs/parse"
import Count from "../../components/Count"
import FormContainer from "../../forms/FormContainer"
import Modal from "../../containers/Modal"

import styles from "./ClaimModal.module.scss"
import useNewContractMsg from "../../terra/useNewContractMsg"
import { TerraDrop } from "./AirdropCard"
import Confirm from "../../components/Confirm"
import { MsgExecuteContract } from "@terra-money/terra.js"
import { plus, gt } from "../../libs/math"

interface Props {
  title: string
  modal: Modal
  onSuccess?: () => void
  drops: TerraDrop[]
}

const ClaimModal = ({ title, modal, drops, onSuccess }: Props) => {
  let amounts = drops
    .filter((drop) => gt(drop.value || "0", "0"))
    .map((drop, index) => ({
      title: "",
      content: (
        <div className={styles.symbol}>
          <Count format={format} symbol={drop.symbol}>
            {lookup(drop.value, UUSD)}
          </Count>
        </div>
      ),
    }))

  if (amounts.length === 0) {
    amounts = [
      {
        title: "Amount",
        content: <></>,
      },
    ]
  }
  amounts[0].title = amounts.length === 1 ? "Amount" : "Amounts"

  /* submit */
  const newContractMsg = useNewContractMsg()
  const data: MsgExecuteContract[] = []
  let totalAmount = "0"
  drops.forEach((drop) => {
    totalAmount = plus(drop.ust || "0", totalAmount)
    drop.data?.forEach((item: any) => {
      data.push(
        drop.protocol === "Mirror"
          ? newContractMsg(drop.airdrop || "", {
              [item.key]: {
                stage: item.stage,
                amount: item.amount,
                proof: Array.isArray(item.proof)
                  ? item.proof
                  : JSON.parse(item.proof),
              },
            })
          : newContractMsg(drop.airdrop || "", {
              claim: {
                stage: item.stage,
                amount: item.amount,
                proof: Array.isArray(item.proof)
                  ? item.proof
                  : JSON.parse(item.proof),
              },
            })
      )
    })
  })

  /* result */
  const parseTx = undefined
  const container = {
    parseTx,
    contents: [],
    label: drops.length > 1 ? "Claim All" : "Claim",
    submitButton: {
      className: styles.submit,
    },
    data,
    disabled: !drops.length,
  }
  const tax = { pretax: totalAmount, deduct: true }

  return (
    <Modal {...modal} className={styles.modal}>
      <FormContainer {...container} {...tax} onSuccess={onSuccess}>
        <div className={styles.title}>{title}</div>
        <Confirm list={amounts} />
      </FormContainer>
    </Modal>
  )
}

export default ClaimModal
