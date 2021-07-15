import { FC, ReactNode } from "react"
import Container from "./Container"
import styles from "./Page.module.scss"

interface Props {
  title?: ReactNode
  description?: ReactNode
  action?: ReactNode
  select?: ReactNode
  doc?: string
  sm?: boolean
  noBreak?: boolean
  titleStyle?: object
}

const Page: FC<Props> = ({
  title,
  titleStyle,
  description,
  children,
  ...props
}) => {
  const { action, sm, noBreak } = props

  return (
    <article className={styles.article}>
      {title && (
        <header className={styles.header} style={titleStyle}>
          <section className={styles.heading}>
            <h1 className={styles.title}>{title}</h1>

            {description && (
              <section className={styles.description}>{description}</section>
            )}
          </section>
          {action && <section className={styles.action}>{action}</section>}
        </header>
      )}

      {!!title && !noBreak && <hr />}

      {sm ? <Container sm>{children}</Container> : children}
    </article>
  )
}

export default Page
