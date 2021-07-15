import classNames from "classnames"
import Toggle from "../../components/Toggle"
import styles from "./ToggleButton.module.scss"

interface Props {
  label: string
  checked: boolean
  onCheck: (checked: boolean) => void
}

const ToggleButton = ({ label, checked, onCheck }: Props) => {
  const toggle = () => onCheck(!checked)

  return (
    <button
      type="button"
      className={classNames(styles.button, checked && styles.on)}
      onClick={toggle}
    >
      <Toggle className={styles.toggle} on={checked} />
      {label}
    </button>
  )
}

export default ToggleButton
