import Container from "./../components/Container"
import styles from "./Footer.module.scss"

const Footer = () => {
  return (
    <Container>
      <div className={styles.footer}>
        Terra Drops is provided “as is”, at your own risk, and without warranty
        of any kind.
      </div>
    </Container>
  )
}

export default Footer
