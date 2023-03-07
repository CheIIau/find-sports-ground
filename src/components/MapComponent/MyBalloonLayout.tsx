import { FunctionComponent } from 'react'

const MyBalloonLayout: FunctionComponent = () => {
  return (
    <div className="popover">
      <a className="close" href="#">
        &times;
      </a>
      <div className="arrow"></div>
      <div className="popover-inner">
        <button className="add-button">Add Sports Ground</button>
      </div>
    </div>
  )
}

export default MyBalloonLayout
