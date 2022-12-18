module.exports = {
  unauthenticated: {
    title: "Unauthenticated user",
    session: {
      status: "unauthenticated",
      data: undefined,
    },
  },
  authenticated: {
    title: "Authenticated user",
    session: {
      status: "authenticated",
      data: {
        user: {
          name: "John Doe",
          image: "https://github.com/joelkur.png",
          id: "sq8048af0afha4",
          email: "johndoe@example.com",
        },
      },
    },
  },
};
