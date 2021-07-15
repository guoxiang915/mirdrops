import createContext from "./createContext"
import { TerraDrop } from "./../pages/Dashboard/AirdropCard"
import { useState } from "react"
import { useModal } from "../containers/Modal"

type TerraDropMap = { [key: string]: TerraDrop }
interface ClaimState {
  drops: TerraDropMap
  setDrops: (drops: TerraDropMap) => void
  claimDrops: TerraDrop[]
  modal: Modal
  openClaim: (drops?: TerraDrop[]) => void
}

const context = createContext<ClaimState>("useClaim")
export const [useClaim, ClaimProvider] = context

/* state */
export const useClaimState = (): ClaimState => {
  const [drops, setDrops] = useState<TerraDropMap>({})
  const [claimDrops, setClaimDrops] = useState<TerraDrop[]>([])
  const modal = useModal()

  const openClaim = (selected?: TerraDrop[]) => {
    if (drops && Object.values(drops).length) {
      if (selected?.length) {
        setClaimDrops(selected)
      } else {
        setClaimDrops(Object.values(drops))
      }
      modal.open()
    }
  }

  return { drops, setDrops, claimDrops, modal, openClaim }
}
