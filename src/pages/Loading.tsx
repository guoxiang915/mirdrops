import LoadingProgress from "../components/LoadingProgress"
import { ReactComponent as Logo } from "../images/Logo.svg"
import styles from "./Loading.module.scss"

const Loading = () => {
  return (
    <div className={styles.container}>
      <section className={styles.title}>
        <Logo height={27} /> TerraDrops
      </section>

      <div className={styles.loader}>
        <LoadingProgress title="Loading" />
      </div>
    </div>
  )
}

export default Loading
