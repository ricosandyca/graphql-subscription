import { Schema, Document, model } from 'mongoose'

export interface IChat {
  name: string
  message: string
}

const chatSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  }
}, { timestamps: true })

export default model<IChat & Document>('chats', chatSchema)
