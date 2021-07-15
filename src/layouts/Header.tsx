import { useNetwork } from "../hooks"
import { ReactComponent as Logo } from "../images/Logo.svg"
import AppHeader from "../components/AppHeader"
import Connect from "./Connect"

const Header = () => {
  const { name } = useNetwork()

  return (
    <AppHeader
      logo={<Logo height={27} />}
      connect={<Connect />}
      testnet={name !== "mainnet"}
    />
  )
}

export default Header
