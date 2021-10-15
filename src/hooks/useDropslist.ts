import "dotenv/config"
import { useEffect, useState } from "react"
import { useNetwork } from "."

export const useDropslist = () => {
  const { name } = useNetwork()
  const [drops, setDrops] = useState({
    mainnet: {},
    testnet: {},
    soon: {},
  })

  useEffect(() => {
    // fetch("https://whitelist.mirdrops.io/airdrops.json").then((result) => {
    fetch("https://whitelist.mirdrops.io/airdrops-staging.json").then(
      (result) => {
        if (result.status === 200) {
          result.json().then((json) => setDrops(json))
        }
      }
    )
  }, [])

  return {
    main: name === "mainnet" ? drops.mainnet : drops.testnet,
    soon: drops.soon,
  }
}

export default useDropslist
