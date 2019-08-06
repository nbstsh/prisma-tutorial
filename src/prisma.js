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

prisma.mutation
	.createPost(
		{
			data: {
				title: 'My name is John.',
				body: 'Hello there, I am John. Please call me jojojojohn.',
				published: false,
				author: {
					connect: {
						id: 'cjyzxz09000ca0815dgg9xp1l'
					}
				}
			}
		},
		'{ title body published author { id name } }'
	)
	.then(data => {
		console.log(data);
	});
