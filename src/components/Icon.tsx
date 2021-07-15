import classNames from "classnames"

interface Props {
  name: string
  size?: string | number
  color?: string
  className?: string
}

const Icon = ({ name, size, color, className }: Props) => (
  <i
    className={classNames("material-icons", className)}
    style={{ fontSize: size, width: size, color: color }}
  >
    {name}
  </i>
)

export default Icon
