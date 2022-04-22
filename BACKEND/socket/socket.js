module.exports= function(io) {
	io.on('connection', (socket) =>{
		// console.log('A user is connected');
		
		socket.on('friendRequest', (friend, callback)=> {
			// console.log(friend.sender+ " "+ friend.receiver);
			io.to(friend.recipient).emit('newFriendRequest', {
				from: friend.sender,
				to: friend.recipient
			});
			callback();
		});
	});
}