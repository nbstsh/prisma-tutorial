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
	createComment(parent, { data }, { db, pubsub }, info) {
		const { dummyUsers, dummyPosts, dummyComments } = db;

		const userExists = dummyUsers.some(user => user.id === data.user);
		if (!userExists) throw new Error('User with given id was not found!');

		const postExists = dummyPosts.some(post => post.id === data.post);
		if (!postExists) throw new Error('Post with given id was not found!');

		const comment = {
			id: uuidv4(),
			...data
		};

		pubsub.publish(`comment ${data.post}`, {
			comment: {
				mutation: MUTATION_TYPE.CREATED,
				data: comment
			}
		});

		dummyComments.push(comment);

		return comment;
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
	updateComment(parent, { id, data }, { db, pubsub }, info) {
		const { dummyComments } = db;
		const comment = dummyComments.find(comment => comment.id === id);
		if (!comment) throw new Error('Comment with give id was not found!');

		Object.keys(data).forEach(key => (comment[key] = data[key]));

		pubsub.publish(`comment ${comment.post}`, {
			comment: {
				mutation: MUTATION_TYPE.UPDATED,
				data: comment
			}
		});

		return comment;
	}
};

export default Mutation;
