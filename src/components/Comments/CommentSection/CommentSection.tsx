import { type FunctionComponent, useState } from 'react'
import InputComponent from '../../InputComponent/InputComponent'
import { Button, Typography } from '@mui/material'
import { type Comment } from 'src/models'
import CommentsList from '../CommentsList/CommentsList'
import commentSectionStyles from './CommentSection.module.scss'
import Skeleton from '@mui/material/Skeleton'

interface Props {
  comments: Comment[] | undefined
  addComment: (comment: string) => void
  isLoading: boolean
}

const commentSection: FunctionComponent<Props> = ({
  comments,
  addComment,
  isLoading
}) => {
  const [comment, setComment] = useState('')
  const onAddCommentButtonClick = () => {
    addComment(comment)
    setComment('')
  }
  // ToDo add timeout
  return (
    <div className={commentSectionStyles['comment-section']}>
      <Typography textAlign={'left'} fontSize={'18px'}>
        Comments:
      </Typography>
      {isLoading ? (
        [...Array(2)].map((_, i) => {
          return <Skeleton key={i} animation="wave" width="100%" height={100} />
        })
      ) : (
        <CommentsList comments={comments} />
      )}

      <InputComponent
        parentHandleChange={setComment}
        className={commentSectionStyles['comment-input']}
        multiline
        maxRows={20}
      />
      <Button
        variant="outlined"
        sx={{
          '&.Mui-disabled': {
            backgroundColor: '#A0A0A0'
          },
          margin: '20px auto 0',
          padding: '10px',
          width: '200px',
          alignSelf: 'center'
        }}
        onClick={onAddCommentButtonClick}
        disabled={!comment.length}
      >
        Add comment
      </Button>
    </div>
  )
}

export default commentSection
