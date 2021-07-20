import styles from "./LoadingProgress.module.scss"

const LoadingProgress = ({ title }: { title: string }) => {
  return <div className={styles.container}>{title}</div>
}

export default LoadingProgress
