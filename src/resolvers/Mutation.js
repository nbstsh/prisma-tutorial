import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import getUserId from '../utils/getUserId';

const Mutation = {
	async createUser(parent, { data }, { prisma }, info) {
		const { password } = data;

		if (password.length < 8) {
			throw new Error('Password must be 8 characters or longer.');
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await prisma.mutation.createUser({
			data: {
				...data,
				password: hashedPassword
			}
		});

		return {
			user,
			token: jwt.sign({ userId: user.id }, process.env.JWT_PRIVATEKEY)
		};
	},
	async login(parent, { data }, { prisma }, info) {
		const user = await prisma.query.user({
			where: {
				email: data.email
			}
		});
		if (!user) throw new Error('Unable to login.');

		const isMatch = await bcrypt.compare(data.password, user.password);
		if (!isMatch) throw new Error('Unable to login.');

		return {
			user,
			token: jwt.sign({ userId: user.id }, process.env.JWT_PRIVATEKEY)
		};
	},
	updateUser(parent, { data }, { prisma, request }, info) {
		const userId = getUserId(request);

		return prisma.mutation.updateUser(
			{
				where: {
					id: userId
				},
				data
			},
			info
		);
	},
	async deleteUser(parent, args, { prisma, request }, info) {
		const userId = getUserId(request);

		return prisma.mutation.deleteUser(
			{
				where: { id: userId }
			},
			info
		);
	},
	createPost(parent, { data }, { prisma, request }, info) {
		const userId = getUserId(request);

		return prisma.mutation.createPost(
			{
				data: {
					...data,
					author: {
						connect: {
							id: userId
						}
					}
				}
			},
			info
		);
	},
	async deletePost(parent, { id }, { prisma, request }, info) {
		const userId = getUserId(request);

		const postExists = await prisma.exists.Post({
			id,
			author: {
				id: userId
			}
		});
		if (!postExists) throw new Error('Unable to delete post!');

		return prisma.mutation.deletePost(
			{
				where: {
					id
				}
			},
			info
		);
	},
	async updatePost(parent, { id, data }, { prisma, request }, info) {
		const userId = getUserId(request);

		const postExists = await prisma.exists.Post({
			id,
			author: {
				id: userId
			}
		});
		if (!postExists) throw new Error('Unable to update!');

		return prisma.mutation.updatePost(
			{
				where: {
					id
				},
				data
			},
			info
		);
	},
	createComment(parent, { data }, { prisma, request }, info) {
		const userId = getUserId(request);

		return prisma.mutation.createComment(
			{
				data: {
					text: data.text,
					user: {
						connect: {
							id: userId
						}
					},
					post: {
						connect: {
							id: data.post
						}
					}
				}
			},
			info
		);
	},
	async deleteComment(parent, { id }, { prisma, request }, info) {
		const userId = getUserId(request);

		const commentExists = await prisma.exists.Comment({
			id: id,
			user: {
				id: userId
			}
		});
		if (!commentExists) throw new Error('Unable to delete comment!');

		return prisma.mutation.deleteComment(
			{
				where: {
					id
				}
			},
			info
		);
	},
	async updateComment(parent, { id, data }, { prisma, request }, info) {
		const userId = getUserId(request);

		const commentExists = await prisma.exists.Comment({
			id,
			user: {
				id: userId
			}
		});
		if (!commentExists) throw new Error('Unable to update!');

		return prisma.mutation.updateComment(
			{
				where: {
					id
				},
				data
			},
			info
		);
	}
};

export default Mutation;
