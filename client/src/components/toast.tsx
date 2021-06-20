import React, { useEffect } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group"
import { useAppDispatch, useAppSelector } from "redux/hooks"
import { MessageData, removeMessage } from "redux/slices/messages"
import "./toast.scss"

const Toasts: React.VFC = React.memo(() => {

  const msgData = useAppSelector(state => state.message.messageData)

  return (
    <TransitionGroup className="toasts">
      {msgData.map(data => (
        <CSSTransition
          key={data.id}
          timeout={200}
          classNames="toast"
        >
          <Toast message={data} />
        </CSSTransition>
      ))}
    </TransitionGroup>
  )
})

type ToastProps = {
  message: MessageData
}
const Toast: React.VFC<ToastProps> = ({ message }) => {

  const classes = [
    "toasts__toast toast",
    `toast--is-${message.type}`
  ].join(" ")

  const dispatch = useAppDispatch()


  const deleteTotast = () => {
    dispatch(removeMessage(message.id))
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(removeMessage(message.id))
    }, 4000)
    return () => {
      clearTimeout(timeoutId)
    }
  }, [dispatch, message.id])


  return (
    <div className={classes} onClick={deleteTotast}>
      {message.text}
    </div>
  )
}

export default Toasts
