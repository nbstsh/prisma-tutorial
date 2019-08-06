import uuidv4 from 'uuid/v4';
import { MUTATION_TYPE } from '../constants';

const Mutation = {
	createUser(parent, { data }, { db }, info) {
		const { dummyUsers } = db;
		const isEmailTaken = dummyUsers.some(user => user.email === data.email);
		if (isEmailTaken) throw new Error('The email is already taken!');

		const user = {
			id: uuidv4(),
			...data,
			posts: [],
			comments: []
		};

		dummyUsers.push(user);

		return user;
	},
	createPost(parent, { data }, { db, pubsub }, info) {
		const { dummyUsers, dummyPosts } = db;

		const user = dummyUsers.find(user => user.id === data.author);
		if (!user) throw new Error('User not exists!');

		const post = {
			id: uuidv4(),
			...data,
			comments: []
		};

		dummyPosts.push(post);

		user.posts.push(data.author);

		if (post.published) {
			pubsub.publish('post', {
				post: {
					mutation: MUTATION_TYPE.CREATED,
					data: post
				}
			});
		}

		return post;
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
	deleteUser(parent, { id }, { db }, info) {
		const { dummyUsers, deletePost, deleteComment } = db;

		const index = dummyUsers.findIndex(user => user.id === id);
		if (index === -1) throw new Error('User with given id not found!');

		// delete user from the dummy array
		const deletedUser = dummyUsers.splice(index, 1)[0];

		const { posts, comments } = deletedUser;

		posts.forEach(deletePost);
		comments.forEach(deleteComment);

		return deletedUser;
	},
	deletePost(parent, { id }, { db, pubsub }, info) {
		const { dummyPosts, deletePost } = db;

		const post = dummyPosts.find(post => post.id === id);
		if (!post) throw new Error('Post with given Id was not found!');

		if (post.published) {
			pubsub.publish('post', {
				post: {
					mutation: MUTATION_TYPE.DELETED,
					data: post
				}
			});
		}

		return deletePost(id);
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
	updateUser(parent, { id, data }, { db }, info) {
		const { dummyUsers } = db;

		const user = dummyUsers.find(user => user.id === id);
		if (!user) throw new Error('User with given id was not found!');

		const { name, email, age } = data;
		if (name) user.name = name;
		if (age) user.age = age;
		if (email) {
			const isEmailTaken = dummyUsers.some(user => user.email === email);
			if (isEmailTaken) throw new Error('The email is already taken.');
			user.email = email;
		}

		return user;
	},
	updatePost(parent, { id, data }, { db, pubsub }, info) {
		const { dummyPosts } = db;
		const post = dummyPosts.find(post => post.id === id);
		if (!post) throw new Error('Post with given id was not found!');

		Object.keys(data).forEach(key => (post[key] = data[key]));

		if (post.published) {
			pubsub.publish('post', {
				post: {
					mutation: MUTATION_TYPE.UPDATED,
					data: post
				}
			});
		}

		return post;
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
