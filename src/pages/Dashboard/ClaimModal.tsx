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

interface Props {
  title: string
  modal: Modal
  onSuccess?: () => void
  drops: TerraDrop[]
}

const ClaimModal = ({ title, modal, drops, onSuccess }: Props) => {
  const amounts = drops.map((drop, index) => ({
    title: drops.length > 1 ? index === 0 && "Amounts" : "Amount",
    content: (
      <div className={styles.symbol}>
        <Count format={format} symbol={drop.symbol}>
          {lookup(drop.value, UUSD)}
        </Count>
      </div>
    ),
  }))

  /* submit */
  const newContractMsg = useNewContractMsg()
  const data: MsgExecuteContract[] = []
  drops.forEach((drop) => {
    drop.data?.forEach((item: any) => {
      data.push(
        newContractMsg(drop.airdrop || "", {
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
  // const parseTx = useTradeReceipt(Type.BUY, totalRewards)
  const container = {
    // parseTx,
    contents: [],
    label: drops.length > 1 ? "Claim All" : "Claim",
    submitButton: {
      className: styles.submit,
    },
    data,
    disabled: !drops.length,
  }
  const tax = { pretax: UUSD, deduct: true }

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
