const Query = {
	users(parent, args, { db, prisma }, info) {
		console.log(info);
		console.log(prisma);

		return prisma.query.users(null, info);

		// return db.dummyUsers;
	},
	posts(parent, args, { db }, info) {
		return db.dummyPosts;
	},
	post(parent, args, { db }, info) {
		return db.dummyPosts.find(post => post.id === args.id);
	},
	comments(parent, args, { db }, info) {
		return db.dummyComments;
	},
	comment(parent, args, { db }, info) {
		return db.dummyComments.find(comment => comment.id === args.id);
	}
};

export default Query;
