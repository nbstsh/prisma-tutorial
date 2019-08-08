import uuidv4 from 'uuid/v4';
import { MUTATION_TYPE } from '../constants';

const Mutation = {
	async createUser(parent, { data }, { prisma }, info) {
		return prisma.mutation.createUser({ data }, info);
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
	deleteComment(parent, { id }, { db, pubsub }, info) {
		const { dummyComments, deleteComment } = db;

		const comment = dummyComments.find(comment => comment.id === id);
		if (!comment) throw new Error('Comment with given id was not found!');

		pubsub.publish(`comment ${comment.post}`, {
			comment: {
				mutation: MUTATION_TYPE.DELETED,
				data: comment
			}
		});

		return deleteComment(id);
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
