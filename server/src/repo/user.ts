type User = {
  id: string
  name: string
  roomId?: string
}

class UserRepository {
  private users: User[] = []

  addUser(user: User) {
    this.users.push(user)
  }

  listUsers() {
    return this.users
  }

  getUserById(userId: string) {
    return this.users.find(user => user.id === userId)
  }

  removeUser(userId: string) {
    this.users = this.users.filter(user => user.id !== userId)
  }

  setRoom(userId, roomId) {
    const user = this.users.find(user => user.id === userId)
    if (user) user.roomId = roomId
  }

  leaveUsersByRoomId(roomId) {
    const users = this.users.filter(user => user.roomId === roomId)
    users.forEach(user => user.roomId = null)
  }
}

export default new UserRepository()