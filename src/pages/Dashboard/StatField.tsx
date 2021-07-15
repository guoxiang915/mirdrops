import styles from "./StatField.module.scss"
import Skeleton from "./Skeleton"

interface Props {
  label: string
  loading?: boolean
  value?: string
}

const StatField = ({ label, value, loading }: Props) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.label}>{label}</div>
      <div className={styles.value}>{loading ? <Skeleton /> : value}</div>
    </div>
  )
}

export default StatField
