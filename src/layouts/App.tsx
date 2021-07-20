import routes from "../routes"
import Container from "../components/Container"
import { ContractProvider, useContractState } from "../hooks/useContract"
import { StatsProvider, useStatsState } from "../statistics/useStats"
import useConnectGraph from "../hooks/useConnectGraph"
import useAddress from "../hooks/useAddress"
import Header from "./Header"
import "./App.scss"
import { ClaimProvider, useClaimState } from "../hooks/useClaim"
import Footer from "./Footer"

const App = () => {
  const address = useAddress()
  const contract = useContractState(address)
  const stats = useStatsState()
  const claim = useClaimState()
  useConnectGraph(address)

  return (
    <ContractProvider value={contract}>
      <StatsProvider value={stats}>
        <ClaimProvider value={claim}>
          <Header />
          <Container>{routes()}</Container>
          <Footer />
        </ClaimProvider>
      </StatsProvider>
    </ContractProvider>
  )
}

export default App
