import { useEffect, useState } from "react"
import Grid from "../components/Grid"
import useDropslist from "../hooks/useDropslist"
import StatField from "./Dashboard/StatField"
import ToggleButton from "./Dashboard/ToggleButton"
import AirdropCard, { TerraDrop } from "./Dashboard/AirdropCard"
import styles from "./Dashboard.module.scss"
import { useAddress } from "../hooks"
import ClaimModal from "./Dashboard/ClaimModal"
import { plus } from "../libs/math"
import { lookup } from "../libs/parse"
import { UUSD } from "../constants"
import { useClaim } from "../hooks/useClaim"
import { useModal } from "../containers/Modal"
import SuccessModal from "./Dashboard/SuccessModal"

const Dashboard = () => {
  const address = useAddress()
  const { main, soon } = useDropslist()
  const [comingSoon, setComingSoon] = useState(true)
  const [total, setTotal] = useState<string>()
  const [count, setCount] = useState<number>()
  const [loading, setLoading] = useState<boolean>(true)

  const {
    drops,
    setDrops,
    modal: claimModal,
    claimDrops,
    openClaim,
  } = useClaim()
  const successModal = useModal()

  useEffect(() => {
    if (main && Object.values(main)?.length) {
      setDrops(main)
    }
  }, [main, setDrops])

  const handleLoad = (key: string, drop: TerraDrop) => {
    drops[key] = drop
    setDrops({ ...drops })
    const loading = Object.values(drops).find(
      (drop) => drop.value === undefined
    )
    if (!loading) {
      setLoading(false)
      setTotal(
        Object.values(drops).reduce(
          (prev, cur) => plus(prev, cur.value || "0"),
          "0"
        )
      )
      setCount(
        Object.values(drops).reduce((prev, cur) => prev + (cur.count || 0), 0)
      )
    }
  }

  const handleClaim = (drop: TerraDrop) => {
    if (drop) {
      openClaim([drop])
    } else {
      openClaim(Object.values(drops))
    }
    claimModal.open()
  }

  return (
    <div className={styles.container}>
      <div className={styles.stats}>
        <Grid>
          <StatField
            label="Total Value"
            value={`${lookup(total, UUSD)} UST`}
            loading={loading}
          />
          <StatField
            label="Unclaimed"
            value={String(count)}
            loading={loading}
          />
          <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
            <ToggleButton
              label="Coming Soon"
              checked={comingSoon}
              onCheck={setComingSoon}
            />
          </div>
        </Grid>
      </div>

      {main && (
        <Grid wrap={3}>
          {Object.keys(drops).map((index: string) => (
            <AirdropCard
              key={drops[index].protocol}
              address={address}
              drop={drops[index]}
              onLoad={(drop) => handleLoad(index, drop)}
              onClaim={() => handleClaim(drops[index])}
            />
          ))}
        </Grid>
      )}

      {comingSoon && soon && (
        <Grid wrap={3}>
          {(Object.values(soon) as TerraDrop[]).map((drop: TerraDrop) => (
            <AirdropCard key={drop.protocol} drop={drop} />
          ))}
        </Grid>
      )}

      {claimDrops?.length > 0 && (
        <ClaimModal
          modal={claimModal}
          title={`Claim ${
            claimDrops.length > 1 ? "All" : `${claimDrops[0].protocol} Airdrop`
          }`}
          drops={Object.values(claimDrops)}
          onSuccess={() => {
            claimModal.close()
            successModal.open()
            setDrops({ ...main })
          }}
        />
      )}

      <SuccessModal modal={successModal} message="Success" label="Done" />
    </div>
  )
}

export default Dashboard
