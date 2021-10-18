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
          result.json().then((json) => {
            if (!json.testnet) {
              json.testnet = {}
            }

            // TODO: move this config to new whitelist for staking
            json.testnet["luna"] = {
              protocol: "Luna Staking Rewards",
              symbol: "LUNA",
              icon: "https://whitelist.mirdrops.io/logos/luna.png",
              fcd: "https://fcd.terra.dev/v1/",
              lcd: "https://lcd.terra.dev",
              type: "terra",
              app_url: "https://station.terra.money/staking",
            }
            setDrops(json)
          })
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
