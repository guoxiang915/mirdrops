import { FC } from "react"
import { useWallet, WalletStatus } from "@terra-money/wallet-provider"
import { QueryClient, QueryClientProvider } from "react-query"
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"
import { DefaultOptions } from "@apollo/client"
import useNetwork from "../hooks/useNetwork"

const queryClient = new QueryClient()

export const DefaultApolloClientOptions: DefaultOptions = {
  watchQuery: { notifyOnNetworkStatusChange: true },
  query: { errorPolicy: "all", fetchPolicy: "network-only" },
}

const Network: FC = ({ children }) => {
  const network = useNetwork()
  const { status } = useWallet()
  const client = new ApolloClient({
    uri: network.mantle,
    cache: new InMemoryCache(),
    connectToDevTools: true,
    defaultOptions: DefaultApolloClientOptions,
  })

  return status === WalletStatus.INITIALIZING ? null : (
    <QueryClientProvider client={queryClient}>
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </QueryClientProvider>
  )
}

export default Network
