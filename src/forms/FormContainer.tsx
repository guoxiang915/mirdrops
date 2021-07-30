import { useState } from "react"
import { Link } from "react-router-dom"
import { ReactNode, HTMLAttributes, FormEvent } from "react"
import { Msg } from "@terra-money/terra.js"

import MESSAGE from "../lang/MESSAGE.json"
import Tooltip from "../lang/Tooltip.json"
import { UUSD } from "../constants"
import { gt, sum } from "../libs/math"
import useHash from "../libs/useHash"
import extension, { PostResponse } from "../terra/extension"
import { useContract, useAddress } from "../hooks"
import useTax from "../hooks/useTax"

import Container from "../components/Container"
import Card from "../components/Card"
import Confirm from "../components/Confirm"
import FormFeedback from "../components/FormFeedback"
import Button from "../components/Button"
import Count from "../components/Count"
import { TooltipIcon } from "../components/Tooltip"

import Result from "./Result"
import ConfirmTable from "../components/ConfirmTable"
import Modal, { useModal } from "../containers/Modal"
import ConnectListModal from "../layouts/ConnectListModal"
import { LinkProps } from "../components/LinkButton"
import { STATUS } from "../components/Wait"
import useFee from "./../hooks/useFee"
import { plus } from "./../libs/math"

interface Props {
  data: Msg[]
  memo?: string
  gasAdjust?: number

  /** Form information */
  contents?: Content[]
  assetsContent?: any
  /** uusd amount for tax calculation */
  pretax?: string
  /** Exclude tax from the contract */
  deduct?: boolean
  /** Form feedback */
  messages?: string[]

  /** Submit disabled */
  disabled?: boolean
  /** Submit label */
  label?: string

  /** Form event */
  attrs?: HTMLAttributes<HTMLFormElement>

  /** Parser for results */
  parseTx?: ResultParser

  successLink?: LinkProps

  className?: string

  children?: ReactNode

  submitButton?: Button

  resultForm?: string

  uusd?: string

  onCancel?: VoidFunction

  onSubmit?: () => Promise<void>

  onSubmitFinish?: (response: PostResponse) => void

  onSuccess?: () => void

  onClickResult?: (status: STATUS) => void
}

export const FormContainer = ({
  data: msgs,
  memo,
  gasAdjust,
  ...props
}: Props) => {
  const {
    contents,
    assetsContent,
    messages,
    label,
    className,
    children,
    submitButton,
    resultForm = "form",
    uusd: defaultUusd,
    onSubmit,
    onSubmitFinish,
    onSuccess,
    onCancel,
    onClickResult,
  } = props
  const { attrs, pretax, deduct, parseTx = () => [], successLink } = props

  /* context */
  const modal = useModal()
  const { hash } = useHash()

  const { uusd, result } = useContract()
  const address = useAddress()
  const { loading } = result.uusd

  /* tax */
  const fee = useFee(msgs?.length, gasAdjust)
  const { calcTax } = useTax()
  const tax = pretax ? calcTax(pretax) : "0"
  const uusdAmount = !deduct
    ? sum([pretax ?? "0", tax, fee.amount])
    : fee.amount

  const invalid =
    address && !loading && !gt(defaultUusd || uusd, uusdAmount)
      ? ["Not enough UST"]
      : undefined

  /* confirm */

  /* submit */
  const [submitted, setSubmitted] = useState(false)
  const [response, setResponse] = useState<PostResponse>()
  const disabled = props.disabled || invalid || submitted || !msgs?.length

  const submit = async () => {
    setSubmitted(true)

    const response: PostResponse = onSubmit
      ? ((await onSubmit()) as any)
      : await extension.post(
          { msgs, memo },
          { ...fee, tax: !deduct ? tax : undefined }
        )

    setResponse(response)

    if (onSubmitFinish) {
      onSubmitFinish(response)
    }
  }

  /* reset */
  const reset = () => {
    setSubmitted(false)
    setResponse(undefined)
  }

  /* event */
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    !disabled && submit()
  }

  /* render */
  const render = (children: ReactNode | ((button: ReactNode) => ReactNode)) => {
    const next = address
      ? {
          onClick: submit,
          children: label ?? hash ?? "Submit",
          loading: submitted,
          disabled,
        }
      : {
          onClick: () => modal.open(),
          children: MESSAGE.Form.Button.ConnectWallet,
        }

    const txFee = (
      <Count symbol={UUSD} dp={6}>
        {/* {String(uusdAmount)} */}
        {plus(!deduct ? tax : 0, fee.amount)}
      </Count>
    )

    const form = (
      <div style={{ textAlign: "center" }}>
        {children}

        {assetsContent && <ConfirmTable list={assetsContent} />}

        {contents && (
          <Confirm
            list={[
              ...contents,
              {
                title: (
                  <TooltipIcon content={Tooltip.Forms.TxFee}>
                    Tx Fee
                  </TooltipIcon>
                ),
                content: txFee,
              },
            ]}
          />
        )}

        {(invalid ?? messages)?.map((message) => (
          <FormFeedback key={message}>{message}</FormFeedback>
        ))}

        <Button {...next} type="button" size="lg" submit {...submitButton} />
        {onCancel && (
          <Link
            style={{
              display: "block",
              textAlign: "center",
              marginTop: 20,
              width: "100%",
            }}
            to="#"
            onClick={onCancel}
          >
            cancel
          </Link>
        )}
      </div>
    )

    return <Card lg>{form}</Card>
  }

  return (
    <>
      <Container sm className={className}>
        {response && resultForm === "form" ? (
          <Result
            {...response}
            parseTx={parseTx}
            // onFailure={reset}
            onSuccess={onSuccess}
            onClickResult={(status) => {
              if (status === STATUS.FAILURE) {
                reset()
              }
              onClickResult?.(status)
            }}
            successLink={successLink}
          />
        ) : (
          <form {...attrs} onSubmit={handleSubmit}>
            {render(children)}
          </form>
        )}
      </Container>
      {resultForm === "modal" &&
        (response ? (
          <Modal {...modal} isOpen>
            <Result
              {...response}
              parseTx={parseTx}
              // onFailure={reset}
              onSuccess={onSuccess}
              onClickResult={(status) => {
                reset()
                onClickResult?.(status)
              }}
              successLink={successLink}
            />
          </Modal>
        ) : null)}
      <ConnectListModal {...modal} />
    </>
  )
}

export default FormContainer
