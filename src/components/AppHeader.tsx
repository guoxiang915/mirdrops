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
  const toggle = () => setIsOpen(!isOpen)
  const hideToggle = false //menu.every((item) => item.desktopOnly)

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

            {!hideToggle && (
              <button className={styles.toggle} onClick={toggle}>
                <Icon name={!isOpen ? "menu" : "close"} size={24} />
              </button>
            )}
          </section>

          <section className={styles.support}>
            <div className={styles.connect}>{connect}</div>

            <Button onClick={claimAll} type="button" className={styles.claim}>
              Claim All
            </Button>
          </section>
        </div>

        {border && !isOpen && <hr className={styles.hr} />}
      </Container>
    </header>
  )
}

export default AppHeader