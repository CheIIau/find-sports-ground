import { FunctionComponent, useState } from 'react'
import InputComponent from '../InputComponent/InputComponent'
import { Button } from '@mui/material'
import { Comment } from 'src/models'

interface Props {
  comments: Comment[] | undefined
  addComment: (comment: string) => void
}

const commentSection: FunctionComponent<Props> = ({ comments, addComment }) => {
  const [comment, setComment] = useState('')
  return (
    <>
      {comments}
      <InputComponent parentHandleChange={setComment} />
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
        onClick={() => addComment(comment)}
      >
        Add comment
      </Button>
    </>
  )
}

export default commentSection
