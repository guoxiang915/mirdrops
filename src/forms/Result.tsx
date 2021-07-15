import { useEffect } from "react"
import { useLazyQuery } from "@apollo/client"

import { TX_POLLING_INTERVAL } from "../constants"
import { TXINFOS } from "../graphql/gqldocs"
import { PostResponse } from "../terra/extension"
import MESSAGE from "../lang/MESSAGE.json"
import { useResult } from "../hooks"

import Wait, { STATUS } from "../components/Wait"
import TxHash from "./TxHash"
import TxInfo from "./TxInfo"
import { LinkProps } from "../components/LinkButton"

interface Props extends PostResponse {
  parseTx: ResultParser
  successLink?: LinkProps
  onFailure?: () => void
  onSuccess?: () => void
  onClickResult?: (status: STATUS) => void
}

const Result = ({ success, result, error, ...props }: Props) => {
  const { parseTx, onSuccess, successLink, onFailure, onClickResult } = props
  const { txhash: hash = "" } = result ?? {}

  /* context */
  const { uusd } = useResult()
  const { refetch } = uusd

  /* polling */
  const variables = { hash }
  const [load, tx] = useLazyQuery<TxInfos>(TXINFOS, { variables })

  const { data, startPolling, stopPolling } = tx
  const txInfo = data?.TxInfos[0]

  /* status */
  // TODO
  // 1. TIMEOUT - When there is no response for 20 seconds
  // 2. User denied
  const status =
    !success || !hash || tx.error || (txInfo && !txInfo?.Success)
      ? STATUS.FAILURE
      : tx.loading || !txInfo
      ? STATUS.LOADING
      : STATUS.SUCCESS

  useEffect(() => {
    success && hash && load()
  }, [success, hash, load])

  useEffect(() => {
    if (status === STATUS.LOADING) {
      startPolling?.(TX_POLLING_INTERVAL)
    } else {
      stopPolling?.()
      refetch?.()
    }
  }, [status, startPolling, stopPolling, refetch])

  /* verbose */
  const verbose = txInfo ? JSON.stringify(txInfo, null, 2) : undefined
  useEffect(() => {
    const log = () => {
      console.groupCollapsed("Logs")
      console.info(verbose)
      console.groupEnd()
    }

    verbose && log()
  }, [verbose])

  useEffect(() => {
    if (status === STATUS.SUCCESS) {
      onSuccess?.()
    } else if (status === STATUS.FAILURE) {
      onFailure?.()
    }
  }, [status, onSuccess, onFailure])

  /* render */
  const message =
    txInfo?.RawLog ||
    result?.raw_log ||
    error?.message ||
    (error?.code === 1 && MESSAGE.Result.DENIED)

  const content = {
    [STATUS.SUCCESS]: txInfo && <TxInfo txInfo={txInfo} parser={parseTx} />,
    [STATUS.LOADING]: null,
    [STATUS.FAILURE]: message,
  }[status]

  const wait = {
    status,

    hash: status === STATUS.LOADING && <TxHash>{hash}</TxHash>,

    link:
      status === STATUS.SUCCESS
        ? successLink || {
            to: "",
            children: "Done",
          }
        : undefined,

    button:
      status === STATUS.FAILURE
        ? {
            onClick: () => onClickResult?.(status),
            children: MESSAGE.Result.Button.FAILURE,
          }
        : undefined,
  }

  if (wait.link && !wait.link.onClick) {
    wait.link.onClick = () => onClickResult?.(status)
  }

  return <Wait {...wait}>{content}</Wait>
}

export default Result
