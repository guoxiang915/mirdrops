import { useWallet } from "@terra-money/wallet-provider"
import MESSAGE from "../lang/MESSAGE.json"
// import { UUSD } from "../constants"
import { truncate } from "../libs/text"
import { useNetwork, useRefetch, useAddress } from "../hooks"
import { AccountInfoKey } from "../hooks/contractKeys"
// import { getPath, MenuKey } from "../routes"
import ConnectedInfo from "../components/ConnectedInfo"

const Wallet = ({ close }: { close: () => void }) => {
  const { disconnect } = useWallet()
  const address = useAddress()
  const { finder } = useNetwork()
  useRefetch([AccountInfoKey.UUSD])

  const info = {
    address,
    disconnect,
    truncated: truncate(address),
    link: { href: finder(address), children: MESSAGE.Wallet.TerraFinder },
    // footer: {
    //   to: { pathname: getPath(MenuKey.SEND), state: { token: UUSD } },
    //   children: MenuKey.SEND,
    // },
  }

  return <ConnectedInfo {...info} close={close} />
}

export default Wallet
