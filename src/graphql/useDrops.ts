import "dotenv/config"
import { ApolloClient, InMemoryCache } from "@apollo/client"
import { DefaultApolloClientOptions } from "../layouts/Network"
import { TerraDrop } from "../pages/Dashboard/AirdropCard"
import { GET_ANCHOR_PRICE, GET_MIRROR_DROPS, GET_MIRROR_PRICE } from "./gqldocs"
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
          const { assets, total_share } = JSON.parse(
            result.data?.ancPrice.Result
          )

          return div(assets[0].amount || "1", total_share)
        }
        case "Pylon": {
          const result = await fetch(`${drop.api}/overview`).then((response) =>
            response.json()
          )
          return String(result.priceInUst)
        }
      }
    }
  } catch (error) {
    throw new Error(error)
  }
}

export const getDrops = async (address: string, drop: TerraDrop) => {
  try {
    const price = await getPrice(drop)
    if (address && drop.api) {
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
          const value = drops.reduce(
            (prev: string, drop: any) => plus(prev, drop.amount),
            "0"
          )
          return {
            value,
            count: drops.length || 0,
            ust: times(value, price),
            data: drops,
          }
        }
        case "Pylon": {
          const drops = await fetch(`${drop.api}/airdrop/${address}`).then(
            (result) => result.json()
          )
          const value = toAmount(drops.amount || 0)
          const data = await fetch(`${drop.api}/airdrop/${address}/claim`, {
            method: "POST",
            body: JSON.stringify({
              address,
              amount: drops.amount || 0,
            }),
          })
            .then((result) => result.json())
            .then((result) =>
              result.transactions.map((transaction: any) => {
                const claim = JSON.parse(atob(transaction.value.execute_msg))
                return {
                  ...claim.claim,
                  contract: transaction.value.contract,
                }
              })
            )
          return {
            value,
            count: 1,
            ust: times(value, price),
            data,
          }
        }
      }
    }
  } catch (error) {
    throw new Error(error)
  }
}

export default { getDropClient, getDrops, getPrice }
