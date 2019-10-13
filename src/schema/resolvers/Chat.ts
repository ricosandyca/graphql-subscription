import { ApolloError, IResolvers, PubSub } from 'apollo-server-express'

import Chat, { IChat } from '../../models/Chat'

const pubsub = new PubSub()
const NEW_MESSAGE = 'NEW_MESSAGE'

const ChatResolvers: IResolvers = {
  Query: {
    chats: async () => {
      try {
        const chats = await Chat.find({})
        return chats
      } catch {
        return new ApolloError('Internal server error', '500')
      }
    },
    chat: async (_, { _id }) => {
      try {
        const chat = await Chat.findById(_id)
        return chat
      } catch {
        return new ApolloError('Internal server error', '500')
      }
    }
  },
  Mutation: {
    createChat: async (_, args: IChat) => {
      try {
        const createChat = new Chat()
        createChat.name = args.name
        createChat.message = args.message
        const newChat = await createChat.save()
        pubsub.publish(NEW_MESSAGE, { newMessage: newChat })
        return newChat
      } catch {
        return new ApolloError('Internal server error', '500')
      }
    },
    updateChat: async (_, args: IChat & { _id: string }) => {
      try {
        const updateChat = await Chat
          .findByIdAndUpdate(
            args._id,
            {
              name: args.name,
              mesage: args.message
            },
            {
              new: true
            }
          )
        if (updateChat) return updateChat
        else return new ApolloError('Chat not found', '404')
      } catch {
        return new ApolloError('Internal server error', '500')
      }
    },
    deleteChat: async (_, args: { _id: string }) => {
      try {
        const deleteChat = await Chat.findByIdAndRemove(args._id)
        return deleteChat
      } catch {
        return new ApolloError('Internal server error', '500')
      }
    }
  },
  Subscription: {
    newMessage: {
      subscribe: () => pubsub.asyncIterator(NEW_MESSAGE)
    }
  }
}

export default ChatResolvers
