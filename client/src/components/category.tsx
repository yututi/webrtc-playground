import React, { useRef, useState } from "react"
import Rooms from "components/rooms"
import { RoomsProvider, useRoomsContext } from "modules/rooms"
import { Room } from "modules/types"
import Dialog from "components/dialog"

type Props = {
  categoryId: string
  categoryName: string
}

const Category: React.FC<Props> = ({ categoryId, categoryName }) => {

  const [isOpen, setIsOpen] = useState(false)

  return (
    <RoomsProvider>
      <div className="category">
        <div className="category__upper">
          <h2>{categoryName}</h2>
          <button className="button" onClick={() => { setIsOpen(true) }}>Create new room.</button>
        </div>
        <div className="category__lower">
          <Rooms />
        </div>
      </div>
      <Dialog isOpen={isOpen} close={() => setIsOpen(false)} dialogTitle="Create new room">
        <AddRoomForm requestClose={() => setIsOpen(false)} />
      </Dialog>
    </RoomsProvider>
  )
}

type AddRoomProps = {
  requestClose: () => void
}

const AddRoomForm: React.FC<AddRoomProps> = ({ requestClose }) => {

  const [roomName, setRoomName] = useState("")

  const { addRoom } = useRoomsContext()

  const addNewRoom = () => {

  }

  return (
    <form className="room-config">
      <div className="room-config__input">
        <label>Room name</label>
        <input type="text" value={roomName} onChange={(e) => { setRoomName(e.target.value) }} />
      </div>
      <button className="button" onClick={addNewRoom}>Create</button>
    </form>
  )
}

export default Category