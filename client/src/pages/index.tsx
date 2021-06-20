import { Link } from "react-router-dom"

const Empty = () => {

  return (
    <div className="page-predentation">
      <div className="card emptypage">
        <span>↖️メニューを開いて部屋を選択<br />または、<Link to="/newroom">新しく部屋を作成</Link></span>
      </div>
    </div>
  )
}

export default Empty
