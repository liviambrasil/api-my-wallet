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

export function generateRegisterBody () {
    return {
        value: 500,
        description: 'test',
        type: '/entry',
    }
}