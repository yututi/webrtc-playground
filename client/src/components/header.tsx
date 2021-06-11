import MeInfo from "components/me-info"
import "./header.scss"
import IconBtn from "components/icon-btn"
import { faHamburger } from "@fortawesome/free-solid-svg-icons"
import { useAppDispatch } from "redux/hooks"
import { toggleNavOpen } from "redux/slices/global"

type Props = {
  title: string,
}
const Header: React.FC<Props> = ({ title }) => {

  return (
    <div className="header">
      <div className="header__left">
        <NavToggler></NavToggler>
        <span className="header__title">{title}</span>
      </div>
      <div className="spacer"></div>
      <div className="header__right">
        <MeInfo></MeInfo>
      </div>
    </div>
  )
}

const NavToggler = () => {

  const dispatch = useAppDispatch()

  return (
    <IconBtn icon={faHamburger} onClick={() => dispatch(toggleNavOpen())} />
  )
}

export default Header
