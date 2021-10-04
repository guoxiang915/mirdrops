import Modal from "../../containers/Modal"
import Card from "../../components/Card"

import styles from "./MaintenanceModal.module.scss"

const MaintenanceModal = () => {
  return (
    <Modal isOpen open={() => {}} close={() => {}} className={styles.modal}>
      <Card className={styles.card}>
        <div className={styles.title}>Maintenance</div>
        <div className={styles.message}>
          Terradrops is currently undergoing maintennance. Please check back
          soon.
        </div>
      </Card>
    </Modal>
  )
}

export default MaintenanceModal
