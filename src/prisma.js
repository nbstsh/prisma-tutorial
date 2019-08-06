import { Prisma } from 'prisma-binding';

const prisma = new Prisma({
	typeDefs: 'src/generated/prisma.graphql',
	endpoint: 'http://localhost:4466/'
});

// prisma.query.users(null, '{ id name posts { id title } }').then(data => {
// 	console.log(JSON.stringify(data, undefined, 2));
// });

// prisma.query.comments(null, '{ id text user { id name } }').then(data => {
// 	console.log(JSON.stringify(data, undefined, 2));
// });

// prisma.mutation
// 	.createUser(
// 		{
// 			data: {
// 				name: 'John',
// 				email: 'jojojojohn@example.com'
// 			}
// 		},
// 		'{ id name email }'
// 	)
// 	.then(data => {
// 		console.log(data);
// 	});

// prisma.mutation
// 	.createPost(
// 		{
// 			data: {
// 				title: 'My name is John.',
// 				body: 'Hello there, I am John. Please call me jojojojohn.',
// 				published: false,
// 				author: {
// 					connect: {
// 						id: 'cjyzxz09000ca0815dgg9xp1l'
// 					}
// 				}
// 			}
// 		},
// 		'{ title body published author { id name } }'
// 	)
// 	.then(data => {
// 		console.log(data);
// 	});

const createPostForUser = async (authorId, data) => {
	const userExists = await prisma.exists.User({
		id: authorId
	});

	if (!userExists) {
		throw new Error('User with give id was not found!');
	}

	const post = await prisma.mutation.createPost(
		{
			data: {
				...data,
				author: {
					connect: {
						id: authorId
					}
				}
			}
		},
		'{ author { id name email posts { id title body published } } }'
	);

	return post.author;
};

const updatePostForUser = async (postId, data) => {
	const postExists = await prisma.exists.Post({
		id: postId
	});

	if (!postExists) {
		throw new Error('Post with given id was not found!');
	}

	const updatedPost = await prisma.mutation.updatePost(
		{
			where: {
				id: postId
			},
			data
		},
		'{ id author { id name email posts { id title body published } } }'
	);

	return updatedPost.author;
};

// createPostForUser('cjyzxz09000ca0815dgg9xp1l', {
// 	title: 'my dream 2',
// 	body: 'I dream ..... Oh my dream.....',
// 	published: false
// })
// 	.then(user => {
// 		console.log(user);
// 	})
// 	.catch(err => {
// 		console.log(err.message);
// 	});

// updatePostForUser('cjz048qsu00e308152xfnd3u4', {
// 	published: true
// }).then(user => {
// 	console.log(user);
// });
