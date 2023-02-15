import { Link, useParams } from 'react-router-dom'
import { useFetchMarkersQuery } from 'src/services/MapService'

type AboutProps = {
  id?: string
}

function About() {
  const { id } = useParams<AboutProps>()
  // const { markers } = useAppSelector((state) => state.mapReducer)
  const { data: markers, isLoading } = useFetchMarkersQuery()

  return (
    <div>
      <h1>This is the about page</h1>
      <div>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          markers?.map((marker, i) => (
            <div key={i}>{marker.x + ' ' + marker.y}</div>
          ))
        )}
        {}
      </div>
      {Boolean(id) && <h1>Parametr {id}</h1>}
      <Link to="/">
        <p style={{ color: '#008900' }}>Click to view home page</p>
      </Link>
    </div>
  )
}

export default About
