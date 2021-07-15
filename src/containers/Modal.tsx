import { FC, useState } from "react"
import ReactModal from "react-modal"
import classNames from "classnames"
import styles from "./Modal.module.scss"

ReactModal.setAppElement("#mirdrops")

const Modal: FC<Modal> = ({ isOpen, close, className, children }) => (
  <ReactModal
    className={classNames(styles.modal, className)}
    overlayClassName={styles.overlay}
    isOpen={isOpen}
    onRequestClose={close}
  >
    {children}
  </ReactModal>
)

export default Modal

/* modal */
export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  return { isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) }
}
