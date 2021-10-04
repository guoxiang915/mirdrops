import "dotenv/config"
import { ApolloClient, InMemoryCache } from "@apollo/client"
import { DefaultApolloClientOptions } from "../layouts/Network"
import { TerraDrop } from "../pages/Dashboard/AirdropCard"
import {
  GET_ANCHOR_CLAIMED,
  GET_ANCHOR_PRICE,
  GET_MIRROR_DROPS,
  GET_MIRROR_PRICE,
  GET_MIRROR_MIR_DROPS,
  GET_MIRROR_LUNA_DROPS,
  GET_MIRROR_PRICE,
} from "./gqldocs"
import { DROPS_CHAIN_ID } from "../constants"
import { toAmount } from "../libs/parse"
import { div, plus, times } from "../libs/math"

export const getDropClient = (api: string) =>
  new ApolloClient({
    uri: api,
    cache: new InMemoryCache(),
    connectToDevTools: true,
    defaultOptions: {
      ...DefaultApolloClientOptions,
      query: {
        fetchPolicy: "cache-first",
      },
    },
  })

export const getPrice = async (drop: TerraDrop) => {
  try {
    if (drop.api) {
      switch (drop.protocol) {
        case "Mirror": {
          const client = getDropClient(drop.api)
          const result = await client.query({
            query: GET_MIRROR_PRICE,
            variables: { token: drop.token },
            fetchPolicy: "no-cache",
          })
          return result.data?.asset?.prices?.price || "1"
        }
        case "Anchor": {
          const ancPriceUrl = "https://mantle.anchorprotocol.com/?anc--price"
          const client = getDropClient(ancPriceUrl)
          const result = await client.query({
            query: GET_ANCHOR_PRICE,
            variables: {
              ANCTerraswap: drop.token,
              poolInfoQuery: '{"pool":{}}',
            },
            fetchPolicy: "no-cache",
          })
          const { assets } = JSON.parse(result.data?.ancPrice.Result)

          return div(assets[1].amount || "0", assets[0].amount || "1")
        }
        case "Pylon": {
          const result = await fetch(`${drop.api}/overview`).then((response) =>
            response.json()
          )
          return String(result.priceInUst)
        }
        case "Mirror": {
          const client = getDropClient(drop.api)
          const result = await client.query({ query: GET_MIRROR_PRICE })

          return String(result.data?.MirrorTokenInfo?.price)
        }
      }
    }
  } catch (error: any) {
    throw new Error(error)
  }

  return null
}

export const getDrops = async (address: string, drop: TerraDrop) => {
  try {
    const price = await getPrice(drop)
    if (price && address && drop.api) {
      switch (drop.protocol) {
        case "Mirror": {
          const client = getDropClient(drop.api)
          const drops = await client.query({
            query: GET_MIRROR_DROPS,
            variables: { address: address, network: "TERRA" },
            fetchPolicy: "no-cache",
          })
          const value = drops.data?.airdrop?.reduce(
            (prev: string, drop: any) => plus(prev, drop.amount),
            "0"
          )
          return {
            value,
            count: drops.data?.airdrop?.length || 0,
            ust: times(value, price),
            data: drops.data?.airdrop,
          }
        }
        case "Anchor": {
          const drops = await fetch(
            `${drop.api}/get?address=${address}&chainId=${DROPS_CHAIN_ID}`
          ).then((result) => result.json())
          //  .then((result) => result.filter((drop: any) => drop.claimable))

          const ancMantleUrl = "https://mantle.anchorprotocol.com"
          const ancClient = getDropClient(ancMantleUrl)

          const filteredDrops: any[] = []
          await Promise.all(
            drops.map(async (item: any) => {
              const result = await ancClient.query({
                query: GET_ANCHOR_CLAIMED,
                variables: {
                  ANCTerraswap: drop.airdrop,
                  poolInfoQuery: JSON.stringify({
                    is_claimed: {
                      address,
                      stage: item.stage,
                    },
                  }),
                },
                fetchPolicy: "no-cache",
              })

              const { is_claimed } = JSON.parse(result.data?.isClaimed.Result)

              if (!is_claimed) {
                filteredDrops.push(item)
              }
            })
          )

          const value = filteredDrops.reduce(
            (prev: string, drop: any) => plus(prev, drop.amount),
            "0"
          )
          return {
            value,
            count: filteredDrops.length || 0,
            ust: times(value, price),
            data: filteredDrops,
          }
        }
        case "Pylon": {
          const drops = await fetch(`${drop.api}/airdrop/${address}`).then(
            (result) => result.json(),
            () => ({})
          )
          const value = toAmount(drops.amount || 0)
          const data = drops.claimableAirdrops.map((drop: any) => ({
            contract: drop.address,
            stage: drop.stage,
            proof: drop.merkleProof,
            amount: drop.airdropMineAmount,
          }))
          return {
            value,
            count: data.length,
            ust: times(value, price),
            data,
          }
        }
        case "Mirror": {
          const client = getDropClient(drop.api)
          const mirDrops =
            (
              await client.query({
                query: GET_MIRROR_MIR_DROPS,
                variables: { address },
                fetchPolicy: "no-cache",
              })
            ).data?.airdropMir || []

          const lunaDrops =
            (
              await client.query({
                query: GET_MIRROR_LUNA_DROPS,
                variables: { address },
                fetchPolicy: "no-cache",
              })
            ).data?.airdropLuna || []

          const drops = [
            ...mirDrops.map((item: any) => ({ ...item, key: "claim_for_mir" })),
            ...lunaDrops.map((item: any) => ({
              ...item,
              key: "claim_for_luna",
            })),
          ].filter((item: any) => item.claimable)

          const value = drops.reduce(
            (prev: string, drop: any) => plus(prev, drop.amount),
            "0"
          )

          return {
            value,
            count: drops.length,
            ust: times(value, price),
            data: drops,
          }
        }
      }
    }
  } catch (error) {
    console.log(error)
    // throw new Error(error)
  }

  return null
}

export default { getDropClient, getDrops, getPrice }
