import MeInfo from "components/me-info"
import "./header.scss"
import IconBtn from "components/icon-btn"
import { faHamburger } from "@fortawesome/free-solid-svg-icons"

type Props = {
    title: string,
    onHamburgerClick?: React.MouseEventHandler<HTMLButtonElement>
}
const Header: React.FC<Props> = ({ title, onHamburgerClick }) => {
    return (
        <div className="header">
            <div className="header__left">
                {onHamburgerClick && <IconBtn icon={faHamburger} onClick={onHamburgerClick} />}
                <h2 className="header__title">{title}</h2>
            </div>
            <div className="spacer"></div>
            <div className="header__right">
                <MeInfo></MeInfo>
            </div>
        </div>
    )
}

export default Header
