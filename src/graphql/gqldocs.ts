import { gql } from "@apollo/client"

export const WASMQUERY = "WasmContractsContractAddressStore"

export const CONTRACT = gql`
  query ($contract: String, $msg: String) {
    WasmContractsContractAddressStore(
      ContractAddress: $contract
      QueryMsg: $msg
    ) {
      Height
      Result
    }
  }
`

export const TAX = gql`
  query {
    TreasuryTaxRate {
      Result
    }

    TreasuryTaxCapDenom(Denom: "uusd") {
      Result
    }
  }
`

export const TXINFOS = gql`
  query ($hash: String) {
    TxInfos(TxHash: $hash) {
      Height
      TxHash
      Success
      RawLog

      Tx {
        Fee {
          Amount {
            Amount
            Denom
          }
        }
        Memo
      }

      Logs {
        Events {
          Type
          Attributes {
            Key
            Value
          }
        }
      }
    }
  }
`

export const GET_MIRROR_DROPS = gql`
  query airdropQuery($address: String!, $network: String) {
    airdrop(address: $address, network: $network)
  }
`

export const GET_MIRROR_PRICE = gql`
  query price($token: String!) {
    asset(token: $token) {
      symbol
      name
      prices {
        price
      }
    }
  }
`

export const GET_ANCHOR_PRICE = gql`
  query __ancPrice($ANCTerraswap: String!, $poolInfoQuery: String!) {
    ancPrice: WasmContractsContractAddressStore(
      ContractAddress: $ANCTerraswap
      QueryMsg: $poolInfoQuery
    ) {
      Result
      __typename
    }
  }
`

export const GET_ANCHOR_CLAIMED = gql`
  query __isClaimed($ANCTerraswap: String!, $poolInfoQuery: String!) {
    isClaimed: WasmContractsContractAddressStore(
      ContractAddress: $ANCTerraswap
      QueryMsg: $poolInfoQuery
    ) {
      Result
    }
  }
`

export const GET_MIRROR_PRICE = gql`
  query price {
    MirrorTokenInfo {
      price
    }
  }
`

export const GET_MIRROR_MIR_DROPS = gql`
  query mirrorMirDrops($address: String!) {
    airdropMir(address: $address) {
      stage
      amount
      claimable
      proof
    }
  }
`

export const GET_MIRROR_LUNA_DROPS = gql`
  query mirrorLunaDrops($address: String!) {
    airdropLuna(address: $address) {
      stage
      amount
      claimable
      proof
    }
  }
`

export const GET_NEXUS_DROPS = gql`
  query nexusDrops($address: String!) {
    findAirdropsByAddress(address: $address) {
      claimablePsiTokens
      proofs
      stage
    }
  }
`
