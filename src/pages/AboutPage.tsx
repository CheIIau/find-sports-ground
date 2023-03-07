import { Link } from 'react-router-dom'

function About() {
  // const { markers } = useAppSelector((state) => state.mapReducer)

  return (
    <div>
      <h1>This is the about page</h1>
      <div></div>
      <Link to="/">
        <p style={{ color: '#008900' }}>Click to view home page</p>
      </Link>
    </div>
  )
}

export default About
