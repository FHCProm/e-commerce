// TODO: replace this with your DB call (Prisma, Mongoose, etc.)
const allProducts = [
    { id: 1, title: 'T-shirt', price: 20, category: 'clothing' },
    { id: 2, title: 'Mug', price: 8, category: 'home' },
    // ...
];

// simple filtering/search/pagination for demo
let filtered = allProducts.filter(p =>
    (!search || p.title.toLowerCase().includes(search.toLowerCase())) &&
    (!category || p.category === category)
);

const total = filtered.length;
filtered = filtered.slice((page - 1) * limit, page * limit);

return {
    data: filtered,
    meta: { total, page, limit }
};
