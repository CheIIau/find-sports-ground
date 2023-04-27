import { type FunctionComponent } from 'react'
import { type Comment } from 'src/models'
import { AccountCircle as AccountCircleIcon } from '@mui/icons-material'
import { SvgIcon, Typography } from '@mui/material'
import commentStyles from './CommentsList.module.scss'
import { formatDate } from 'src/utils'

interface Props {
  comments: Comment[] | undefined
}

const commentsList: FunctionComponent<Props> = ({ comments }) => {
  return (
    <>
      {comments?.length ? (
        comments?.map((comment) => {
          return (
            <div className={commentStyles.comment} key={comment.time}>
              <SvgIcon
                component={AccountCircleIcon}
                inheritViewBox
                fontSize={'large'}
                sx={{ marginRight: '8px' }}
              />
              <div className={commentStyles.comment__body}>
                <div>
                  <p>{comment.username}</p>
                  <p>{formatDate(comment.time)}</p>
                </div>
                <p>{comment.body}</p>
              </div>
            </div>
          )
        })
      ) : (
        <Typography sx={{ textAlign: 'center' }}>
          There is no comments yet. Be the first one who leaves one
        </Typography>
      )}
    </>
  )
}

export default commentsList
