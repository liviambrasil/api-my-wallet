import faker from "faker";

export function generateSignUpBody () {
    return {
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: "123456",
    }
}

export function generateLoginBody (user) {
    return {
        email: user?.email || "test@test.br",
        password: user?.password || "1234"
    }
}