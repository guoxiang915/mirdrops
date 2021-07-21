import Modal from "./../../containers/Modal"
import Card from "../../components/Card"
import Button from "../../components/Button"
import Particles from "react-tmirrorticles"
import { loadConfettiShape } from "tmirrorticles-shape-confetti"

import styles from "./SuccessModal.module.scss"

import FlowerImg from "../../images/Flower.svg"

const SuccessModal = ({
  message,
  label = "Finish",
  modal,
  onDone,
}: {
  message: string
  label?: string
  modal: Modal
  onDone?: VoidFunction
}) => {
  const particlesInit = (tmirrorticles: any) => {
    loadConfettiShape(tmirrorticles)
  }

  const particlesLoaded = () => {}

  return (
    <Modal {...modal} className={styles.modal}>
      <Card className={styles.card}>
        <div className={styles.message}>{message}</div>
        <div className={styles.congrats}>
          <img src={FlowerImg} alt="Success" className={styles.img} />
          <Particles
            id="tmirrorticles"
            className={styles.tmirrorticles}
            init={particlesInit}
            loaded={particlesLoaded}
            options={{
              fullScreen: { enable: true },
              fpsLimit: 60,
              particles: {
                number: {
                  value: 0,
                },
                color: {
                  value: ["#00FFFC", "#FC00FF", "#fffc00"],
                },
                shape: {
                  type: "confetti",
                  options: {
                    confetti: {
                      type: ["circle", "square"],
                    },
                  },
                },
                opacity: {
                  value: 1,
                  animation: {
                    enable: true,
                    minimumValue: 0,
                    speed: 2,
                    startValue: "max",
                    destroy: "min",
                  },
                },
                size: {
                  value: 7,
                  random: {
                    enable: true,
                    minimumValue: 3,
                  },
                },
                links: {
                  enable: false,
                },
                life: {
                  duration: {
                    sync: true,
                    value: 5,
                  },
                  count: 1,
                },
                move: {
                  enable: true,
                  gravity: {
                    enable: true,
                    acceleration: 20,
                  },
                  speed: 20,
                  decay: 0.1,
                  direction: "none",
                  random: true,
                  straight: false,
                  outModes: {
                    default: "destroy",
                    top: "none",
                  },
                },
              },
              interactivity: {
                detectsOn: "window",
                events: {
                  resize: true,
                },
              },
              detectRetina: true,
              background: {
                color: "#00000000",
                opacity: 0,
              },
              emitters: {
                direction: "none",
                life: {
                  count: 0,
                  duration: 0.1,
                  delay: 0.4,
                },
                rate: {
                  delay: 0.1,
                  quantity: 100,
                },
                size: {
                  width: 0,
                  height: 0,
                },
              },
            }}
          />
        </div>
        <Button
          onClick={() => {
            onDone?.()
            modal.close()
          }}
          size="lg"
        >
          {label}
        </Button>
      </Card>
    </Modal>
  )
}

export default SuccessModal
