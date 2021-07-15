import { useState } from "react"
import { Link } from "react-router-dom"
import { ReactNode, HTMLAttributes, FormEvent } from "react"
import { Msg } from "@terra-money/terra.js"

import MESSAGE from "../lang/MESSAGE.json"
import Tooltip from "../lang/Tooltip.json"
import { UUSD } from "../constants"
import { gt, plus, sum } from "../libs/math"
import useHash from "../libs/useHash"
import extension, { PostResponse } from "../terra/extension"
import { useContract, useNetwork, useSettings, useAddress } from "../hooks"
import useTax from "../graphql/useTax"

import Container from "../components/Container"
import Card from "../components/Card"
import Confirm from "../components/Confirm"
import FormFeedback from "../components/FormFeedback"
import Button from "../components/Button"
import Count from "../components/Count"
import { TooltipIcon } from "../components/Tooltip"

import Caution from "./Caution"
import Result from "./Result"
import ConfirmTable from "../components/ConfirmTable"
import Modal, { useModal } from "../containers/Modal"
import ConnectListModal from "../layouts/ConnectListModal"
import { LinkProps } from "../components/LinkButton"
import { STATUS } from "../components/Wait"

interface Props {
  data: Msg[]
  memo?: string

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

export const FormContainer = ({ data: msgs, memo, ...props }: Props) => {
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
  const modal = useModal()

  /* context */
  const { hash } = useHash()
  const { fee } = useNetwork()
  const { agreementState } = useSettings()
  const [hasAgreed] = agreementState

  const { uusd, result } = useContract()
  const address = useAddress()
  const { loading } = result.uusd

  /* tax */
  const tax = useTax(pretax)
  const uusdAmount = !deduct
    ? sum([pretax ?? "0", tax ?? "0", fee.amount])
    : fee.amount

  const invalid =
    address && !loading && !gt(defaultUusd || uusd, uusdAmount)
      ? ["Not enough UST"]
      : undefined

  /* confirm */
  const [confirming, setConfirming] = useState(false)
  const confirm = () => (hasAgreed ? submit() : setConfirming(true))
  const cancel = () => setConfirming(false)

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
    setConfirming(false)
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
          onClick: confirm,
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
        {plus(tax, fee.amount)}
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
            {confirming && resultForm === "form" ? (
              <Caution goBack={cancel} onAgree={submit} />
            ) : (
              render(children)
            )}
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
        ) : confirming ? (
          <Modal {...modal} isOpen>
            <form {...attrs} onSubmit={handleSubmit}>
              <Caution goBack={cancel} onAgree={submit} />
            </form>
          </Modal>
        ) : null)}
      <ConnectListModal {...modal} />
    </>
  )
}

export default FormContainer
