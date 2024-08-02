export const AuthService = {
    isAuthenticated() {
        return !!localStorage.getItem('user');
    },
    login(user) {
        localStorage.setItem('user', JSON.stringify(user));
    },
    logout(router) {
        localStorage.removeItem('user');
        router.push({ name: 'auth-forms' });
    },
    getUser() {
        return JSON.parse(localStorage.getItem('user'));
    }
};
