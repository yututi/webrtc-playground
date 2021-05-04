import MeInfo from "components/me-info"
import "./header.scss"

type Props = {
    title: string
}
const Header: React.FC<Props> = ({ title }) => {
    return (
        <div className="header">
            <div className="header__left">
                <div className="header__title">{title}</div>
            </div>
            <div className="spacer"></div>
            <div className="header__right">
                <MeInfo></MeInfo>
            </div>
        </div>
    )
}

export default Header
