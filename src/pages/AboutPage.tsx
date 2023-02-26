import { Link, useParams } from 'react-router-dom'
import { useFetchSportsGroundsQuery } from 'src/services/MapService'

type AboutProps = {
  id?: string
}

function About() {
  const { id } = useParams<AboutProps>()
  // const { markers } = useAppSelector((state) => state.mapReducer)
  const { data: sportsGrounds, isLoading } = useFetchSportsGroundsQuery()

  return (
    <div>
      <h1>This is the about page</h1>
      <div>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          sportsGrounds?.map((sportsGround, i) => (
            <div key={i}>
              {`${sportsGround.marker[0]} ${sportsGround.marker[1]}`}
              {sportsGround.fileUrls?.length && (
                <img src={sportsGround.fileUrls[0]}></img>
              )}
            </div>
          ))
        )}
      </div>
      {Boolean(id) && <h1>Parametr {id}</h1>}
      <Link to="/">
        <p style={{ color: '#008900' }}>Click to view home page</p>
      </Link>
    </div>
  )
}

export default About
