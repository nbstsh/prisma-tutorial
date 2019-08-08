const Query = {
	users(parent, { query }, { prisma }, info) {
		const optionArgs = {};

		if (query) {
			optionArgs.where = {
				OR: [{ name_contains: query }, { email_contains: query }]
			};
		}

		return prisma.query.users(optionArgs, info);
	},
	user(parent, args, { prisma }, info) {
		return prisma.query.user(
			{
				where: {
					id: args.id
				}
			},
			info
		);
	},
	posts(parent, { query }, { prisma }, info) {
		const optionArgs = {};

		if (query) {
			optionArgs.where = {
				OR: [{ title_contains: query }, { body_contains: query }]
			};
		}

		return prisma.query.posts(optionArgs, info);
	},
	post(parent, args, { prisma }, info) {
		return prisma.query.post(
			{
				where: {
					id: args.id
				}
			},
			info
		);
	},
	comments(parent, args, { prisma }, info) {
		return prisma.query.comments(null, info);
	},
	comment(parent, args, { prisma }, info) {
		return prisma.query.comment(
			{
				where: {
					id: args.id
				}
			},
			info
		);
	}
};

export default Query;
