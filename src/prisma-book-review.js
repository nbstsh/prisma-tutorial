import { Prisma } from 'prisma-binding';

const prisma = new Prisma({
	typeDefs: 'src/generated/prisma-book-review.graphql',
	endpoint: 'http://localhost:4466/review/default'
});

const createUser = async data => {
	return await prisma.mutation.createUser(
		{
			data
		},
		'{ id name email }'
	);
};

const createBook = async data => {
	return await prisma.mutation.createBook(
		{
			data
		},
		'{ id title isbn }'
	);
};

const createReview = async (authorId, bookId, text) => {
	const authorExists = await prisma.exists.User({ id: authorId });
	if (!authorExists) {
		throw new Error('Use with given id was not found!');
	}

	const bookExists = await prisma.exists.Book({ id: bookId });
	if (!bookExists) {
		throw new Error('Book with given id was not found!');
	}

	return await prisma.mutation.createReview(
		{
			data: {
				text,
				author: {
					connect: {
						id: authorId
					}
				},
				book: {
					connect: {
						id: bookId
					}
				}
			}
		},
		' { id text createdAt author { id name email } book { id title isbn } }'
	);
};

// debug
const exec = async pr => {
	try {
		const res = await pr;
		console.log(res);
	} catch (err) {
		console.log(err);
	}
};

// exec(
// 	createReview(
// 		'cjz19cg4100ki0815hhmuwfvq',
// 		'cjz19j8f000ld08156zd44dlx',
// 		'this book is great!!!!!'
// 	)
// );

// exec(
// 	createBook({
// 		title: 'sample book 2',
// 		isbn: 'sdfffn81730'
// 	})
// );

// exec(
//   createUser({
//     name: 'sampel user 1',
//     email: 'sampleuser1@example.com'
//   })
// )
