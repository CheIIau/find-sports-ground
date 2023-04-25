import { Button, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

function About() {
  // const { markers } = useAppSelector((state) => state.mapReducer)

  return (
    <div>
      <Typography variant="h6" align="center" sx={{ marginBottom: '25px' }}>
        Simple app to find sports ground near you and share some sports ground
        with others. <br /> Nothing more to add
      </Typography>
      <Link to="/">
        <Button
          variant="outlined"
          sx={{
            '&.Mui-disabled': {
              backgroundColor: '#A0A0A0'
            },
            marginTop: '20px',
            padding: '10px',
            width: { xs: '150px', sm: '200px' },
            alignSelf: 'center'
          }}
        >
          Home page
        </Button>
      </Link>
    </div>
  )
}

export default About
