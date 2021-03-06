import { ReactNode } from "react"
import styles from "./ResultFooter.module.scss"

interface Content {
  title?: ReactNode
  content?: ReactNode
}

const ResultFooter = ({ list }: { list: Content[] }) => {
  return (
    <>
      {list.map(({ title, content }, index) => (
        <div className={styles.row} key={index}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.content}>{content}</p>
        </div>
      ))}
    </>
  )
}

export default ResultFooter
