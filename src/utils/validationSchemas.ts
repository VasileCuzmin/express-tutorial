export const userValidationSchema = {
    name: {
        notEmpty: {
            errorMessage: "Name is required"
        },
        isString: {
            errorMessage: "Name must be a string"
        }
    },
    email: {
        notEmpty: {
            errorMessage: "Email is required"
        },
        isEmail: {
            errorMessage: "Email must be a valid email address"
        }
    },
    password: {
        notEmpty: {
            errorMessage: "Password is required"
        },
        isString: {
            errorMessage: "Password must be a string"
        }
    }
};