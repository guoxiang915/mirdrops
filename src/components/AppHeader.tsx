import { useState, useEffect, ReactNode } from "react"
import { Link, useLocation } from "react-router-dom"
import classNames from "classnames/bind"
import Container from "./Container"
import Icon from "./Icon"
import styles from "./AppHeader.module.scss"
import MESSAGE from "../lang/MESSAGE.json"
import Button from "./Button"
import { useClaim } from "../hooks/useClaim"

const cx = classNames.bind(styles)

interface Props {
  logo: ReactNode
  connect: ReactNode
  border?: boolean
  testnet?: boolean
}

const AppHeader = ({ logo, connect, border, testnet }: Props) => {
  const { key } = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  const { openClaim } = useClaim()

  useEffect(() => {
    setIsOpen(false)
  }, [key])

  const claimAll = () => {
    openClaim()
  }

  return (
    <header className={cx(styles.header, { collapsed: !isOpen })}>
      {testnet && (
        <div className={styles.networkAlert}>
          <section className={styles.alertText}>
            <Icon name="report_problem_outlined" size={16} />
            <span>{MESSAGE.App.TestnetAlert}</span>
          </section>
        </div>
      )}
      <Container>
        <div className={styles.container}>
          <section className={styles.wrapper}>
            <h1>
              <Link to="/" className={styles.logo}>
                {logo} TerraDrops
              </Link>
            </h1>
          </section>

          <section className={styles.support}>
            <a
              href="https://defynelabs.notion.site/TerraDrops-55898600df064e85a67783ab151b252c"
              target="_blank"
              className={cx(styles.faq, styles.desktopOnly)}
              rel="noreferrer"
            >
              FAQ
            </a>

            <div className={styles.connect}>{connect}</div>

            <div className={styles.claim}>
              <a
                href="https://defynelabs.notion.site/TerraDrops-55898600df064e85a67783ab151b252c"
                target="_blank"
                className={cx(styles.faq, styles.mobileOnly)}
                rel="noreferrer"
              >
                FAQ
              </a>
              <Button
                onClick={claimAll}
                type="button"
                className={styles.claimButton}
              >
                Claim All
              </Button>
            </div>
          </section>
        </div>

        {border && !isOpen && <hr className={styles.hr} />}
      </Container>
    </header>
  )
}

export default AppHeader
