import styles from "./Skeleton.module.scss"
import classNames from "classnames"

interface Props {
  variant?: "title" | "subtitle"
}

const Skeleton = ({ variant }: Props) => {
  return (
    <div className={classNames(styles.skeleton, styles[variant || "title"])} />
  )
}

export default Skeleton
