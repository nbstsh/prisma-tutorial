import bcrypt from 'bcrypt';
import { MUTATION_TYPE } from '../constants';

const Mutation = {
	async createUser(parent, { data }, { prisma }, info) {
		const { password } = data;

		if (password.length < 8) {
			throw new Error('Password must be 8 characters or longer.');
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		return prisma.mutation.createUser(
			{
				data: {
					...data,
					password: hashedPassword
				}
			},
			info
		);
	},
	updateUser(parent, { id, data }, { prisma }, info) {
		return prisma.mutation.updateUser(
			{
				where: {
					id
				},
				data
			},
			info
		);
	},
	async deleteUser(parent, { id }, { prisma }, info) {
		return prisma.mutation.deleteUser(
			{
				where: { id }
			},
			info
		);
	},
	createPost(parent, { data }, { prisma }, info) {
		return prisma.mutation.createPost(
			{
				data: {
					...data,
					author: {
						connect: {
							id: data.author
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
