import { useEffect, useState } from "react"
import Card from "../../components/Card"
import styles from "./AirdropCard.module.scss"
import Skeleton from "./Skeleton"
import classNames from "classnames"
import { getDrops } from "../../graphql/useDrops"
import { lookup } from "../../libs/parse"
import { UUSD } from "../../constants"

export interface TerraDrop {
  protocol: string
  symbol: string
  icon: string
  token?: string
  airdrop?: string
  api?: string
  type?: string
  date?: number
  value?: string
  ust?: string
  count?: number
  data?: any
  app_url?: string
}

interface Props {
  drop: TerraDrop
  address?: string
  onClaim?: VoidFunction
  onLoad?: (drop: TerraDrop) => void
}

const AirdropCard = ({ drop, onClaim, address, onLoad }: Props) => {
  const coming = !drop.token
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const getDropValues = async () => {
      if (
        address &&
        drop.api &&
        drop.value === undefined &&
        onLoad &&
        !loading
      ) {
        setLoading(true)
        const result = await getDrops(address, drop)
        onLoad?.({
          ...drop,
          ...result,
        })
        setLoading(false)
      }
    }

    if (address && drop.api && drop.value === undefined && onLoad && !loading) {
      getDropValues()
    }
  }, [address, drop, onLoad, loading])

  const handleOpenApp = () => {
    if (drop.app_url) {
      window.open(drop.app_url, "_blank")
    }
  }

  return (
    <Card className={styles.card}>
      <div className={styles.label}>
        <img
          src={drop.icon}
          className={styles.logo}
          alt={drop.protocol}
          onClick={handleOpenApp}
        />
        <div className={styles.title} onClick={handleOpenApp}>
          {drop.protocol}
        </div>
        {drop.protocol === "Pylon" && (
          <div className={styles.subtitle}>claim all not supported</div>
        )}
      </div>

      <div className={styles.value}>
        <div className={styles.tokens}>
          <div className={styles.token}>
            {coming || loading || drop.value === undefined ? (
              <Skeleton />
            ) : (
              `${lookup(drop.value, drop.symbol)} ${drop.symbol}`
            )}
          </div>
          <div className={styles.ust}>
            {coming || loading || drop.ust === undefined ? (
              <Skeleton variant="subtitle" />
            ) : (
              `${lookup(drop.ust, UUSD)} UST`
            )}
          </div>
        </div>

        <button
          className={classNames(styles.button, coming && styles.coming)}
          onClick={onClaim}
        >
          {coming ? "Coming Soon" : "Claim"}
        </button>
      </div>
    </Card>
  )
}

export default AirdropCard
