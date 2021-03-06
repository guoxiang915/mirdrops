import routes from "../routes"
import Container from "../components/Container"
import { ContractProvider, useContractState } from "../hooks/useContract"
import useAddress from "../hooks/useAddress"
import Header from "./Header"
import "./App.scss"
import { ClaimProvider, useClaimState } from "../hooks/useClaim"
import Footer from "./Footer"
import { IS_MAINTENANCE } from "./../constants"
import MaintenanceModal from "../pages/Dashboard/MaintenanceModal"

const App = () => {
  const address = useAddress()
  const contract = useContractState(address)
  const claim = useClaimState()

  return (
    <ContractProvider value={contract}>
      <ClaimProvider value={claim}>
        <Header />
        <Container>{routes()}</Container>
        <Footer />

        {IS_MAINTENANCE && <MaintenanceModal />}
      </ClaimProvider>
    </ContractProvider>
  )
}

export default App
