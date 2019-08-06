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
		'{ id }'
	);
	const user = await prisma.query.user(
		{
			where: {
				id: authorId
			}
		},
		'{ id name email posts { id title body published } comments { id text } }'
	);

	return user;
};

const updatePostForUser = async (postId, data) => {
	const updatedPost = await prisma.mutation.updatePost(
		{
			where: {
				id: postId
			},
			data
		},
		'{ id author { id} }'
	);
	const user = await prisma.query.user(
		{
			where: {
				id: updatedPost.author.id
			}
		},
		'{ id name email posts { id title body published } comments { id text } }'
	);

	return user;
};

// createPostForUser('cjyzxz09000ca0815dgg9xp1l', {
// 	title: 'my dream',
// 	body: 'I dream .....',
// 	published: false
// }).then(user => {
// 	console.log(user);
// });

updatePostForUser('cjyzywx5p00d908154xxkmdq6', {
	published: true
}).then(user => {
	console.log(user);
});
