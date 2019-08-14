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
	deletePost(parent, { id }, { prisma }, info) {
		return prisma.mutation.deletePost(
			{
				where: {
					id
				}
			},
			info
		);
	},

	updatePost(parent, { id, data }, { prisma }, info) {
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
	createComment(parent, { data }, { prisma }, info) {
		return prisma.mutation.createComment(
			{
				data: {
					text: data.text,
					user: {
						connect: {
							id: data.user
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
	deleteComment(parent, { id }, { prisma }, info) {
		return prisma.mutation.deleteComment(
			{
				where: {
					id
				}
			},
			info
		);
	},
	updateComment(parent, { id, data }, { prisma }, info) {
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
