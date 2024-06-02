const signupValidation = (req, res, next) => {
    const { username, password, fullname, email } = req.body;
    const errors = [];
    /**
     * check missing data
     */
    if (!username) errors.push({ field: 'username', message: 'missing data' });
    if (!password) errors.push({ field: 'password', message: 'missing data' });
    if (!fullname) errors.push({ field: 'fullname', message: 'missing data' });
    if (!email) errors.push({ field: 'email', message: 'missing data' });
    /**
     * check data length
     */
    if (username && (username.length < 5 || username.length > 255)) {
        errors.push({ field: 'username', message: 'username must be between 5 - 255 characters' });
    }
    if (password && (password.length < 5 || password.length > 255)) {
        errors.push({ field: 'password', message: 'password must be between 5 -255 characters' });
    }
    if (fullname && (fullname.length > 255)) {
        errors.push({ field: 'fullname', message: 'fullname must be less than 255 characters' });
    }
    if (email && (email.length > 255)) {
        errors.push({ field: 'email', message: 'email must be less than 255 characters' });
    }
    /**
     * check data format
     */
    if (!/^[a-zA-Z][a-zA-Z0-9/]+$/.test(username)) {
        errors.push({ field: 'username', message: 'username must follow specified format a-z, A-Z, 0-9' });
    }
    if (!/^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]+$/.test(password)) {
        errors.push({ field: 'password', message: 'password must follow specified format a-z, A-Z, 0-9, !@#$%^&*()_+=-.' });
    }
    if (!/^[a-zA-Z\s]+$/.test(fullname)) {
        errors.push({ field: 'fullname', message: 'fullname cannot use special characters or numbers' });
    }
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        errors.push({ field: 'email', message: 'email has invalid format' })
    }
    if (errors.length != 0) return res.status(400).json(errors);
    next();
}

module.exports = { signupValidation };