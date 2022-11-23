import { randomStringGenerator } from '../../src/common/helper';
import Chat from '../../models/chat';
import User from '../../models/user';
import commonService from '../../utils/commonService';
import jwt from "jsonwebtoken"
import { Op } from 'sequelize';

const io = require('socket.io')();
const DataStore = require('data-store');
const clientStore = new DataStore({
    path: 'src/chat/store/data.json'
});


let rooms = clientStore.get('rooms', [])


io.on('connection', function (socket) {


    /*
    |----------------------------------------------------------------------------------------------------
    | CREATE ROOM:
    |       - Check sender & receiver exist or not
    |       - Sender & Receiver room exist then join this room Otherwise Create new room
    |       - Send Room connected emit [roomConnected]
    |----------------------------------------------------------------------------------------------------
    */
    socket.on('createRoom', async (data) => {
        const { senderId, receiverId } = data
        const sender = await commonService.findByPk(User, data.senderId)
        const receiver = await commonService.findByPk(User, data.receiverId)

        if (!sender || !receiver) {
            console.log(`${socket.id} is disconnected`);
            return socket.disconnect();
        }

        let roomId = ''
        const roomExist = rooms.filter((room, index) => {
            if (room.senderId == senderId && room.receiverId == receiverId) {
                rooms[index][room.senderId] = socket.id
                roomId = room.roomId
                clientStore.set({ rooms })
                return room
            }
            else if (room.senderId == receiverId && room.receiverId == senderId) {
                rooms[index][room.receiverId] = socket.id
                roomId = room.roomId
                clientStore.set({ rooms })
                return room
            }
        })
        if (!roomExist.length) {
            roomId = randomStringGenerator(10)
            rooms.push({ senderId, receiverId, roomId, [senderId]: socket.id });
            clientStore.set({ rooms })
        }
        console.log(`Room: ${roomId} is connected`);
        socket.join(roomId);
        socket.emit('roomConnected', roomId)
    });


    /*
    |----------------------------------------------------------------------------------------------------
    | STATUS UPDATE FOR ONLINE:
    |       - Send status Online emit [statusOnline]
    |----------------------------------------------------------------------------------------------------
    */
    socket.on('UpdateStatusToOnline', async function (data) {
        console.log('Status update for Online user')
        await commonService.updateByPk(User, Number(data.senderId), { isOnline: true })
        const responseData = {
            isOnline: true,
            senderId: Number(data.senderId)
        }
        socket.broadcast.emit('statusOnline', responseData);
    });


    /*
    |----------------------------------------------------------------------------------------------------
    | SENT ONLINE STATUS: 
    |       - Send Oponent user online status [statusOnline]
    |----------------------------------------------------------------------------------------------------
    */
    socket.on('getOnlineStatus', async function (data) {
        console.log('Get Online status:', data)
        const user = await commonService.findByPk(User, Number(data.receiverId))
        if (user) {
            const responseData = {
                isOnline: user.isOnline,
                senderId: data.receiverId
            }
            io.in(data.roomId).emit('statusOnline', responseData);
        }
    });


    /*
    |----------------------------------------------------------------------------------------------------
    | TYPING: 
    |       - Send typing emit [DisplayTyping]
    |----------------------------------------------------------------------------------------------------
    */
    socket.on('typing', function (data) {
        console.log('Typing:', data);
        socket.broadcast.to(data.roomId).emit('DisplayTyping', data);
    });


    /*
    |----------------------------------------------------------------------------------------------------
    | REMOVE TYPING: 
    |       - Send remove typing emit [removeTyping]
    |----------------------------------------------------------------------------------------------------
    */
    socket.on('removeTyping', function (data) {
        console.log('Remove typing:', data);
        socket.broadcast.to(data.roomId).emit('removeTyping', data);
    });


    /*
    |----------------------------------------------------------------------------------------------------
    | SEND MESSAGE: 
    |       - Send Message To Oponent [newMessage]  
    |       - MESSAGE STORE IN DB & PUSH NOTIFY
    |----------------------------------------------------------------------------------------------------
    */
    socket.on('sendMessage', async (data) => {
        console.log(data);
        const chat = await commonService.createOne(Chat, data)
        data.chatId = chat.id
        socket.broadcast.to(data.roomId).emit('newMessage', data);
        // - MESSAGE STORE IN DB & SENT PUSH NOTIFICATION HERE

    });


    /*
    |----------------------------------------------------------------------------------------------------
    | READ MESSAGE: Read a message    
    |       - SENT MESSAGE SEEN EMIT TO OPONENT [seenMessage]
    |----------------------------------------------------------------------------------------------------
    */
    socket.on('ReadMessage', async function (data) {
        console.log(data);
        if (data.chatId > 0) {
            await commonService.updateByQuery(Chat,
                {
                    senderId: data.senderId,
                    receiverId: data.receiverId,
                    id: { [Op.lte]: data.chatId }
                },
                { seenAt: new Date() })
        }
        socket.broadcast.to(data.roomId).emit('seenMessage', data);
    });


    /*
    |----------------------------------------------------------------------------------------------------
    | DISCONNECTED: 
    |       - Update user online status(IF ANY ERROR EXIST IN FRONT END SIDE)
    |----------------------------------------------------------------------------------------------------
    */
    socket.on('disconnected', async (data) => {
        await commonService.updateByPk(User, data.senderId, { isOnline: false })
        console.log(`User ${data.senderId} disconnected from ${data.roomId}`)
    })

    /*
    |----------------------------------------------------------------------------------------------------
    | DISCONNECT: 
    |       - Update user online status(IF DIRECT CLOSE SOCKET)
    |----------------------------------------------------------------------------------------------------
    */
    socket.on('disconnect', async () => {
        rooms.forEach(async (room) => {
            let userId = 0
            const { senderId, receiverId } = room
            if (room[senderId] == socket.id) {
                userId = senderId
            }
            else if (room[receiverId] == socket.id) {
                userId = receiverId
            }
            if (userId > 0) {
                const responseData = {
                    isOnline: false,
                    senderId: Number(userId)
                }
                io.in(room.roomId).emit('statusOnline', responseData);
                socket.broadcast.to(room.roomId).emit('removeTyping', responseData);
                await commonService.updateByPk(User, userId, { isOnline: false })
            }
        })
        console.log('disconnected:', socket.id)
    })
})

export default io


