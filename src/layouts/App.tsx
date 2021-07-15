import routes from "../routes"
import Container from "../components/Container"
import { SettingsProvider, useSettingsState } from "../hooks/useSettings"
import { ContractProvider, useContractState } from "../hooks/useContract"
import { StatsProvider, useStatsState } from "../statistics/useStats"
import useConnectGraph from "../hooks/useConnectGraph"
import useAddress from "../hooks/useAddress"
import Header from "./Header"
import "./App.scss"
import { ClaimProvider, useClaimState } from "../hooks/useClaim"

const App = () => {
  const address = useAddress()
  const settings = useSettingsState()
  const contract = useContractState(address)
  const stats = useStatsState()
  const claim = useClaimState()
  useConnectGraph(address)

  return (
    <SettingsProvider value={settings}>
      <ContractProvider value={contract}>
        <StatsProvider value={stats}>
          <ClaimProvider value={claim}>
            <Header />
            <Container>{routes()}</Container>
          </ClaimProvider>
        </StatsProvider>
      </ContractProvider>
    </SettingsProvider>
  )
}

export default App
