export function generateSignUpBody () {
    return {
        name: 'Test',
        email: 'test@test.br',
        password: '1234'
    }
}

export function generateLoginBody (user) {
    return {
        email: user?.email || "test@test.br",
        password: user?.password || "1234"
    }
}