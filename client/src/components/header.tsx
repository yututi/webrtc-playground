import MeInfo from "components/own-info"
import "./header.scss"
import IconBtn from "components/icon-btn"
import { faBars } from "@fortawesome/free-solid-svg-icons"
import { faGithub } from "@fortawesome/free-brands-svg-icons"
import { useAppDispatch } from "redux/hooks"
import { toggleNavOpen } from "redux/slices/global"
import { useHistory } from "react-router-dom"

type Props = {
  title: string,
}
const Header: React.FC<Props> = ({ title }) => {

  const history = useHistory()

  return (
    <div className="header">
      <div className="header__left">
        <NavToggler></NavToggler>
        <span className="header__title" onClick={() => history.push("/")}>{title}</span>
      </div>
      <div className="spacer"></div>
      <div className="header__right">
        <IconBtn iconSize="2x" icon={faGithub} onClick={() => window.open(process.env.REACT_APP_GITHUB_URL)}></IconBtn>
        <MeInfo></MeInfo>
      </div>
    </div>
  )
}

const NavToggler = () => {

  const dispatch = useAppDispatch()

  return (
    <IconBtn iconSize="lg" icon={faBars} onClick={() => dispatch(toggleNavOpen())} />
  )
}

export default Header
