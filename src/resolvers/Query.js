const Query = {
	users(parent, { query }, { db, prisma }, info) {
		const optionArgs = {};

		if (query) {
			optionArgs.where = {
				OR: [{ name_contains: query }, { email_contains: query }]
			};
		}

		return prisma.query.users(optionArgs, info);
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
