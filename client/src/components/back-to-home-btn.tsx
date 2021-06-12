import { faAngleDoubleLeft } from "@fortawesome/free-solid-svg-icons"
import { useHistory } from "react-router-dom"
import IconBtn from "./icon-btn"

type Props = {
  text?: string
}

const B2HBtn: React.VFC<Props> = ({ text = "戻る" }) => {

  const history = useHistory()

  return (
    <IconBtn
      onClick={() => history.push("/")}
      icon={faAngleDoubleLeft}
      text={text}
      iconSize="lg"
    />
  )
}

export default B2HBtn
