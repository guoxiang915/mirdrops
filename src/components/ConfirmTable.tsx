import styles from "./ConfirmTable.module.scss"

const ConfirmTable = ({ list }: { list: assetContent[] }) => (
  <ul className={styles.list}>
    <li className={styles.item}>
      <article className={styles.article}>
        <p className={styles.headerTitle}>Pair</p>
        <p className={styles.headerTitle}>Price</p>
        <p className={styles.headerTitle}>Minimum Received</p>
      </article>
    </li>
    {list.map(({ pair, price, minimumReceived }, index) => (
      <li className={styles.item} key={index}>
        <article className={styles.article}>
          <h1 className={styles.title}>{pair}</h1>
          <p className={styles.content}>{price}</p>
          <p className={styles.content}>{minimumReceived}</p>
        </article>
      </li>
    ))}
  </ul>
)

export default ConfirmTable
